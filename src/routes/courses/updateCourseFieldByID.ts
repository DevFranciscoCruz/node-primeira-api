import { eq } from "drizzle-orm"
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { db } from "../../database/client.ts"
import { courses } from "../../database/schema.ts"
import { checkRequestJWT } from "../../hooks/checkRequestJWT.ts"
import { checkUserRole } from "../../hooks/checkUserRole.ts"

export const updateCourseFieldByID: FastifyPluginAsyncZod = async (app) => {
  app.patch('/courses/:id', {
    preHandler: [
      checkRequestJWT,
      checkUserRole('manager')
    ],
    schema: {
      tags: ['courses'],
      summary: 'Update a Course by ID',
      description: 'Updates one or more fields of the specified course by its ID.',
      params: z.object({
        id: z.uuid({ error: 'Invalid course ID' })
      }),
      body: z.object({
        title: z.string().min(5, "Title must have at least 5 characters.").optional(),
        description: z.string().nullable().optional()
      }).refine(data => Object.keys(data).length > 0, {
        error: "At least one field must be provided."
      }),
      response: {
        200: z.object({
          course: z.object({
            id: z.uuid(),
            title: z.string(),
            description: z.string().nullable()
          })
        }).describe('Course updated successfully.'),
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

    type CourseUpdate = {
      title?: string
      description?: string | null
    }

    const updateData: CourseUpdate = {}


    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description

    const updatedCourse = await db.update(courses)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(courses.id, id))
      .returning()

    return reply.status(200).send({ course: updatedCourse[0] })
  })
}