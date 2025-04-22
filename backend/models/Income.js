import mongoose from "mongoose";

const incomeSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    source: { type: String, required: true }, // ✅ Changed from title to source
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Income = mongoose.model("Income", incomeSchema);
export default Income;

