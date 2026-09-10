import mongoose, { Schema } from "mongoose";


const paymentSchema = new Schema(
    {
        sale: {
            type: Schema.Types.ObjectId,
            ref: "Sales",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        paymentMethod: {
            type: String,
            enum: ["upi", "card", "netbanking", "wallet"],
            required: true,
        },
        razorpayOrderId: {
            type: String,
            required: true,
            index: true,
        },
        razorpayPaymentId: {
            type: String,
        },
        razorpaySignature: {
            type: String,
        },
        status: {
            type: String,
            enum: ["created", "captured", "failed"],
            default: "created",
        },
        paidAt: {
            type: Date,
        },
    },
    { timestamps: true },
);

export const Payment = mongoose.model("Payment", paymentSchema);