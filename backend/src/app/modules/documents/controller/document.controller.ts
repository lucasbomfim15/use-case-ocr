import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
  Get,
  Param,
  Query,
  NotFoundException,
  Res,
  Delete,
  Body,

} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../multer.config';
import { DocumentsService } from '../services/document.service';
import JwtAuthGuard from '../../auth/jwt/jwt-auth.guard';
import { get } from 'http';
import { Response } from 'express';
import { IDocumentsController } from '../interfaces/document-controller.interface';


@Controller('/documents')
export class DocumentsController implements IDocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('/upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadDocument(@UploadedFile() file: Express.Multer.File, @Request() req) {
    const userId = req.user.sub;
    return this.documentsService.processDocument(file, userId);
  }


  @Get()
  @UseGuards(JwtAuthGuard)
  async getDocuments(@Request() req) {
    const userId = req.user.sub;
    return this.documentsService.getDocuments(userId);
  }

  @Get("/:id")
  @UseGuards(JwtAuthGuard)
  async getDocumentById(@Request() req) {
    const userId = req.user.sub;
    const documentId = req.params.id;
    return this.documentsService.getDocumentById(userId, documentId);
  }

  @Post('/:id/ask')
  @UseGuards(JwtAuthGuard)
  async askAboutDocument(
    @Param('id') documentId: string,
    @Request() req,
    @Body('question') question: string
  ) {
    const userId = req.user.sub;
    const document = await this.documentsService.getDocumentById(userId, documentId);

    if (!document || !document.extractedText) {
      throw new NotFoundException('Documento não encontrado ou sem conteúdo OCR.');
    }

    const response = await this.documentsService.askLLM(document.extractedText, question);
    return { response };
  }

  @Get(':id/download')
  @UseGuards(JwtAuthGuard)
  async downloadDocument(
    @Param('id') id: string,
    @Query('format') format: 'txt' | 'pdf',
    @Res({ passthrough: false }) res: Response,
  ) {
    const file = await this.documentsService.generateDownloadFile(id, format);

    if (!file) {
      throw new NotFoundException('Documento não encontrado');
    }

    res.setHeader('Content-Disposition', `attachment; filename=document.${format}`);
    res.setHeader('Content-Type', file.contentType);
    res.send(file.buffer);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteDocument(@Param('id') id: string, @Request() req) {
    const userId = req.user.sub;
    return this.documentsService.deleteDocument(userId, id);
  }



}

