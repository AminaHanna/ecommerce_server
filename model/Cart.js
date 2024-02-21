import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
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

export const Cart = mongoose.model("Cart", cartSchema);
