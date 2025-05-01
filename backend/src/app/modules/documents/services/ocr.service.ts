import { Injectable } from '@nestjs/common';
import * as Tesseract from 'tesseract.js';

@Injectable()
export class OcrService {
  async extractTextFromImage(buffer: Buffer): Promise<string> {
    const { data } = await Tesseract.recognize(buffer, 'eng', {
      logger: m => console.log(m), // Optional logger
    });
    return data.text;
  }
}
