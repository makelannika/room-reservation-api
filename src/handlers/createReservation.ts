import { FastifyRequest, FastifyReply } from "fastify";
import { randomUUID } from "crypto";
import { ISODateString } from "../domain/reservation";
import { Reservation } from "../domain/reservation";
import { parseDate, validateReservation } from "../domain/reservationRules";
import { getAllReservations, createReservation } from "../storage/reservationStore";
import { ConflictError, ValidationError } from "../domain/errors";

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
    try {
        const { roomId, startTime, endTime } = request.body;
        const userId = request.headers['x-user-id'];

        const start = parseDate(startTime);
        const end = parseDate(endTime);
        
        const existingReservations = getAllReservations();
        validateReservation(start, end, roomId, existingReservations);

        const reservation: Reservation = {
            id: randomUUID(),
            roomId,
            userId,
            startTime: start.toISOString(),
            endTime: end.toISOString(),
        };

        createReservation(reservation);
        return reply.status(201).send(reservation);

    } catch (err) {
        if (err instanceof ValidationError) {
            return reply.status(400).send({ message: err.message });
        }
        if (err instanceof ConflictError) {
            return reply.status(409).send({ message: err.message });
        }

        request.log.error(err);
        return reply.status(500).send({ message: "Internal server error" });
    }
}