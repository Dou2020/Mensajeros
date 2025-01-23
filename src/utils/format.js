//import { compareAsc, format } from "date-fns";

import { z } from "astro:content";

export async function getformat(dateString) {

    console.log(dateString);

    //const dateParts = dateString.split('-'); // Divide la fecha en partes [2025, 01, 18]

    // Crear la fecha como UTC
    const date = new Date(
        //Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2])
        dateString
    ); // Mes es 0-indexado

    //console.log(date);

    // Opciones de formato
    const options = { 
        weekday: 'long',  // Formato de día de la semana
        year: 'numeric', // Formato de año
        month: 'long',  // Formato de mes
        day: 'numeric', // Formato de fecha
        timeZone: 'America/Guatemala', // Zona horaria de Guatemala (CST)
        hour: '2-digit', // Formato de 24 horas
        minute: '2-digit', // Minutos
        hour12: true, // Formato de 12 horas
    };


    // Formatear fecha para Guatemala
    const formattedDate = new Intl.DateTimeFormat('es-GT', options).format(date);
    console.log(formattedDate);
    return formattedDate;

}