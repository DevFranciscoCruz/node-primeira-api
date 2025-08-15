import { and, asc, count, eq, ilike, SQL } from "drizzle-orm"
import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { db } from "../../database/client.ts"
import { courses, enrollments } from "../../database/schema.ts"
import { checkRequestJWT } from "../../hooks/checkRequestJWT.ts"

export const getCoursesRoute: FastifyPluginAsyncZod = async (app) => {
  app.get('/courses', {
    preHandler: [checkRequestJWT],
    schema: {
      tags: ['courses'],
      summary: 'Get all courses',
      description: 'This route returns all available courses.',
      querystring: z.object({
        search: z.string().optional(),
        orderBy: z.enum(['title']).optional().default('title'),
        page: z.coerce.number().optional().default(1)
      }),
      response: {
        200: z.object({
          courses: z.array(z.object({
            id: z.uuid(),
            title: z.string(),
            enrollments: z.number()
          })),
          totalCourses: z.number()
        }).describe('Successfully retrieved all courses.'),
      }
    }
  }, async (request, reply) => {
    const { search, orderBy, page } = request.query

    const conditions: SQL[] | undefined = []
    if (search) {
      conditions.push(ilike(courses.title, `%${search}%`))
    }

    const [coursesResult, totalCourses] = await Promise.all([
      db.select({
        id: courses.id,
        title: courses.title,
        enrollments: count(enrollments.courseID)
      }).from(courses)
        .where(and(...conditions))
        .leftJoin(enrollments, eq(enrollments.courseID, courses.id))
        .offset((page - 1) * 2)
        .limit(10)
        .orderBy(asc(courses[orderBy]))
        .groupBy(courses.id),
      db.$count(courses, and(...conditions))
    ])


    return reply.send({ courses: coursesResult, totalCourses: totalCourses })
  })
}

