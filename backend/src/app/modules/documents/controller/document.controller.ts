// src/app/documents/documents.controller.ts
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

} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../multer.config';
import { DocumentsService } from '../services/document.service';
import JwtAuthGuard from '../../auth/jwt/jwt-auth.guard';
import { get } from 'http';
import { Response } from 'express';


@Controller('/documents')
export class DocumentsController {
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



}

