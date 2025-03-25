import 'dotenv/config';

import { z } from 'zod';
import { STORAGE_PROVIDER } from '../metadata';

const envSchema = z.object({
  // SELF-BACKEND
  BACKEND_BASE_URL: z.string().url().nonempty(),
  BACKEND_PORT: z
    .string()
    .refine((val) => !isNaN(parseInt(val, 10)), {
      message: 'POSTGRES_PORT must be a valid number',
    })
    .transform((val) => parseInt(val, 10)),

  // AUTH
  JWT_SECRET: z.string().nonempty(),
  JWT_EXPIRES_IN: z.string().nonempty(),
  ADMIN_EMAIL: z.string().email().nonempty(),
  ADMIN_PASSWORD: z
    .string()
    .regex(/^(?=.*[A-Z])(?=.*[!#@$%&])(?=.*[0-9])(?=.*[a-z]).{8,100}$/, {
      message:
        'A senha deve ter 8 carecteres, um especial um maúsculo e um número no mínimo',
    }),

  // POSTGRES
  POSTGRES_HOST: z.string().nonempty(),
  POSTGRES_PORT: z
    .string()
    .refine((val) => !isNaN(parseInt(val, 10)), {
      message: 'POSTGRES_PORT must be a valid number',
    })
    .transform((val) => parseInt(val, 10)),
  POSTGRES_DB: z.string().nonempty(),
  POSTGRES_USER: z.string().nonempty(),
  POSTGRES_PASSWORD: z.string().nonempty(),

  // REDIS
  REDIS_HOST: z.string().nonempty(),
  REDIS_PORT: z
    .string()
    .refine((val) => !isNaN(parseInt(val, 10)), {
      message: 'POSTGRES_PORT must be a valid number',
    })
    .transform((val) => parseInt(val, 10)),
  REDIS_PASSWORD: z.string().nonempty(),

  // AWS
  AWS_S3_ACCESS_KEY_ID: z.string(),
  AWS_S3_SECRET_ACCESS_KEY_ID: z.string(),

  // STORAGE
  STORAGE_PROVIDER: z
    .string()
    .transform((val) => val.toUpperCase())
    .refine((val) => Object.values(STORAGE_PROVIDER).includes(val as any), {
      message: `O valor deve ser um dos seguintes: ${Object.values(STORAGE_PROVIDER).join(', ')}`,
    }),
  PUBLIC_IMAGES_BUCKET_NAME: z.string().nonempty(),

  // PAYPAL
  PAYPAL_BASE_URL: z.string().nonempty(),
  PAYPAL_CLIENT_ID: z.string().nonempty(),
  PAYPAL_SECRET: z.string().nonempty(),
  WEB_HOOK_ID: z.string().nonempty(),

  // MAIL
  MAIL_PROVIDER: z.string().nonempty(),
  MAIL_COMPANY: z.string().nonempty(),

  // MAIL (MAILTRAP)
  MAILTRAP_HOST: z.string().nonempty(),
  MAILTRAP_PORT: z
    .string()
    .refine((val) => !isNaN(parseInt(val, 10)), {
      message: 'POSTGRES_PORT must be a valid number',
    })
    .transform((val) => parseInt(val, 10)),
  MAILTRAP_USER: z.string().nonempty(),
  MAILTRAP_PASS: z.string().nonempty(),

  // GOOGLE OAUTH
  GOOGLE_CLOUD_OAUTH_CLIENT_ID: z.string().nonempty(),
  GOOGLE_CLOUD_OAUTH_CLIENT_SECRET: z.string().nonempty(),
  GOOGLE_CLOUD_OAUTH_REFRESH_TOKEN: z.string().nonempty(),

  // COMPANY
  COMPANY_EMAIL: z.string().nonempty(),
});

export const env = envSchema.parse(process.env);
