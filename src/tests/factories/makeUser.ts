import { faker } from "@faker-js/faker";
import { hash } from "argon2";
import { db } from "../../database/client.ts";
import { users } from "../../database/schema.ts";
import { Roles } from "../../hooks/checkUserRole.ts";

export async function makeUser(role?: Roles) {
  const passwordBeforeHash = faker.internet.password()

  const result = await db.insert(users).values({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: await hash(passwordBeforeHash),
    role: role,
  }).returning()

  return {
    user: result[0],
    passwordBeforeHash: passwordBeforeHash,
  }
}
