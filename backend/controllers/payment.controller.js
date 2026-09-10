import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { verifyPaymentService } from "../services/payment.services.js";

const verifyPayment = asyncHandler(async (req, res) => {
    const {
        saleId,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
    } = req.body;

    const sale = await verifyPaymentService({
        saleId,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, sale, "Payment verified successfully"));
});


const getPaymentConfig = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { razorpayKeyId: process.env.RAZORPAY_KEY_ID },
                "Payment config fetched successfully",
            ),
        );
});

export { verifyPayment, getPaymentConfig };
