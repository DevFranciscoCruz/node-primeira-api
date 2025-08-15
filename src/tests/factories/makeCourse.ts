import { faker } from "@faker-js/faker";
import { db } from "../../database/client.ts";
import { courses } from "../../database/schema.ts";

export async function makeCourse(title?: string) {
  const course = await db.insert(courses).values({
    title: title ?? faker.lorem.words(2)
  }).returning()

  return { course: course[0] }
}