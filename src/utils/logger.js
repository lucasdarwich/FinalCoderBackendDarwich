import winston from "winston";
import colors from "colors";

// Define los colores para cada nivel de log
const colorMap = {
  debug: colors.gray,
  http: colors.cyan,
  info: colors.green,
  warning: colors.yellow,
  error: colors.red,
  fatal: colors.bold.red,
};

// Define el formato para los logs de consola
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.printf((info) => {
    const { timestamp, level, message } = info;
    const color = colorMap[level] || colors.white;
    const levelLabel = color(`[${level.toUpperCase()}]`);
    return `${timestamp} ${levelLabel} ${message}`;
  })
);

// Define los transportes para el logger
const transports = [
  new winston.transports.Console({
    level: "debug",
    handleExceptions: true,
    format: consoleFormat,
  }),
  new winston.transports.File({
    filename: "errors.log",
    level: "error",
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  }),
];

// Crea el logger con los transportes y los niveles de log correspondientes
const logger = winston.createLogger({
  levels: {
    debug: 0,
    http: 1,
    info: 2,
    warning: 3,
    error: 4,
    fatal: 5,
  },
  transports,
  exitOnError: false,
});

// Agrega el transporte de consola para entornos de desarrollo
if (process.env.ENVIRONMENT !== "production") {
  logger.add(
    new winston.transports.Console({
      level: "debug",
      handleExceptions: true,
      format: consoleFormat,
    })
  );
}

// Elimina el transporte de consola para entornos de producción
if (process.env.ENVIRONMENT === "production") {
  logger.remove(transports[0]);
}

export { logger };
