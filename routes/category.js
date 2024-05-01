import { Router } from "express";

import { 
    createCategory,
    deleteCategory,
    getCategories,
} from "../controllers/category.js";
import { validateJWT } from "../middlewares/validateJWT.js";
import { validateFieldInput } from "../middlewares/validateFieldInput.js";
import { verifyEmptyField } from "../middlewares/verifyEmptyField.js";

export const categoryRouter = Router();

categoryRouter.get(
    '/get-categories',
    getCategories,
);

categoryRouter.post(
    '/create-category',
    [
        verifyEmptyField( 'categoryTitle', 'nombre de la categoría' ),
        verifyEmptyField( 'categoryDescription', 'campo de descripción de categoría' ),
        validateFieldInput,
    ],
    validateJWT,
    createCategory,
);

categoryRouter.delete(
    '/delete-category/:id',
    validateJWT,
    deleteCategory,
);