import { Client } from "@notionhq/client";
//process.loadEnvFile();

const notion = new Client({ auth: import.meta.env.NOTION_API_KEY });

interface ActividadJoven {
    nombre: string | undefined;
    descripcion: string | undefined;
    lugar: string | undefined;
    Estado: string | undefined;
    fecha: string | undefined;
    file: string | undefined;
}

interface ActividadAdulto {
    nombre: string | undefined;
    dirige: string | undefined;
    predica: string | undefined;
    fecha: string | undefined;
    tema: string | undefined;
    lugar: string | undefined;
    descripcion: string | undefined;
    file: string | undefined;
}

interface ActividadCelula {
    nombre: string | undefined;
    dirige: string | undefined;
    predica: string | undefined;
    lugar: string | undefined;
    descripcion: string | undefined;
    file: string | undefined;
}

interface InicioEvent {
    title: string | undefined;
    date: string | undefined;
    description: string | undefined;
    image: string | undefined;
    preside: string | undefined;
    predica: string | undefined;
    location: string | undefined;
    category: string | undefined;
}

// Database actividades de Jovenes
export async function getData(): Promise<ActividadJoven[]> {
    try {
        const response = await notion.databases.query({
            database_id: import.meta.env.NOTION_DATABASE_ID!,
            sorts: [
                {
                    property: "Estado",
                    direction: "ascending",
                },
                {
                    property: "Fecha",
                    direction: "descending",
                },
            ],
        });
        const extractedData = response.results.map((page: any) => {
            return {
                //properties: page.properties,
                nombre: page.properties.Nombre.title[0]?.plain_text,
                descripcion: page.properties.Descripcion.rich_text[0]?.plain_text,
                lugar: page.properties.Lugar.rich_text[0]?.plain_text,
                Estado: page.properties.Estado.status?.name,
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

// Database actividades de Adultos
export async function getData2(): Promise<ActividadAdulto[]> {
    try {
        const response = await notion.databases.query({
            database_id: import.meta.env.NOTION_DATABASE_ID2!,
            filter: {
                property: "Prioridad",
                status: {
                    equals: "Realizar",
                },
            },
            sorts: [
                {
                    property: "Fecha",
                    direction: "ascending",
                },
            ],
        });
        const extractedData = response.results.map((page: any) => {
            return {
                //properties: page.properties,
                nombre: page.properties.Nombre.title[0]?.plain_text,
                dirige: page.properties.Dirige?.rich_text[0]?.plain_text,
                predica: page.properties.Predica?.rich_text[0]?.plain_text,
                fecha: page.properties.Fecha.date?.start,
                tema: page.properties.Tema.rich_text[0]?.plain_text,
                lugar: page.properties.Lugar.rich_text[0]?.plain_text,
                descripcion: page.properties.Descripcion.rich_text[0]?.plain_text,
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

// Database actividades de Celulas
export async function getData3(): Promise<ActividadCelula[]> {
    if (! import.meta.env.NOTION_DATABASE_ID3) {
        console.error("NOTION_DATABASE_ID3 is not defined in environment variables.");
        return [];
    }

    try {
        const response = await notion.databases.query({
            database_id: import.meta.env.NOTION_DATABASE_ID3!,
            filter: {
                property: "Prioridad",
                status: {
                    equals: "Realizar",
                },
            },
        });
        const extractedData = response.results.map((page: any) => {
            return {
                //properties: page.properties,
                nombre: page.properties.Nombre.title[0]?.plain_text,
                dirige: page.properties.Dirige?.rich_text[0]?.plain_text,
                predica: page.properties.Predica?.rich_text[0]?.plain_text,
                lugar: page.properties.Lugar?.rich_text[0]?.plain_text,
                descripcion: page.properties.Descripcion?.rich_text[0]?.plain_text,
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

// Database eventos de Inicio
export async function getInicioEvents(): Promise<InicioEvent[]> {
    if (!import.meta.env.NOTION_DATABASE_ID_INICIO) {
        console.error("NOTION_DATABASE_ID_INICIO is not defined in environment variables.");
        return [];
    }

    try {
        const response = await notion.databases.query({
            database_id: import.meta.env.NOTION_DATABASE_ID_INICIO!,
            sorts: [
                {
                    property: "date",
                    direction: "descending",
                },
            ],
        });
        const extractedData = response.results.map((page: any) => {
            return {
                title: page.properties.title?.title[0]?.plain_text,
                date: page.properties.date?.date?.start,
                description: page.properties.description?.rich_text[0]?.plain_text,
                image: page.properties.image?.files[0]?.file?.url,
                preside: page.properties.preside?.rich_text[0]?.plain_text,
                predica: page.properties.predica?.rich_text[0]?.plain_text,
                location: page.properties.location?.rich_text[0]?.plain_text,
                category: page.properties.category?.select?.name,
            };
        });

        console.log("Inicio Events:", extractedData);
        
        return extractedData;
    } catch (error) {
        console.error("Error fetching inicio events:", error);
        return [];
    }
}
