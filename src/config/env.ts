import "dotenv/config";

const getEnv = (key: string, fallback?: string): string => {
  const value = process.env[key] ?? fallback;

  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

const env = {
  PORT: Number(getEnv("PORT", "4000")),
  NODE_ENV: getEnv("NODE_ENV", "development"),
  DATABASE_URL: getEnv("DATABASE_URL"),
};

export default env;
