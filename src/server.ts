import fastifySwagger from "@fastify/swagger";
import scalarAPIReference from '@scalar/fastify-api-reference';
import fastify from "fastify";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, type ZodTypeProvider } from "fastify-type-provider-zod";
import { createCourseRoute } from "./routes/courses/createCourse.ts";
import { deleteCourseByID } from "./routes/courses/deleteCourseByID.ts";
import { getCourseByIDRoute } from "./routes/courses/getCourseByID.ts";
import { getCoursesRoute } from "./routes/courses/getCourses.ts";

const app = fastify({
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
      title: 'First API Documentation',
      darkMode: true
    }
  })
}

app.register(getCourseByIDRoute)
app.register(getCoursesRoute)
app.register(createCourseRoute)
app.register(deleteCourseByID)

app.listen({ port: 3000 }, function (err, address) {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }

  console.log(`🚀 Server is now listening on ${address}`)
})