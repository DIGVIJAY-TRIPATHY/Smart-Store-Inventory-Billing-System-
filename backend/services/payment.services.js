import { ApiError } from "../utils/ApiError.js";
import { Sales } from "../models/sales.model.js";
import { Payment } from "../models/payment.model.js";
import {
    createRazorpayOrder,
    verifyPaymentSignature,
} from "../utils/razorpayClient.js";


const initiateOnlinePayment = async (sale) => {
    const order = await createRazorpayOrder({
        amountInRupees: sale.grandTotal,
        receipt: sale.invoiceNumber,
    });

    await Payment.create({
        sale: sale._id,
        amount: sale.grandTotal,
        paymentMethod: sale.paymentMethod,
        razorpayOrderId: order.id,
        status: "created",
    });

    sale.razorpayOrderId = order.id;
    await sale.save({ validateBeforeSave: false });

    return {
        razorpayOrderId: order.id,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID, 
        amount: order.amount,
        currency: order.currency,
    };
};


const verifyPaymentService = async ({
    saleId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
}) => {
    const sale = await Sales.findById(saleId);
    if (!sale) {
        throw new ApiError(404, "Sale not found");
    }

    if (sale.razorpayOrderId !== razorpayOrderId) {
        throw new ApiError(400, "Order ID does not match this sale");
    }

    const isValid = verifyPaymentSignature({
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        signature: razorpaySignature,
    });

    if (!isValid) {
        
        
        
        
        
        throw new ApiError(
            400,
            "Payment verification failed - signature mismatch",
        );
    }

    sale.paymentStatus = "paid";
    sale.status = "completed";
    sale.razorpayPaymentId = razorpayPaymentId;
    sale.razorpaySignature = razorpaySignature;
    await sale.save({ validateBeforeSave: false });

    await Payment.findOneAndUpdate(
        { razorpayOrderId },
        {
            razorpayPaymentId,
            razorpaySignature,
            status: "captured",
            paidAt: new Date(),
        },
    );

    return await Sales.findById(saleId)
        .populate("customer", "name phone")
        .populate("items.product", "name sku");
};

export { initiateOnlinePayment, verifyPaymentService };
