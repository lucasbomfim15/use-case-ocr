import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Groq } from 'groq-sdk';

@Injectable()
export class GroqService {
  private groq: Groq;

  constructor(private readonly config: ConfigService) {
    this.groq = new Groq({
      apiKey: this.config.get<string>('GROQ_API_KEY'), // Altere para GROQ_API_KEY no .env
    });
  }

  async analyzeExtractedText(text: string): Promise<string> {
    const prompt = `Analise o texto extraído de um documento e diga:
- qual é o tipo de documento (ex: RG, CPF, conta de luz, etc),
- e faça um resumo breve de seu conteúdo.
Texto: """${text}"""`;

    try {
      const chatResponse = await this.groq.chat.completions.create({
        model: 'llama3-70b-8192', // Ou 'mixtral-8x7b-32768'
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3, // Recomendado para análise documental
        max_tokens: 1024, // Limite de tokens de resposta
      });

      return chatResponse.choices[0]?.message?.content ?? 'Sem resposta da LLM.';
    } catch (error) {
      console.error('Erro na chamada à Groq API:', error);
      throw new Error('Falha ao analisar texto com Groq');
    }
  }


  async askAboutDocument(text: string, question: string): Promise<string> {
    const prompt = `Baseado no seguinte conteúdo de documento:
  
  """${text}"""
  
  Responda à pergunta: "${question}"`;
  
    try {
      const chatResponse = await this.groq.chat.completions.create({
        model: 'llama3-70b-8192',
        messages: [
          { role: 'user', content: prompt },
        ],
        temperature: 0.5,
        max_tokens: 1024,
      });
  
      return chatResponse.choices[0]?.message?.content ?? 'Sem resposta da LLM.';
    } catch (error) {
      console.error('Erro na Groq ao responder pergunta:', error);
      throw new Error('Falha ao perguntar à LLM');
    }
  }
}