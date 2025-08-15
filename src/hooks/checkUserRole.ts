import type { FastifyReply, FastifyRequest } from "fastify";
import { getAuthenticatedUserFromRequest } from "../utils/getAuthenticatedUserFromRequest.ts";

export type Roles = 'student' | 'manager';

export function checkUserRole(role: Roles) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const user = getAuthenticatedUserFromRequest(request)

    if (user.role !== role) {
      return reply.status(401).send()
    }
  }
}