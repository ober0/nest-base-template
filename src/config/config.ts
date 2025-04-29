export default () => ({
    PORT: parseInt(process.env.PORT, 10) || 3000,
    DATABASE_URL: process.env.DATABASE_URL,
    ACCESS_SECRET: process.env.ACCESS_SECRET,
    REFRESH_SECRET: process.env.REFRESH_SECRET,
    AI_API_URL: process.env.AI_API_URL,

    AUTH_ATTEMPT_LIMIT: 5,
    AUTH_ATTEMPT_TTL: 600,
    AUT_TWO_FACTOR_TTL: 300
})
