import { Router } from "express";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
    createSale,
    getAllSales,
    getSaleById,
    cancelSale,
} from "../controllers/sales.controller.js";

const router = Router();

router
    .route("/")
    .get(verifyJWT, authorizeRoles("admin", "manager"), getAllSales)
    .post(
        verifyJWT,
        authorizeRoles("admin", "manager", "cashier", "staff"),
        createSale,
    );

router
    .route("/:saleId")
    .get(verifyJWT, authorizeRoles("admin", "manager"), getSaleById);



router
    .route("/:saleId/cancel")
    .patch(
        verifyJWT,
        authorizeRoles("admin", "manager", "cashier", "staff"),
        cancelSale,
    );

export default router;
