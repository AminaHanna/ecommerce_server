import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    transactionId: {
        type: String,
        required: [true, "transaction id not generated"],
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Please add the product id"],
    },
    userId: {
        type:  mongoose.Schema.Types.ObjectId,
        required: [true, "Please add the user id"],
    },
},
    {
        timestamps: true,
    }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);
