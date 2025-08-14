import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { randomUUID } from "node:crypto";

export async function coursesRoutes(app: FastifyInstance) {
  const courses = [
    { id: '1', name: 'Node.js' },
    { id: '2', name: 'React.js' },
    { id: '3', name: 'TypeScript' },
  ];

  app.get('/', () => {
    return { courses }
  })

  app.get('/:id', (request: FastifyRequest, reply: FastifyReply) => {
    type RequestParams = {
      id: string
    }
    const { id } = request.params as RequestParams
    const course = courses.find(course => course.id === id)

    if (course) {
      return { course }
    }

    return reply.status(404).send()
  })

  app.post('/', (request: FastifyRequest, reply: FastifyReply) => {
    type RequestParams = {
      name: string
    }
    const { name } = request.body as RequestParams

    if (!name) {
      return reply.status(400).send({ message: 'Nome do Curso Obrigatório' })
    }

    const courseID = randomUUID()

    courses.push({
      id: courseID,
      name: name
    })

    return reply.status(201).send({ courseID })
  })
}