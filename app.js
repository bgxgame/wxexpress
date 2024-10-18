var createError = require("http-errors");
var express = require("express");
var path = require("path");
var morgan = require("morgan");
const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const fsExtra = require("fs-extra");

const { log_level } = require("./config/config");
const logDirectory = path.join(__dirname, "logs");
fsExtra.ensureDirSync(logDirectory);

var demandListRouter = require("./routes/v1/demand");
var authApiRouter = require("./routes/v1/auth");
var homeApiRouter = require("./routes/v1/home");

var cors = require("cors");

var app = express();

app.use(cors());

// 配置 winston
const logger = winston.createLogger({
  level: log_level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // new winston.transports.Console(),
    new DailyRotateFile({
      filename: path.join(logDirectory, "application-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/v1", demandListRouter);
app.use("/v1", authApiRouter);
app.use("/v1", homeApiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  logger.error({
    url: req.url,
    body: req.body,
    error: err.message,
    stack: err.stack,
  });

  //  the error response
  res.status(err.status || 500);
  res.json({ error: err });
});

module.exports = app;
