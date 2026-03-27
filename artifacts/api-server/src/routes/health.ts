import express from "express";

const router = express.Router();

router.get("/healthz", (_req: any, res: any) => {
  const data = { status: "ok" };
  res.json(data);
});

export default router;
