export function formatDanfText(rawText: string): string {
    const lines = rawText.split('\n').map(line => line.trim()).filter(Boolean);
  
    // Limpeza básica e agrupamento por blocos visuais
    let formatted = '';
    let isInNoteBlock = false;
  
    for (const line of lines) {
      // Agrupar por blocos principais (exemplo simplificado)
      if (line.includes('DANFE')) {
        formatted += `\n\n **Tipo de Documento:** ${line}\n`;
      } else if (line.startsWith('Companhia') || line.includes('COELBA')) {
        formatted += ` **Emitente:** ${line}\n`;
      } else if (line.match(/CNPJ\s+\d/)) {
        formatted += ` **CNPJ e IE:** ${line}\n`;
      } else if (line.includes('ENDERECO') || line.match(/CEP\s+\d/)) {
        formatted += ` **Endereço:** ${line}\n`;
      } else if (line.match(/CPF\s+\d/)) {
        formatted += ` **Cliente (CPF):** ${line}\n`;
      } else if (line.match(/Nota fiscal/)) {
        formatted += ` **Nota Fiscal:** ${line}\n`;
        isInNoteBlock = true;
      } else if (isInNoteBlock && line.includes('https')) {
        formatted += `🔗 **Consulta online:** ${line}\n`;
      } else if (line.match(/^\d{4} \d{4}/)) {
        formatted += ` **Chave de acesso:** ${line}\n`;
      } else {
        formatted += `${line}\n`;
      }
    }
  
    return formatted.trim();
  }