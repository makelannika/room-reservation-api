import { FastifyRequest, FastifyReply } from "fastify";
import { findReservationsByRoomId } from "../storage/reservationStore";

interface GetReservationsByRoomParams {
    roomId: string;
}

export async function getReservationsByRoomHandler(
    request: FastifyRequest<{ Params: GetReservationsByRoomParams }>,
    reply: FastifyReply,
) {
    const { roomId } = request.params;
    const roomReservations = findReservationsByRoomId(roomId);
    
    return reply.send(roomReservations);
}