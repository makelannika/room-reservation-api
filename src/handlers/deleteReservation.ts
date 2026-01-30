import { FastifyRequest, FastifyReply } from "fastify";
import { deleteReservation } from "../storage/reservationStore";

interface deleteReservationParams{
    id: string;
}

export async function deleteReservationHandler(
    request: FastifyRequest<{ Params: deleteReservationParams }>,
    reply: FastifyReply,
) {
    const { id } = request.params;
    const removed = deleteReservation(id);

    if (!removed) {
    return reply.status(404).send({ message: "Reservation not found" });
    }

    return reply.status(200).send(removed);
}