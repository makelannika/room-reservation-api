import { FastifyInstance } from "fastify";
import { createReservationHandler } from "../handlers/createReservation";
import { deleteReservationHandler } from "../handlers/deleteReservation";
import { getReservationsByRoomHandler } from "../handlers/getReservationsByRoom";
import { 
  createReservationSchema,
  deleteReservationSchema,
  getReservationsByRoomSchema,
} from "../schemas/reservationSchemas";

export async function registerReservationRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/reservations",
    { schema: createReservationSchema },
    createReservationHandler,
  );

  fastify.delete(
    "/reservations/:id",
    { schema: deleteReservationSchema },
    deleteReservationHandler,
  );

  fastify.get(
    "/rooms/:roomId/reservations",
    { schema: getReservationsByRoomSchema},
    getReservationsByRoomHandler,
  );
}

