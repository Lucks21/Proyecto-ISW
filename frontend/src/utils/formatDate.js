export function formatDate(date) {
  const mydate = date instanceof Date ? date : new Date(date);
  const day = String(mydate.getDate()).padStart(2, "0");
  const month = String(mydate.getMonth() + 1).padStart(2, "0"); // Los meses van de 0 a 11
  const year = mydate.getFullYear(); // Obteniendo el año completo

  return `${day}-${month}-${year}`;
}

export function formatTime(dateString) {
  // Crear un objeto Date a partir de la cadena
  const date = new Date(dateString);

  // Obtener las horas y minutos
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");

  // Devolver la cadena formateada
  return `${hours}:${minutes}`;
}

// Ejemplo de uso
//const formattedTime = formatTime("2424-07-22T13:00:00.000Z");
//console.log(formattedTime); // "13:00"

export function obtenerDiaSemana(fecha) {
  const diasSemana = [
    "domingo",
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
  ];
  const date = new Date(fecha);
  return diasSemana[date.getUTCDay()];
}
