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
    startTime: ISODateString;
    endTime: ISODateString;
}

interface CreateReservationHeaders {
    'x-user-id': string;
}

export async function createReservationHandler (
    request: FastifyRequest<{ 
        Headers: CreateReservationHeaders, 
        Body: CreateReservationBody, 
    }>,
    reply: FastifyReply,
) {
    const { roomId, startTime, endTime } = request.body;
    const userId = request.headers['x-user-id'];

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