import { randomUUID } from "crypto"
import request from "supertest"
import { expect, test } from "vitest"
import { app } from "../../../app.ts"
import { makeAuthenticatedUser } from "../../../tests/factories/makeAuth.ts"
import { makeCourse } from "../../../tests/factories/makeCourse.ts"

test('get courses', async () => {
  await app.ready()

  const titleID = randomUUID()
  await makeCourse(titleID)
  const { token } = await makeAuthenticatedUser('student')

  const response = await request(app.server)
    .get(`/courses?search=${titleID}`)
    .set('Authorization', token)

  expect(response.status).toEqual(200)
  expect(response.body).toEqual({
    totalCourses: 1,
    courses: [{
      id: expect.any(String),
      title: titleID,
      enrollments: 0
    }]
  })
})