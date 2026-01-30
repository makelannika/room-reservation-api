import { FastifyRequest, FastifyReply } from "fastify";
import { ISODateString } from "../domain/reservation";
import { Reservation } from "../domain/reservation";
import { 
    parseDate,
    isOverlapping,
    validateReservationTime,
    generateId,
} from "../domain/reservationRules";
import { 
    getAllReservations,
    createReservation,
} from "../storage/reservationStore";

interface CreateReservationBody {
    roomId: string;
    userId: string;
    startTime: ISODateString;
    endTime: ISODateString;
}

export async function createReservationHandler (
    request: FastifyRequest<{ Body: CreateReservationBody }>,
    reply: FastifyReply,
) {
    const { roomId, userId, startTime, endTime } = request.body;

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