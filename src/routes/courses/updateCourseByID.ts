import { eq } from "drizzle-orm"
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { db } from "../../database/client.ts"
import { courses } from "../../database/schema.ts"
import { checkRequestJWT } from "../../hooks/checkRequestJWT.ts"
import { checkUserRole } from "../../hooks/checkUserRole.ts"

export const updateCourseByID: FastifyPluginAsyncZod = async (app) => {
  app.put('/courses/:id', {
    preHandler: [
      checkRequestJWT,
      checkUserRole('manager')
    ],
    schema: {
      tags: ['courses'],
      summary: 'Replace a Course by ID',
      description: 'Replaces the specified course by its ID with new data.',
      params: z.object({
        id: z.uuid({ error: 'Invalid course ID' })
      }),
      body: z.object({
        title: z.string().min(5, "Title must have at least 5 characters."),
        description: z.string().nullable().optional()
      }),
      response: {
        200: z.object({
          course: z.object({
            id: z.uuid(),
            title: z.string(),
            description: z.string().nullable()
          })
        }).describe('Course replaced successfully.'),
        400: z.object({
          message: z.string()
        }).describe('Missing required parameters.'),
        404: z.object({
          message: z.string()
        }).describe('Course not found.')
      }
    }
  }, async (request, reply) => {
    const { id } = request.params

    if (!id) {
      return reply.status(400).send({ message: 'ID is required' });
    }

    const course = await db.select().from(courses).where(eq(courses.id, id))

    if (!course.length) {
      return reply.status(404).send({ message: 'Course not found' })
    }

    const { title, description } = request.body

    const updatedCourse = await db.update(courses)
      .set({
        title: title,
        description: description,
        updatedAt: new Date()
      })
      .where(eq(courses.id, id))
      .returning()

    return reply.status(200).send({ course: updatedCourse[0] })
  })
}