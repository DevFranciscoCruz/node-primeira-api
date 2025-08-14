import { eq } from "drizzle-orm"
import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { db } from "../../database/client.ts"
import { courses } from "../../database/schema.ts"

export const getCourseByIDRoute: FastifyPluginAsyncZod = async (app) => {
  app.get('/courses/:id', {
    schema: {
      tags: ['courses'],
      summary: 'Get a course by ID',
      description: 'This route returns a specific course by its ID.',
      params: z.object({
        id: z.uuid({ message: 'Invalid course ID' })
      }),
      response: {
        200: z.object({
          course: z.object({
            id: z.uuid(),
            title: z.string(),
            description: z.string().nullable()
          })
        }).describe('Course retrieved successfully.'),
        404: z.object({
          message: z.string()
        }).describe('Course not found.')
      }
    }
  }, async (request, reply) => {
    const { id } = request.params
    const course = await db.select().from(courses).where(eq(courses.id, id))

    if (!course.length) {
      return reply.status(404).send({ message: 'Course not found' })
    }

    return reply.status(200).send({ course: course[0] })
  })
}