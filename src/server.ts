import Fastify, { FastifyInstance } from "fastify";

type ISODateString = string;

interface Reservation {
  id: string;
  roomId: string;
  userId: string;
  startTime: ISODateString;
  endTime: ISODateString;
}

interface CreateReservationBody {
  roomId: string;
  userId: string;
  startTime: ISODateString;
  endTime: ISODateString;
}

// In-memory "database"
const reservations: Reservation[] = [];

const fastify: FastifyInstance = Fastify({
  logger: true,
});

function parseDate(value: string): Date | null {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
}

function isOverlapping(
  roomId: string,
  start: Date,
  end: Date,
  ignoreReservationId?: string
): boolean {
  return reservations.some((reservation) => {
    if (reservation.roomId !== roomId) return false;
    if (ignoreReservationId && reservation.id === ignoreReservationId) {
      return false;
    }

    const existingStart = new Date(reservation.startTime);
    const existingEnd = new Date(reservation.endTime);

    return existingStart < end && existingEnd > start;
  });
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

fastify.post<{ Body: CreateReservationBody }>("/reservations", async (request, reply) => {
  const { roomId, userId, startTime, endTime } = request.body;

  if (!roomId || !userId || !startTime || !endTime) {
    return reply.status(400).send({
      message: "roomId, userId, startTime and endTime are required",
    });
  }

  const start = parseDate(startTime);
  const end = parseDate(endTime);
  const now = new Date();

  if (!start || !end) {
    return reply.status(400).send({ message: "startTime and endTime must be valid ISO date strings" });
  }

  if (start >= end) {
    return reply.status(400).send({ message: "startTime must be before endTime" });
  }

  if (start < now) {
    return reply.status(400).send({ message: "Reservations cannot be made in the past" });
  }

  if (isOverlapping(roomId, start, end)) {
    return reply.status(409).send({
      message: "Reservation overlaps with an existing reservation for this room",
    });
  }

  const reservation: Reservation = {
    id: generateId(),
    roomId,
    userId,
    startTime: start.toISOString(),
    endTime: end.toISOString(),
  };

  reservations.push(reservation);

  return reply.status(201).send(reservation);
});

fastify.delete<{ Params: { id: string } }>("/reservations/:id", async (request, reply) => {
  const { id } = request.params;
  const index = reservations.findIndex((reservation) => reservation.id === id);

  if (index === -1) {
    return reply.status(404).send({ message: "Reservation not found" });
  }

  const [removed] = reservations.splice(index, 1);

  return reply.status(200).send(removed);
});

fastify.get<{ Params: { roomId: string } }>("/rooms/:roomId/reservations", async (request, reply) => {
  const { roomId } = request.params;

  const roomReservations = reservations
    .filter((reservation) => reservation.roomId === roomId)
    .sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

  return reply.send(roomReservations);
});

const PORT = Number(process.env.PORT) || 3000;

fastify
  .listen({ port: PORT, host: "0.0.0.0" })
  .then(() => {
    fastify.log.info(`Server listening on port ${PORT}`);
  })
  .catch((err) => {
    fastify.log.error(err);
    process.exit(1);
  });

