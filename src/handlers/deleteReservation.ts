import { FastifyRequest, FastifyReply } from "fastify";
import { findReservationById, deleteReservation } from "../storage/reservationStore";
import { ForbiddenError, NotFoundError } from "../domain/errors";

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
        if (err instanceof ForbiddenError) {
            return reply.status(403).send({ message: err.message });
        }
        if (err instanceof NotFoundError) {
            return reply.status(404).send({ message: err.message });
        }

        request.log.error(err);
        return reply.status(500).send({ message: "Internal server error" });
    }
}