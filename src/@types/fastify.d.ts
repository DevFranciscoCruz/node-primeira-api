import "fastify";
import { JwtPayload } from "jsonwebtoken";

declare module 'fastify' {
  export interface FastifyRequest {
    user?: JwtPayload
  }
}