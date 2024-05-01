import { Router } from 'express';

import { validateJWT } from '../middlewares/validateJWT.js';
import { verifyEmptyField } from '../middlewares/verifyEmptyField.js';
import { validateFieldInput } from '../middlewares/validateFieldInput.js';

import { 
    addCartItem,
    addProduct,
    addProductImages,
    deleteCartItem,
    soldOutProduct,
    editProductData,
    deleteProductImage,
    getProducts,
    searchProduct,
    addCartArrayItems,
    deleteFullCart,
    addPurchasedProduct, 
} from '../controllers/products.js';

export const productsRouter = Router();

productsRouter.get(
    '/get-products',
    getProducts,
);

productsRouter.post(
    '/add-product',
    [
        verifyEmptyField( 'item', 'nombre' ),
        verifyEmptyField( 'price', 'precio' ),
        verifyEmptyField( 'quantity', 'número de productos' ),
        verifyEmptyField( 'description', 'campo de descripción' ),
        verifyEmptyField( 'color', 'campo de color' ),
        verifyEmptyField( 'size', 'campo de tallas' ),
        verifyEmptyField( 'images', 'campo de imágenes' ),
        validateFieldInput,
    ],
    validateJWT,
    addProduct,
);

productsRouter.put(
    '/delete-product-image/:id',
    [
        verifyEmptyField( 'imagesUpdated', 'campo de imágenes' ),
        validateFieldInput,
    ],
    validateJWT,
    deleteProductImage,
);

productsRouter.put(
    '/add-product-images/:id',
    [
        verifyEmptyField( 'imagesArray', 'campo de imágenes' ),
        validateFieldInput,
    ],
    validateJWT,
    addProductImages,
);

productsRouter.put(
    '/edit-product-data/:id',
    [
        verifyEmptyField( 'item', 'nombre' ),
        verifyEmptyField( 'price', 'precio' ),
        verifyEmptyField( 'quantity', 'número de productos' ),
        verifyEmptyField( 'description', 'campo de descripción' ),
        verifyEmptyField( 'color', 'campo de color' ),
        verifyEmptyField( 'size', 'campo de tallas' ),
        verifyEmptyField( 'images', 'campo de imágenes' ),
        validateFieldInput,
    ],
    validateJWT,
    editProductData,
);

productsRouter.put(
    '/soldout-product/:id',
    validateJWT,
    soldOutProduct,
);

productsRouter.post(
    '/search-product',
    [
        verifyEmptyField( 'queryItem', 'campo de búsqueda' ),
        validateFieldInput,
    ],
    searchProduct,
);

productsRouter.post(
    '/add-product-cart',
    validateJWT,
    addCartItem,
);

productsRouter.post(
    '/add-new-cart',
    validateJWT,
    addCartArrayItems,
);

productsRouter.put(
    '/delete-product-cart/:id',
    validateJWT,
    deleteCartItem,
);

productsRouter.put(
    '/delete-full-cart',
    validateJWT,
    deleteFullCart,
);

productsRouter.put(
    '/add-product-purchased',
    validateJWT,
    addPurchasedProduct,
);