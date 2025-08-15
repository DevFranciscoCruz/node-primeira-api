import type { FastifyReply, FastifyRequest } from "fastify";
import jwt from 'jsonwebtoken';
import { env } from "../validators/envValidator.ts";

type JWTPayload = {
  sub: string
  role: 'student' | 'manager'
}

export async function checkRequestJWT(request: FastifyRequest, reply: FastifyReply) {
  const token = request.headers.authorization

  if (!token) {
    return reply.status(401).send()
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JWTPayload

    request.user = payload
  } catch (error) {
    return reply.status(401).send()
  }
}