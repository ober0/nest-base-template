import * as process from 'node:process'

export default () => ({
    PORT: parseInt(process.env.PORT, 10) || 3000,
    DATABASE_URL: process.env.DATABASE_URL,
    ACCESS_SECRET: process.env.ACCESS_SECRET,
    REFRESH_SECRET: process.env.REFRESH_SECRET,
    REDIS_URL: process.env.REDIS_URL,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_SERVICE: process.env.SMTP_SERVICE,

    AUTH_ATTEMPT_LIMIT: 5,
    AUTH_ATTEMPT_TTL: 600,
    AUT_TWO_FACTOR_TTL: 300
})
