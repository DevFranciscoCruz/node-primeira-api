import { randomUUID } from "node:crypto"
import request from "supertest"
import { expect, test } from "vitest"
import { app } from "../../../app.ts"
import { makeAuthenticatedUser } from "../../../tests/factories/makeAuth.ts"
import { makeCourse } from "../../../tests/factories/makeCourse.ts"

test('get course by id', async () => {
  await app.ready()

  const { course } = await makeCourse()
  const { token } = await makeAuthenticatedUser('student')

  const response = await request(app.server)
    .get(`/courses/${course.id}`)
    .set('Authorization', token)

  expect(response.status).toEqual(200)
  expect(response.body).toEqual({
    course: {
      id: course.id,
      title: expect.any(String),
      description: null,
    }
  })
})

test('return 404 for non existing courses', async () => {
  await app.ready()

  await makeCourse()

  const response = await request(app.server)
    .get(`/courses/${randomUUID}`)

  expect(response.status).toEqual(404)
})