import { randomUUID } from "crypto"
import { eq } from "drizzle-orm"
import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { db } from "../../database/client.ts"
import { courses } from "../../database/schema.ts"
import { checkRequestJWT } from "../../hooks/checkRequestJWT.ts"
import { checkUserRole } from "../../hooks/checkUserRole.ts"

export const createCourseRoute: FastifyPluginAsyncZod = async (app) => {
  app.post('/courses',
    {
      preHandler: [
        checkRequestJWT,
        checkUserRole('manager')
      ],
      schema: {
        tags: ['courses'],
        summary: 'Create a course',
        description: 'This route creates a new course with a title and an optional description.',
        body: z.object({
          title: z.string().min(5, "Title must have at least 5 characters."),
          description: z.string().optional()
        }),
        response: {
          201: z.object({
            courseID: z.uuid()
          }).describe('Course created successfully.'),
          400: z.object({
            message: z.string()
          }).describe('Missing required parameters.'),
          409: z.object({
            message: z.string()
          }).describe('Course already exists.')
        }
      }
    }, async (request, reply) => {

      const { title, description } = request.body

      if (!title) {
        return reply.status(400).send({ message: 'Course title is required' })
      }

      const courseAlreadyExists = await db.select({ title: courses.title }).from(courses).where(eq(courses.title, title))

      if (courseAlreadyExists.length) {
        return reply.status(409).send({ message: 'Course already exists' })
      }

      const course = await db.insert(courses)
        .values({
          id: randomUUID(),
          title: title,
          description: description
        }).returning()

      return reply.status(201).send({ courseID: course[0].id })
    })
}