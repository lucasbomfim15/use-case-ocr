import { z } from "zod";

export const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    JWT_PRIVATE_KEY: z.string(),
    JWT_PUBLIC_KEY: z.string(),
    PORT: z.coerce.number().default(3000),
    FRONTEND_URL: z.string().url(),

})

export type Env = z.infer<typeof envSchema>;