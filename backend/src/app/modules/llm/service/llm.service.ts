import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';

@Injectable()
export class LlmService {
  private openai: OpenAI;

  constructor(private readonly config: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.config.get<string>('OPENAI_API_KEY'),
    });
  }

  async analyzeExtractedText(text: string): Promise<string> {
    const prompt = `Analise o texto extraído de um documento e diga:
- qual é o tipo de documento (ex: RG, CPF, conta de luz, etc),
- e faça um resumo breve de seu conteúdo.
Texto: """${text}"""`;

    const chatResponse = await this.openai.chat.completions.create({
      model: 'gpt-4.1',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    return chatResponse.choices[0].message.content ?? 'Sem resposta da LLM.';
  }
}
