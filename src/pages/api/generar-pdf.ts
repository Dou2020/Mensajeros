import type { APIRoute } from 'astro';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { join } from 'path';
import fs from 'fs/promises';
import { drawJustifiedText } from '../../lib/drawJustifiedText';
import { agregarEncabezado } from '../../lib/agregarEncabezado';
import { agregarFirma } from '../../lib/agregarFirma';

export const prerender = false;

export const POST: APIRoute = async () => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // Tamaño Carta
  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const { width, height } = page.getSize();


  // Cargar logo desde public/logo.png
  const imagePath = join(process.cwd(), 'public', 'icono.png');
  const logoBytes = await fs.readFile(imagePath);

  let y = await agregarEncabezado(
    pdfDoc,
    page,
    font,
    'Sociedad de Jóvenes',
    'Mensajeros del Maestro',
    logoBytes
  );

  const fechaActual = new Date();

// Día en español
const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const meses = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];

const diaSemana = dias[fechaActual.getDay()];
const dia = fechaActual.getDate().toString().padStart(2, '0');
const mes = meses[fechaActual.getMonth()];
const anio = fechaActual.getFullYear();

const lineaFecha = `Fecha: ${capitalizar(diaSemana)} ${dia} de ${mes} de ${anio}.`;

// Función para capitalizar la primera letra
function capitalizar(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

  // === CABECERA DEL INFORME ===
  const encabezado = [
    lineaFecha,
    'A: Directiva Mensajeros del Maestro, Iglesia Sinaí, Retalhuleu.',
    'De: Walter Salvador Zea De La Cruz.',
    'Cargo: Creador Digital.',
    'Asunto: Informe de Actividades del mes de '+mes+'.',
  ];

  encabezado.forEach(line => {
    page.drawText(line, { x: 50, y, size: 12, font });
    y -= 18;
  });

  y -= 15;

  // === CUERPO DEL INFORME ===
  const parrafo = `Estimados miembros de la directiva mensajeros del maestro. Dios los bendiga, un gusto saludarlos y desearles toda clase de éxitos en sus actividades diarias. 
La pretensión del presente informe es dar cuenta del desarrollo de las actividades realizadas durante el mes de `+mes+`  del año `+anio+`.`;

page.drawText('INFORME DE ACTIVIDADES:', { x: 50, y, size: 12, font });
y -= 18;

y = drawJustifiedText(
  page,
  parrafo,
  50,     // x
  y,      // y inicial
  512,    // ancho del área del texto
  font,
  12,
  16
);


  y -= 10;

  // === LISTA DE ACTIVIDADES ===
  const actividades = [
    'Asistí a la sesión de planificación de actividades de todo el año.',
    'Asistí a los últimos 2 servicios del mes.',
    'Elaboré el Arte de las últimas 2 actividades del mes.',
    'Elaboré portada y perfil en el Facebook de la sociedad.',
  ];

  page.drawText('ACTIVIDADES REALIZADAS:', { x: 50, y, size: 12, font });
  y -= 18;

  actividades.forEach(act => {
    page.drawText(`• ${act}`, { x: 60, y, size: 12, font });
    y -= 16;
  });

  agregarFirma(page, font, 'Walter Salvador Zea De La Cruz');

  const pdfBytes = await pdfDoc.save();

  return new Response(pdfBytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="informe.pdf"',
    },
  });

};


