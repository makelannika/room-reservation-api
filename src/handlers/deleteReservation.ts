import { FastifyRequest, FastifyReply } from "fastify";
import { findReservationById, deleteReservation } from "../storage/reservationStore";
import { ForbiddenError, NotFoundError } from "../domain/errors";
import { handleError } from "./errorHandler";

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
    try {
        const { id } = request.params;
        const userId = request.headers['x-user-id'];
        
        const reservation = findReservationById(id);
        
        if (reservation.userId !== userId) {
            throw new ForbiddenError("You are not allowed to cancel this reservation");
        }
        
        const removed = deleteReservation(id);
        return reply.status(200).send(removed);

    } catch (err) {
        handleError(err, request, reply);
    }   
}