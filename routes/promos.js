import { Router } from "express";

import { validateJWT } from "../middlewares/validateJWT.js";

import { 
    addPromo,
    deletePromo,
    getPromos 
} from "../controllers/promos.js";
import { verifyEmptyField } from "../middlewares/verifyEmptyField.js";
import { validateFieldInput } from "../middlewares/validateFieldInput.js";

export const promoRouter = Router();

promoRouter.get(
    '/get-promos',
    getPromos
);

promoRouter.post(
    '/add-promo',
    [
        verifyEmptyField( 'promoItem', 'título de la promoción' ),
        verifyEmptyField( 'promoDescription', 'descripción de la promoción' ),
        verifyEmptyField( 'urlPromo', 'enlace a la promoción' ),
        verifyEmptyField( 'image', 'imágenes de la promoción' ),
        validateFieldInput,
    ],
    validateJWT,
    addPromo,
);

promoRouter.delete(
    '/delete-promo/:id',
    validateJWT,
    deletePromo,
);