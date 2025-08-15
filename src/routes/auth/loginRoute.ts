import { verify } from "argon2"
import { eq } from "drizzle-orm"
import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import jwt from "jsonwebtoken"
import z from "zod"
import { db } from "../../database/client.ts"
import { users } from "../../database/schema.ts"
import { env } from "../../validators/envValidator.ts"

export const loginRoute: FastifyPluginAsyncZod = async (app) => {
  app.post('/session',
    {
      schema: {
        tags: ['auth'],
        summary: 'Login a user',
        description: 'This route login the user',
        body: z.object({
          email: z.email({ error: 'Invalid email format.' }),
          password: z.string()
        }),
        response: {
          200: z.object({ token: z.string() }),
          400: z.object({ message: z.string() })
        }
      }
    }, async (request, reply) => {

      const { email, password } = request.body

      const result = await db.select().from(users).where(eq(users.email, email))

      if (!result.length) {
        return reply.status(400).send({ message: 'E-mail or Password is incorrect.' })
      }

      const user = result[0]
      const passwordMatch = await verify(user.password, password)

      if (!passwordMatch) {
        return reply.status(400).send({ message: 'E-mail or Password is incorrect.' })
      }

      const jwtToken = jwt.sign({
        subject: user.id,
        role: user.role
      }, env.JWT_SECRET)

      return reply.status(200).send({ token: jwtToken })
    })
}