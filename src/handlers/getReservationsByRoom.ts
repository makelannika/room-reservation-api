import { FastifyRequest, FastifyReply } from "fastify";
import { findReservationsByRoomId } from "../storage/reservationStore";

interface getReservationsByRoomParams {
    roomId: string;
}

export async function getReservationsByRoomHandler(
    request: FastifyRequest<{ Params: getReservationsByRoomParams }>,
    reply: FastifyReply,
) {
    const { roomId } = request.params;
    const roomReservations = findReservationsByRoomId(roomId);
    return reply.send(roomReservations);
}