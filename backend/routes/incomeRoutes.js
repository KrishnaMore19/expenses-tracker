import express from "express";
import { addIncome, getIncomes, updateIncome, deleteIncome } from "../controllers/incomeController.js";

const router = express.Router();

router.post("/", addIncome);
router.get("/", getIncomes);
router.put("/:id", updateIncome); // ✅ Added update income
router.delete("/:id", deleteIncome); // ✅ Added delete income

export default router;




