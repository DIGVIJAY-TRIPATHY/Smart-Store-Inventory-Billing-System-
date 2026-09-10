import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        description: {
            type: String,
            trim: true,
        },
        sku: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true, 
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        supplier: {
            type: Schema.Types.ObjectId,
            ref: "Supplier",
        },
        unit: {
            type: String,
            enum: ["pcs", "kg", "gram", "litre", "ml", "box", "packet"],
            default: "pcs",
        },
        purchasePrice: {
            type: Number,
            required: true,
            min: 0, 
        },
        sellingPrice: {
            type: Number,
            required: true,
            min: 0, 
        },
        quantityInStock: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        reorderLevel: {
            type: Number,
            default: 10, 
        },
        
        
        
        lowStockAlertSent: {
            type: Boolean,
            default: false,
        },
        outOfStockAlertSent: {
            type: Boolean,
            default: false,
        },
        images: [
            {
                type: String, 
            },
        ],
        isActive: {
            type: Boolean,
            default: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true },
);

export const Product = mongoose.model("Product", productSchema);