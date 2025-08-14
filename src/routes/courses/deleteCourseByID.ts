import { eq } from "drizzle-orm"
import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { db } from "../../database/client.ts"
import { courses } from "../../database/schema.ts"

export const deleteCourseByID: FastifyPluginAsyncZod = async (app) => {
  app.delete('/courses/:id', {
    schema: {
      tags: ['courses'],
      summary: 'Delete a course by ID',
      description: 'This route deletes a course by its ID.',
      params: z.object({
        id: z.uuid({ message: 'Invalid course ID' })
      }),
      response: {
        200: z.object({
          message: z.string()
        }).describe('Course deleted successfully.'),
        404: z.object({
          message: z.string()
        }).describe('Course not found.')
      }
    }
  }, async (request, reply) => {

    const { id } = request.params
    const course = await db.select().from(courses).where(eq(courses.id, id))

    if (course.length > 0) {
      await db.delete(courses).where(eq(courses.id, id))
      return reply.status(200).send({ message: 'Course deleted successfully' })
    } else {
      return reply.status(404).send({ message: 'Course not found' })
    }
  })
}