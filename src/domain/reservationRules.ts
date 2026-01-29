import { Reservation } from "./reservation";

export function parseDate(value: string): Date | null {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function isOverlapping(
  existingReservations: Reservation[],
  roomId: string,
  start: Date,
  end: Date,
  ignoreReservationId?: string
): boolean {
  return existingReservations.some((reservation) => {
    if (reservation.roomId !== roomId) return false;
    if (ignoreReservationId && reservation.id === ignoreReservationId) {
      return false;
    }

    const existingStart = new Date(reservation.startTime);
    const existingEnd = new Date(reservation.endTime);

    return existingStart < end && existingEnd > start;
  });
}

export function validateReservationTime(
  start: Date,
  end: Date
): { valid: boolean; error?: string } {
  const now = new Date();

  if (start >= end) {
    return { valid: false, error: "startTime must be before endTime" };
  }

  if (start < now) {
    return { valid: false, error: "Reservations cannot be made in the past" };
  }

  return { valid: true };
}
