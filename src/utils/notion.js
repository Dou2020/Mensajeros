import { Client } from "@notionhq/client";
//process.loadEnvFile();

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function getData() {
    try {
        const response = await notion.databases.query({
            database_id: process.env.NOTION_DATABASE_ID,
        });
        const extractedData = response.results.map((page) => {
            return {
                //properties: page.properties,
                nombre: page.properties.Nombre.title[0]?.plain_text,
                descripcion: page.properties.Descripcion.rich_text[0]?.plain_text,
                lugar: page.properties.Lugar.rich_text[0]?.plain_text,
                Estado: page.properties.Estado.status.name,
                fecha: page.properties.Fecha.date?.start,
                file: page.properties.Archivo.files[0]?.name,
            };
        });

        console.log(extractedData);
        
        return extractedData;
    } catch (error) {
        console.error(error);
        return [];
    }
}
