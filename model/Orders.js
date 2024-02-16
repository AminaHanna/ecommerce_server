import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: [true, "Please add the firstname"],
    },
    lname: {
        type: String,
        required: [true, "Please add the lastname"],
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

export const Order = mongoose.model("Order", adminSchema);
