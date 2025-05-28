import type { PDFPage, PDFFont } from 'pdf-lib';

/**
 * Dibuja texto justificado en una página PDF.
 *
 * @param page Página PDF en la que se dibuja el texto.
 * @param text Texto completo que se desea justificar.
 * @param x Coordenada X inicial.
 * @param y Coordenada Y inicial.
 * @param width Ancho máximo del bloque de texto.
 * @param font Fuente a utilizar.
 * @param fontSize Tamaño de la fuente.
 * @param lineHeight Altura entre líneas.
 * @returns La coordenada Y final tras dibujar el texto.
 */
export function drawJustifiedText(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  width: number,
  font: PDFFont,
  fontSize: number,
  lineHeight: number
): number {
  const words = text.split(/\s+/);
  let line: string[] = [];
  let lines: string[][] = [];
  let currentLineWidth = 0;

  for (const word of words) {
    const wordWidth = font.widthOfTextAtSize(word, fontSize);
    const spaceWidth = font.widthOfTextAtSize(' ', fontSize);
    const testLineWidth = currentLineWidth + wordWidth + (line.length > 0 ? spaceWidth : 0);

    if (testLineWidth > width) {
      lines.push(line);
      line = [word];
      currentLineWidth = wordWidth;
    } else {
      line.push(word);
      currentLineWidth = testLineWidth;
    }
  }

  if (line.length > 0) {
    lines.push(line);
  }

  for (let i = 0; i < lines.length; i++) {
    const lineWords = lines[i];
    const isLastLine = i === lines.length - 1;
    const totalWordWidth = lineWords
      .map(word => font.widthOfTextAtSize(word, fontSize))
      .reduce((a, b) => a + b, 0);

    let gap = font.widthOfTextAtSize(' ', fontSize);
    if (!isLastLine && lineWords.length > 1) {
      const extraSpace = (width - totalWordWidth) / (lineWords.length - 1);
      gap = extraSpace;
    }

    let xCursor = x;
    for (let j = 0; j < lineWords.length; j++) {
      const word = lineWords[j];
      page.drawText(word, {
        x: xCursor,
        y,
        size: fontSize,
        font,
      });
      xCursor += font.widthOfTextAtSize(word, fontSize) + gap;
    }

    y -= lineHeight;
  }

  return y;
}
