import * as express from "express";
import healthRouter from "./health.js";

const router = express.Router();

router.use(healthRouter);

export default router;
