import type { PDFPage, PDFFont } from 'pdf-lib';

/**
 * Dibuja un apartado de firma al pie de página.
 * @param page Página donde se dibuja.
 * @param font Fuente a utilizar.
 * @param signerName Nombre del firmante.
 */
export function agregarFirma(
  page: PDFPage,
  font: PDFFont,
  signerName: string
) {
  const { width } = page.getSize();
  const lineWidth = 200;
  const lineX = (width - lineWidth) / 2;
  const lineY = 100;

  // Línea de firma
  page.drawLine({
    start: { x: lineX, y: lineY },
    end: { x: lineX + lineWidth, y: lineY },
    thickness: 1,
    color: undefined,
  });

  // Nombre del firmante debajo de la línea
  page.drawText(signerName, {
    x: lineX + (lineWidth - font.widthOfTextAtSize(signerName, 12)) / 2,
    y: lineY - 20,
    size: 12,
    font,
  });
}
