import Fastify, { FastifyInstance } from "fastify";
import { registerReservationRoutes } from "./routes/reservations";

const fastify: FastifyInstance = Fastify({
  logger: true,
});

// Register routes
registerReservationRoutes(fastify);

const PORT = Number(process.env.PORT) || 3000;

fastify
  .listen({ port: PORT, host: "0.0.0.0" })
  .then(() => {
    fastify.log.info(`Server listening on port ${PORT}`);
  })
  .catch((err) => {
    fastify.log.error(err);
    process.exit(1);
  });

