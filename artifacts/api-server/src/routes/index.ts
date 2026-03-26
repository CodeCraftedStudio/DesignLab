import express from "express";
import healthRouter from "./health";

const router = express.Router();

router.use(healthRouter);

export default router;
