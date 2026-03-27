import * as express from "express";
import cors from "cors";
import pinoHttpFactory from "pino-http";
import router from "./routes/index.js";
import { logger } from "./lib/logger.js";

const app = express();

// Handle ESM/CommonJS default export differences
const pinoHttp = (pinoHttpFactory as any).default || pinoHttpFactory;

app.use(
  (pinoHttp as any)({
    logger,
    serializers: {
      req(req: any) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res: any) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
