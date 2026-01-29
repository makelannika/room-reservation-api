import { FastifyInstance } from "fastify";
import { Reservation, ISODateString } from "../domain/reservation";
import {
  parseDate,
  generateId,
  isOverlapping,
  validateReservationTime,
} from "../domain/reservationRules";
import {
  createReservation,
  findReservationById,
  deleteReservation,
  findReservationsByRoomId,
  getAllReservations,
} from "../storage/reservationStore";

export interface CreateReservationInput {
  roomId: string;
  userId: string;
  startTime: ISODateString;
  endTime: ISODateString;
}

export async function registerReservationRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: CreateReservationInput }>(
    "/reservations",
    async (request, reply) => {
      const { roomId, userId, startTime, endTime } = request.body;

      if (!roomId || !userId || !startTime || !endTime) {
        return reply.status(400).send({
          message: "roomId, userId, startTime and endTime are required",
        });
      }

      const start = parseDate(startTime);
      const end = parseDate(endTime);

      if (!start || !end) {
        return reply
          .status(400)
          .send({ message: "startTime and endTime must be valid ISO date strings" });
      }

      const timeValidation = validateReservationTime(start, end);
      if (!timeValidation.valid) {
        return reply.status(400).send({ message: timeValidation.error });
      }

      const allReservations = getAllReservations();
      if (isOverlapping(allReservations, roomId, start, end)) {
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

      createReservation(reservation);

      return reply.status(201).send(reservation);
    }
  );

  fastify.delete<{ Params: { id: string } }>(
    "/reservations/:id",
    async (request, reply) => {
      const { id } = request.params;
      const removed = deleteReservation(id);

      if (!removed) {
        return reply.status(404).send({ message: "Reservation not found" });
      }

      return reply.status(200).send(removed);
    }
  );

  fastify.get<{ Params: { roomId: string } }>(
    "/rooms/:roomId/reservations",
    async (request, reply) => {
      const { roomId } = request.params;
      const roomReservations = findReservationsByRoomId(roomId);
      return reply.send(roomReservations);
    }
  );
}
