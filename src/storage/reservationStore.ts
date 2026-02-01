import { NotFoundError } from "../domain/errors";
import { Reservation } from "../domain/reservation";

const reservations: Reservation[] = [];

function cloneReservation(reservation: Reservation): Reservation {
  return { ...reservation };
}

export function createReservation(reservation: Reservation): void {
  reservations.push(cloneReservation(reservation));
}

export function findReservationById(id: string): Reservation {
  const reservation = reservations.find((reservation) => reservation.id === id);

  if (!reservation) {
    throw new NotFoundError("Reservation not found");
  }

  return cloneReservation(reservation);
}

export function deleteReservation(id: string): Reservation {
  const index = reservations.findIndex((reservation) => reservation.id === id);
  
  if (index === -1) {
    throw new NotFoundError("Reservation not found");
  }

  const [removed] = reservations.splice(index, 1);
  return cloneReservation(removed);
}

export function findReservationsByRoomId(roomId: string): Reservation[] {
  return reservations
    .filter((reservation) => reservation.roomId === roomId)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
    .map(cloneReservation);
}


export function getAllReservations(): Reservation[] {
  return reservations.map(cloneReservation);
}
