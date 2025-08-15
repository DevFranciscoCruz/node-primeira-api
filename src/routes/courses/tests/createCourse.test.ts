import { faker } from "@faker-js/faker"
import request from "supertest"
import { expect, test } from "vitest"
import { app } from "../../../app.ts"
import { makeAuthenticatedUser } from "../../../tests/factories/makeAuth.ts"

test('create a course', async () => {
  await app.ready()

  const { token } = await makeAuthenticatedUser('manager')

  const response = await request(app.server).post('/courses')
    .set('Content-Type', 'application/json')
    .set('Authorization', token)
    .send({
      title: faker.lorem.words(2)
    })

  expect(response.status).toEqual(201)
  expect(response.body).toEqual({
    courseID: expect.any(String)
  })
})