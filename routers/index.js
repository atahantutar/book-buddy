import express from "express";
import userRouter from "./userRouter.js";
import bookRouter from "./bookRouter.js";

const router = express.Router();

router.use(userRouter);
router.use(bookRouter);

export default router;
