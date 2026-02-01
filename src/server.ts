import Fastify, { FastifyInstance } from "fastify";
import { registerReservationRoutes } from "./routes/reservations";

const fastify: FastifyInstance = Fastify({
  logger: true,
});

registerReservationRoutes(fastify);

const PORT = Number(process.env.PORT) || 3000;

const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();