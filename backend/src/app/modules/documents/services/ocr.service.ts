import { Injectable } from '@nestjs/common';
import * as Tesseract from 'tesseract.js';
import { IOcrService } from '../interfaces/ocr-service.interface';

@Injectable()
export class OcrService implements IOcrService {
  async extractTextFromImage(buffer: Buffer): Promise<string> {
    const { data } = await Tesseract.recognize(buffer, 'eng', {
      logger: m => console.log(m), // Optional logger
    });
    return data.text;
  }
}
