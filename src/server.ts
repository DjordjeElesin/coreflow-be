import express from "express";
import cors from "cors";
import env from "./config/env";
import cookieParser from "cookie-parser";
import logger from "./config/logger";
import router from "./modules";
import { httpLogger, notFoundHandler, errorHandler } from "./middleware";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(httpLogger);

app.use("/api", router);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.PORT, () => logger.info(`Server running on port ${env.PORT}`));
