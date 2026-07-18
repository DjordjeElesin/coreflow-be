import winston from "winston";
import env from "./env";

const { combine, timestamp, json, colorize, printf, errors } = winston.format;

// Local development logs
const devFormat = combine(
  colorize(),
  timestamp({ format: "HH:mm:ss" }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack, ...meta }) => {
    const metaString = Object.keys(meta).length
      ? ` ${JSON.stringify(meta)}`
      : "";
    return `${timestamp} ${level}: ${stack ?? message}${metaString}`;
  }),
);

// Production logs
const prodFormat = combine(timestamp(), errors({ stack: true }), json());
const isProd = env.NODE_ENV === "production";

const logger = winston.createLogger({
  level: isProd ? "http" : "debug",
  format: isProd ? prodFormat : devFormat,
  transports: [new winston.transports.Console()],
});

export default logger;
