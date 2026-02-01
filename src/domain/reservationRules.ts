import { ConflictError, ValidationError } from "./errors";
import { Reservation } from "./reservation";

export function parseDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new ValidationError("Invalid ISO date string");
  }

  return date;
}

export function isOverlapping(
  reservations: Reservation[],
  roomId: string,
  start: Date,
  end: Date
): boolean {
  return reservations
    .filter((reservation) => reservation.roomId === roomId)
    .some((reservation) => {
      const existingStart = new Date(reservation.startTime);
      const existingEnd = new Date(reservation.endTime);

      return existingStart < end && existingEnd > start;
    });
}

export function validateReservation(
  start: Date,
  end: Date,
  roomId: string,
  reservations: Reservation[]
) {
  const now = new Date();

  if (start >= end) {
    throw new ValidationError("startTime must be before endTime");
  }

  if (start < now) {
    throw new ValidationError("Reservations cannot be made in the past");
  }

  if (isOverlapping(reservations, roomId, start, end)) {
    throw new ConflictError("Reservation overlaps with an existing reservation for this room");
  }
}
