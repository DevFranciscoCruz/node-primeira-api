import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_URL: z.string(),
  PORT: z.number().default(3000)
})

const envValidatorResult = envSchema.safeParse(process.env)

if (!envValidatorResult.success) {
  console.log(envValidatorResult.error.issues)
  throw new Error('⚠️ Invalid environment variables!')
}

export const env = envValidatorResult.data

