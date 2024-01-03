const winston = require("winston");
const { combine, timestamp, printf, colorize, splat } = winston.format;
const DailyRotateFile = require("winston-daily-rotate-file");

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
  http: 6,
};

const simpleLoggingFormat = combine(
  colorize(),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  splat(),
  printf((info) => {
    const { timestamp, level, message, ...meta } = info;
    return `${timestamp} [${level}]: ${message} ${
      Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ""
    }`;
  })
);

const errorfileRotateTransport = new DailyRotateFile({
  filename: "logs/app-error-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "14d",
  maxSize: "20m",
  zippedArchive: true,
});

const infofileRotateTransport = new DailyRotateFile({
  filename: "logs/app-info-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "14d",
  maxSize: "20m",
  zippedArchive: true,
});

const logger = winston.createLogger({
  levels: logLevels,
  level: process.env.LOG_LEVEL || "info" || "http",
  format:
    process.env.LOG_FORMAT === "json"
      ? winston.format.json()
      : simpleLoggingFormat,
  transports: [
    new winston.transports.Console(),
    errorfileRotateTransport,
    infofileRotateTransport,
  ],
});

module.exports = { logger };
