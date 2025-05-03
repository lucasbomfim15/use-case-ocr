import { Express, Response } from 'express';

export interface IDocumentsController {
  uploadDocument(file: Express.Multer.File, req: any): Promise<any>;
  getDocuments(req: ParameterDecorator): Promise<any>;
  getDocumentById(req: ParameterDecorator): Promise<any>;
  askAboutDocument(documentId: string, req: ParameterDecorator, question: string): Promise<{ response: string }>;
  downloadDocument(id: string, format: 'txt' | 'pdf', res: Response): Promise<void>;
  deleteDocument(id: string, req: ParameterDecorator): Promise<void>;
}
