import Razorpay from "razorpay";
import crypto from "crypto";



const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});


const createRazorpayOrder = async ({ amountInRupees, receipt }) => {
    const order = await razorpayInstance.orders.create({
        amount: Math.round(amountInRupees * 100),
        currency: "INR",
        receipt,
    });
    return order;
};


const verifyPaymentSignature = ({ orderId, paymentId, signature }) => {
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${orderId}|${paymentId}`)
        .digest("hex");

    return expectedSignature === signature;
};

export { razorpayInstance, createRazorpayOrder, verifyPaymentSignature };
