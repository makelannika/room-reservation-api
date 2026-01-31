import { FastifyReply, FastifyRequest } from "fastify";
import { ConflictError, ForbiddenError, NotFoundError, ValidationError } from "../domain/errors";

export function handleError(err: unknown, request: FastifyRequest, reply: FastifyReply) {
    if (err instanceof ValidationError) {
        return reply.status(400).send({ message: err.message });
    }
    if (err instanceof ForbiddenError) {
        return reply.status(403).send({ message: err.message });
    }
    if (err instanceof NotFoundError) {
        return reply.status(404).send({ message: err.message });
    }
    if (err instanceof ConflictError) {
        return reply.status(409).send({ message: err.message });
    }

    request.log.error(err);
    return reply.status(500).send({ message: "Internal server error" });
}