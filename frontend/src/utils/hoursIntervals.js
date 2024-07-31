import { formatDate, formatTime, obtenerDiaSemana } from "./formatDate";

function buscarCoincidencias(reservas, implementos) {
  return reservas.map((reserva) => {
    const diaReserva = obtenerDiaSemana(reserva.fechaInicio);
    const inicioReserva = formatTime(reserva.fechaInicio);
    const finReserva = formatTime(reserva.fechaFin);

    const implemento = implementos.find(
      (impl) =>
        impl._id === reserva.implementoId &&
        impl.horarioDisponibilidad.some(
          (horario) =>
            horario.dia === diaReserva &&
            horario.inicio <= inicioReserva &&
            horario.fin >= finReserva
        )
    );

    return {
      ...reserva,
      implemento: implemento ? implemento.nombre : "No disponible",
    };
  });
}

function isHourUnavailable(reservasActivas = [], selectedDate, hour, item, day) {
  return reservasActivas.some((element) => {
    const { fechaInicio, fechaFin, estado, implementoId, instalacionId } =
      element;

    const selectedDateFormated = formatDate(selectedDate);

    const diaReserva = obtenerDiaSemana(fechaInicio);
    const diaSelected = obtenerDiaSemana(selectedDate);
    const dateInicio = formatDate(fechaInicio);
    const dateFin = formatDate(fechaFin);
    const timeInicio = formatTime(fechaInicio);
    const timeFin = formatTime(fechaFin);
    const itemId = implementoId ? implementoId : instalacionId;
    console.log({
      selectedDateFormated,
      dateInicio,
      dateFin,
      timeInicio,
      timeFin,
      hour,
      diaReserva,
      diaSelected,
      itemId,
      "item._id": item._id,
      day,
    });
    return (
      selectedDateFormated === dateInicio &&
      item._id === itemId &&
      timeInicio === hour &&
      day.toLowerCase() === diaSelected.toLocaleLowerCase() &&
      day.toLowerCase() === diaReserva.toLocaleLowerCase()
    );
  });
}

export function generateHourlyIntervals(
  startTime,
  endTime,
  day,
  selectedDate,
  reservasActivas,
  item
) {
  const [start] = startTime.split(":").map((t) => parseInt(t, 10));
  const [end] = endTime.split(":").map((t) => parseInt(t, 10));
  const timesArray = [];

  for (let hour = start; hour < end; hour++) {
    const hourStr = `${String(hour).padStart(2, "0")}:00`;
    timesArray.push({
      hour: hourStr,
      disponible: !isHourUnavailable(
        reservasActivas,
        selectedDate,
        hourStr,
        item,
        day
      ),
    });
  }

  return timesArray;
}
