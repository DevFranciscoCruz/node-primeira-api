import { coursesRoutes } from "@/routes/courses";
import fastify from "fastify";

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
})
app.register(coursesRoutes, { prefix: 'courses' })

app.listen({
  port: 3000
}).then(() => {
  console.log("🚀 HTTP server running on http://localhost:3000")
}).catch(err => {
  console.error(err);
  process.exit(1);
})