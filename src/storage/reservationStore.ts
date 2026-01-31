import { Reservation } from "../domain/reservation";

// In-memory "database"
const reservations: Reservation[] = [];

function cloneReservation(reservation: Reservation): Reservation {
  return { ...reservation };
}

export function createReservation(reservation: Reservation): void {
  reservations.push(cloneReservation(reservation));
}

export function findReservationById(id: string): Reservation | undefined {
  const reservation = reservations.find((reservation) => reservation.id === id);

  return reservation ? cloneReservation(reservation) : undefined;
}

export function deleteReservation(id: string): Reservation | undefined {
  const index = reservations.findIndex((reservation) => reservation.id === id);
  
  if (index === -1) {
    return undefined;
  }

  const [removed] = reservations.splice(index, 1);
  return cloneReservation(removed);
}

export function findReservationsByRoomId(roomId: string): Reservation[] {
  return reservations
    .filter((reservation) => reservation.roomId === roomId)
    .sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    )
    .map(cloneReservation);
}

export function getAllReservations(): Reservation[] {
  return reservations.map(cloneReservation);
}
