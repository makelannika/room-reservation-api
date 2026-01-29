import { Reservation } from "../domain/reservation";

// In-memory "database"
const reservations: Reservation[] = [];

export function createReservation(reservation: Reservation): void {
  reservations.push(reservation);
}

export function findReservationById(id: string): Reservation | undefined {
  return reservations.find((reservation) => reservation.id === id);
}

export function deleteReservation(id: string): Reservation | undefined {
  const index = reservations.findIndex((reservation) => reservation.id === id);
  if (index === -1) {
    return undefined;
  }
  const [removed] = reservations.splice(index, 1);
  return removed;
}

export function findReservationsByRoomId(roomId: string): Reservation[] {
  return reservations
    .filter((reservation) => reservation.roomId === roomId)
    .sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
}

export function getAllReservations(): Reservation[] {
  return [...reservations];
}
