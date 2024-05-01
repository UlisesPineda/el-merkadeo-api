import { Router } from "express";

import { processPayment } from "../controllers/stripe.js";
import { validateJWT } from "../middlewares/validateJWT.js";

export const stripeRouter = Router();

stripeRouter.post(
    '/checkout-cart',
    validateJWT,
    processPayment,
);