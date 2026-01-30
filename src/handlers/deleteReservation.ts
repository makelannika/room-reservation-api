import { FastifyRequest, FastifyReply } from "fastify";
import { findReservationById, deleteReservation } from "../storage/reservationStore";

interface DeleteReservationParams {
    id: string;
}

interface DeleteReservationHeaders {
    'x-user-id': string;
}

export async function deleteReservationHandler(
    request: FastifyRequest<{ 
        Params: DeleteReservationParams,
        Headers: DeleteReservationHeaders,
     }>,
    reply: FastifyReply,
) {
    const { id } = request.params;
    const userId = request.headers['x-user-id'];
    
    const reservation = findReservationById(id);

    if (!reservation) {
        return reply.status(404).send({ message: "Reservation not found" });
    }

    if (reservation?.userId !== userId) {
        return reply.status(403).send({ 
            message: 'You are not allowed to cancel this reservation' 
        });
    }

    const removed = deleteReservation(id);
    return reply.status(200).send(removed);
}