import { faker } from '@faker-js/faker';
import { hash } from 'argon2';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { courses, enrollments, users } from './schema.ts';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function seed() {
  try {
    const passwordHash = await hash('F_vaq3xAFYY7daN')

    const fakeUsersData = await db.insert(users).values(
      Array.from({ length: 6 }, (): typeof users.$inferInsert => ({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: passwordHash,
        role: "student"
      }))
    ).returning();

    const fakeCourses = await db.insert(courses).values(
      Array.from({ length: 3 }, () => ({
        title: faker.lorem.words(3),
        description: faker.lorem.words(6),
      }))
    ).returning();

    await db.insert(enrollments).values(
      Array.from(fakeUsersData, (user, i) => ({
        userID: user.id,
        courseID: fakeCourses[i < fakeCourses.length ? i : fakeCourses.length - 1].id,
      }))
    );

    console.log('Seed completed!');
  } catch (err) {
    console.error('Seed failed:', err);
  } finally {
    await pool.end();
  }
}

seed();
