import type { PDFPage, PDFFont, PDFDocument } from 'pdf-lib';
import { rgb } from 'pdf-lib';

/**
 * Agrega un encabezado con el logo alineado a la izquierda
 * y el título + subtítulo centrados horizontalmente.
 */
export async function agregarEncabezado(
  doc: PDFDocument,
  page: PDFPage,
  font: PDFFont,
  title: string,
  subtitle: string,
  logoBytes: Uint8Array
): Promise<number> {
  const { width } = page.getSize();

  // --- LOGO ---
  const logoImage = await doc.embedPng(logoBytes);
  const logoHeight = 60;
  const logoDims = logoImage.scale(logoHeight / logoImage.height);

  const logoX = 50;
  const logoY = 720;

  page.drawImage(logoImage, {
    x: logoX,
    y: logoY,
    width: logoDims.width,
    height: logoDims.height,
  });

  // --- TÍTULO Y SUBTÍTULO CENTRADOS ---
  const titleFontSize = 30;
  const subtitleFontSize = 22;
  const navyColor = rgb(0, 0, 0.5); // Azul marino

  const titleWidth = font.widthOfTextAtSize(title, titleFontSize);
  const subtitleWidth = font.widthOfTextAtSize(subtitle, subtitleFontSize);
  const maxTextWidth = Math.max(titleWidth, subtitleWidth);

  const textX = (width - maxTextWidth) / 2;
  const textY = logoY + logoDims.height - titleFontSize;

  page.drawText(title, {
    x: textX,
    y: textY,
    size: titleFontSize,
    font,
    color: navyColor,
  });

  page.drawText(subtitle, {
    x: (width - subtitleWidth) / 2,
    y: textY - subtitleFontSize - 4,
    size: subtitleFontSize,
    font,
    color: navyColor,
  });

  // Retorna coordenada Y para continuar el contenido
  return logoY - 50;
}
