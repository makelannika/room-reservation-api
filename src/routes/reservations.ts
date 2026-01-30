import { FastifyInstance } from "fastify";
import { createReservationHandler } from "../handlers/createReservation";
import { deleteReservationHandler } from "../handlers/deleteReservation";
import { getReservationsByRoomHandler } from "../handlers/getReservationsByRoom";

export async function registerReservationRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/reservations",
    createReservationHandler,
  );

  fastify.delete(
    "/reservations/:id",
    deleteReservationHandler,
  );

  fastify.get(
    "/rooms/:roomId/reservations",
    getReservationsByRoomHandler,
  );
}
