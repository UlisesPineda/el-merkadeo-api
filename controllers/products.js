import { createURLitem } from "../helpers/createURLitem.js";
import { fetchErrorActions } from "../helpers/fetchErrorActions.js";
import { normalizedItemName } from "../helpers/normalizedItemName.js";
import { sendResumeOrderMail } from "../helpers/sendResumeOrderMail.js";

import AdminModel from "../models/AdminModel.js";
import ProductModel from "../models/ProductModel.js";
import UserModel from "../models/UserModel.js";

export const getProducts = async( req, res ) => {
    try {
        const catalog = await ProductModel.find();
        // const catalog = totalProducts.filter( products => products.isSoldOut === false );
        if( !catalog.length ) {
            return res.status(404).json({
                ok: true,
                message: 'El catálogo está vacío',
            });
        }
        else {
            return res.status(200).json({
                ok: true,
                message: 'Se cargaron correctamente todos los productos del catálogo',
                catalog,
            });
        }
    } catch (error) {
        fetchErrorActions( res, error, 'Hubo un problema al cargar el catálogo' );
    }
};

export const addProduct = async( req, res ) => {
    const { item, category } = req.body;
    const { _id } = req;
    const categoryNormalized = normalizedItemName( category );
    try {
        const admin = AdminModel.findOne({ _id });
        if( !admin ) {
            return res.status(403).json({
                ok: false,
                message: 'No estás autorizado para modificar el catálogo',
            });
        }
        else {
            let product = new ProductModel( req.body );
            product.url = createURLitem( item );
            product.normalizedItem = normalizedItemName( item );
            product.normalizedUrlCategory = createURLitem( categoryNormalized );
            product.urlProduct = `/tienda/${ product.normalizedUrlCategory }/${ product.url }`;
            product.normalizedColor = normalizedItemName( req.body.color );
            product.admin = _id;
            product.isSoldOut = false;
            await product.save();
            return res.status(200).json({
                ok: true,
                message: 'El item fue agregado correctamente',
                product,
            });
        }
    } catch (error) {
        fetchErrorActions( res, error, 'Hubo un problema al agregar el prodcuto, intenta más tarde' );
    }
};

export const searchProduct = async( req, res ) => {
    const { queryItem } = req.body;
    const cleanedItem = normalizedItemName( queryItem.trim() );
    try {
        const product = await ProductModel.find({ 
            $or: [
                {normalizedItem: new RegExp(cleanedItem, 'i')},
                {normalizedColor: new RegExp(cleanedItem, 'i')},
            ],
        });
        return res.status(200).json({
            ok: true,
            message: `Estos son los resultados para ${ queryItem }:`,
            product,
        });
    } catch (error) {
        fetchErrorActions( res, error, 'Hubo un problema con la búsqueda, intenta más tarde' );
    }
};

export const deleteProductImage = async( req, res ) => {
    const { imagesUpdated } = req.body;
    const { id } = req.params;
    const { _id } = req;
    try {
        const admin = await AdminModel.findOne({ _id });
        if( !admin ) {
            return res.status(403).json({
                ok: false,
                message: 'No estás autorizado para modificar el catálogo',
            });
        }
        const product = await ProductModel.findOne({ _id: id });
        if( !product ) {
            return res.status(404).json({
                ok: false,
                message: 'El producto no existe',
            });
        }
        else {
            product.images = imagesUpdated;
            product.save();
            return res.status(200).json({
                ok: true,
                message: 'Las imágenes fueron actualizadas correctamente',
                product,
            });
        }
    } catch (error) {
        fetchErrorActions( res, error, 'Hubo un problema al eliminar la imagen, intenta más tarde' );
    }
};

export const addProductImages = async( req, res ) => {
    const { imagesArray } = req.body;
    const { id } = req.params;
    const { _id } = req;
    try {
        const admin = await AdminModel.findOne({ _id });
        if( !admin ) {
            return res.status(403).json({
                ok: false,
                message: 'No estás autorizado para modificar el catálogo',
            });
        }
        const product = await ProductModel.findOne({ _id: id });
        if( !product ) {
            return res.status(404).json({
                ok: false,
                message: 'El producto no existe',
            });
        }
        else {
            product.images = product.images.concat( imagesArray );
            product.save();
            return res.status(200).json({
                ok: true,
                message: 'Las imágenes fueron agregadas correctamente',
                product,
            });
        }
    } catch (error) {
        fetchErrorActions( res, error, 'Hubo un problema al agregar las nuevas imágenes, intenta más tarde' );
    }
};

