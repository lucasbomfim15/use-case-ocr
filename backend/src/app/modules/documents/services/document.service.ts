// src/app/modules/documents/services/document.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/app/shared/prisma/prisma.service';
import * as Tesseract from 'tesseract.js';
import { GroqService } from '../../groq/service/groq.service';
import * as PDFDocument from 'pdfkit';
import * as stream from 'stream';
import { DownloadFile } from '../interfaces/downloadFile.interface';
import { formatDanfText } from 'src/app/shared/utils/format-danf-text';

@Injectable()
export class DocumentsService {
  constructor(
    private prisma: PrismaService,
    private groq: GroqService 
  ) {}

  async processDocument(file: Express.Multer.File, userId: string) {
    const imagePath = file.path;
    const { data } = await Tesseract.recognize(imagePath, 'eng');
    const extractedText = data.text;

    const formattedText = formatDanfText(extractedText);

    const analysisResponse = await this.groq.analyzeExtractedText(extractedText);

    const document = await this.prisma.document.create({
      data: {
        userId,
        imageUrl: imagePath,
        extractedText: formattedText,
        llmResponse: analysisResponse,
      },
    });

    return document;
  }

  async getDocuments(userId: string) {
    const documents = await this.prisma.document.findMany({
      where: { userId },
    });

    return documents;
  }

  async getDocumentById(userId: string, documentId: string) {
    const document = await this.prisma.document.findFirst({
      where: { id: documentId, userId },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return document;
  }

  async generateDownloadFile(id: string, format: 'txt' | 'pdf'): Promise<DownloadFile | null> {
    const document = await this.prisma.document.findUnique({ where: { id } });

    if (!document) return null;

    const content = `
      OCR:\n${document.extractedText || 'N/A'}\n\n
      LLM:\n${document.llmResponse || 'N/A'}
    `;

    if (format === 'txt') {
      return {
        buffer: Buffer.from(content),
        contentType: 'text/plain',
      };
    } else if (format === 'pdf') {
      const doc = new PDFDocument();
      const bufferStream = new stream.PassThrough();
      const chunks: any[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => bufferStream.end());

      doc.text(content);
      doc.end();

      return new Promise((resolve) => {
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(chunks);
          resolve({
            buffer: pdfBuffer,
            contentType: 'application/pdf',
          });
        });
      });
    }

    return null;
  }

  async deleteDocument(userId: string, documentId: string) {
    const document = await this.prisma.document.findFirst({
      where: { id: documentId, userId },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    await this.prisma.document.delete({ where: { id: documentId } });
  }
}