import fastifySwagger from "@fastify/swagger"
import scalarAPIReference from '@scalar/fastify-api-reference'
import fastify from "fastify"
import { type ZodTypeProvider, jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod"
import { loginRoute } from "./routes/auth/loginRoute.ts"
import { createCourseRoute } from "./routes/courses/createCourse.ts"
import { getCourseByIDRoute } from "./routes/courses/getCourseByID.ts"
import { getCoursesRoute } from "./routes/courses/getCourses.ts"
import { updateCourseByID } from "./routes/courses/updateCourseByID.ts"
import { updateCourseFieldByID } from "./routes/courses/updateCourseFieldByID.ts"

export const app = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  }
}).withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

if (process.env.NODE_ENV === 'development') {
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Desafio Node.js',
        version: '1.0.0',
      }
    },
    transform: jsonSchemaTransform,
  })

  app.register(scalarAPIReference, {
    routePrefix: '/docs',
    configuration: {
      pageTitle: 'First API Documentation',
      title: 'First API Documentation',
      darkMode: true
    }
  })
}

app.register(getCourseByIDRoute)
app.register(getCoursesRoute)
app.register(createCourseRoute)
app.register(updateCourseByID)
app.register(updateCourseFieldByID)
app.register(loginRoute)