export const editProductData = async( req, res ) => {
    const { id } = req.params;
    const { _id } = req;
    try {
        const admin = await AdminModel.findOne({ _id });
        if( !admin ) {
            return res.status(403).json({
                ok: false,
                message: 'No estas autorizado para modificar el catálogo',
            });
        }
        const product = await ProductModel.findOne({ _id: id });
        if( !product ) {
            return res.status(404).json({
                ok: false,
                message: 'El producto no existe',
            });
        }
        else {
            const prevUpdatedProduct = {
                ...req.body,
                images: product.images,
            };
            const updatedProduct = await ProductModel.findByIdAndUpdate( id, prevUpdatedProduct, { new: true } );
            return res.status(200).json({
                ok: true,
                message: 'El producto fue actualizado exitosamente',
                updatedProduct,
            });
        }
    } catch (error) {
        fetchErrorActions( res, error, 'Hubo un problema al editar el item, intenta más tarde' );
    }
};

export const soldOutProduct = async( req, res ) => {
    const { id } = req.params;
    const { _id } = req;
    try {
        const admin = await AdminModel.findOne({ _id });
        if( !admin ) {
            return res.status(403).json({
                ok: false,
                message: 'No estas autorizado para modificar el catálogo',
            });
        }
        const product = await ProductModel.findOne({ _id: id });
        if( !product ){
            return res.status(404).json({
                ok: false,
                message: 'El producto no existe',
            });
        }
        else {
            product.isSoldOut = !product.isSoldOut;
            product.save();
            return res.status(200).json({
                ok: true,
                message: `El estado de agotado del producto fue marcado como ${ product.isSoldOut } exitosamente`,
                product,
            });
        }
    } catch (error) {
        fetchErrorActions( res, error, 'Hubo un problema al eliminar el producto, intenta más tarde' );
    }
};

export const addCartItem = async( req, res ) => {
    const { _id } = req;
    try {
        const user = await UserModel.findOne({ _id });
        if( !user ) {
            return res.status(403).json({
                ok: false,
                message: 'No estás autorizado para realizar esta acción',
            });
        }
        else {
            const item = req.body;
            user.cart = [ ...user.cart, item ];
            await user.save();
            return res.status(200).json({
                ok: true,
                message: 'El producto fue agregado al carrito',
                user,
            });
        }
    } catch (error) {
        fetchErrorActions( res, error, 'Hubo un problema al agregar el producto al carrito, intenta más tarde' );
    }
};

export const addCartArrayItems = async( req, res ) => {
    const { _id } = req;
    try {
        const user = await UserModel.findOne({ _id });
        if( !user ) {
            return res.status(403).json({
                ok: false,
                message: 'No estás autorizado para realizar esta acción',
            });
        }
        else {
            const arrayItems = req.body;
            user.cart = arrayItems;
            await user.save();
            return res.status(200).json({
                ok: true,
                message: 'Los nuevos productos fueron agregados exitosamente',
                user,
            });
        }
    } catch (error) {
        fetchErrorActions( res, error, 'Hubo un problema al agregar los nuevos productos al carrito, intenta más tarde' );
    }
};

export const deleteCartItem =  async( req, res ) => {
    const id = req.params.id;
    const { _id } = req;
    try {
        const user = await UserModel.findOne({ _id });
        if( !user ) {
            return res.status(403).json({
                ok: false,
                message: 'No estás autorizado para realizar esta acción',
            });
        }
        else {
            const cartUpdated = user.cart.filter( products => products.id !== id );
            user.cart = cartUpdated;
            await user.save();
            return res.status(200).json({
                ok: true,
                message: 'El producto fue eliminado correctamente',
                user,
            });
        }
    } catch (error) {
        fetchErrorActions( res, error, 'Hubo un error al eliminar el producto, intenta más tarde' );
    }
};

export const deleteFullCart = async( req, res ) => {
    const { _id } = req;
    try {
        const user = await UserModel.findOne({ _id });
        if( !user ) {
            return res.status(403).json({
                ok: false,
                message: 'No estás autorizado para realizar esta acción',
            });
        }
        user.cart = [];
        await user.save();
        return res.status(200).json({
            ok: true,
            message: 'El carrito fue vaciado correctamente',
            user,
        });
    } catch (error) {
        fetchErrorActions( res, error, 'Hubo un errror al vaciar el carrito' );
    }
};

export const addPurchasedProduct = async( req, res ) => {
    const { _id } = req;
    const { userCart, id } = req.body;
    try {
        const user = await UserModel.findOne({ _id });
        if( !user ) {
            return res.status(403).json({
                ok: false,
                message: 'No estás autorizado para realizar esta acción',
            });
        }
        else {
            userCart.forEach(
                ( product ) => {
                product.date = Date.now();
                product.order = id;
                }
            );  
            user.purchased = user.purchased.concat( userCart );
            await user.save();
            await sendResumeOrderMail( user.email, id, user.purchased, user.userName );
            return res.status(200).json({
                ok: true,
                message: 'El registro de productos comprados fue actualizado exitosamente',
                user,
            });
        }
    } catch (error) {
        fetchErrorActions( res, error, 'Hubo un error al añadir el producto comprado en el registro' );
    }
};