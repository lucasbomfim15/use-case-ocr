import { Document } from '@prisma/client';
import { DownloadFile } from './downloadFile.interface';


export interface IDocumentsService {
  processDocument(file: Express.Multer.File, userId: string): Promise<Document>;
  getDocuments(userId: string): Promise<Document[]>;
  getDocumentById(userId: string, documentId: string): Promise<Document>;
  generateDownloadFile(id: string, format: 'txt' | 'pdf'): Promise<DownloadFile | null>;
  askLLM(extractedText: string, question: string): Promise<string>;
  deleteDocument(userId: string, documentId: string): Promise<void>;
}