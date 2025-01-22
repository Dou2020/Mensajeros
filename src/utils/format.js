//import { compareAsc, format } from "date-fns";

export async function getformat(dateString) {

    //console.log(dateString);

    const dateParts = dateString.split('-'); // Divide la fecha en partes [2025, 01, 18]

    // Crear la fecha como UTC
    const date = new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2])); // Mes es 0-indexado

    //console.log(date);

    // Opciones de formato
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };


    // Formatear fecha para Guatemala
    const formattedDate = new Intl.DateTimeFormat('es-GT', options).format(date);
    //console.log(formattedDate);
    return formattedDate;

}