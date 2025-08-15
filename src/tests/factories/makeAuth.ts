import jwt from "jsonwebtoken"
import { Roles } from "../../hooks/checkUserRole.ts"
import { makeUser } from "./makeUser.ts"

export async function makeAuthenticatedUser(role: Roles) {
  const { user } = await makeUser(role)

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required.')
  }

  const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET)

  return { user, token }
}