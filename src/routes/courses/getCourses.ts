import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { db } from "../../database/client.ts"
import { courses } from "../../database/schema.ts"

export const getCoursesRoute: FastifyPluginAsyncZod = async (app) => {
  app.get('/courses', {
    schema: {
      tags: ['courses'],
      summary: 'Get all courses',
      description: 'This route returns all available courses.',
      response: {
        200: z.object({
          courses: z.array(z.object({
            id: z.uuid(),
            title: z.string(),
          }))
        }).describe('Successfully retrieved all courses.'),
      }
    }
  }, async (request, reply) => {
    const coursesResult = await db.select({
      id: courses.id,
      title: courses.title
    }).from(courses)

    return reply.send({ courses: coursesResult })
  })
}

