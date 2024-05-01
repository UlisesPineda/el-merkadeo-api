import { createURLitem } from "../helpers/createURLitem.js";
import { fetchErrorActions } from "../helpers/fetchErrorActions.js";
import AdminModel from "../models/AdminModel.js";
import CategoryModel from "../models/CategoryModel.js";

export const getCategories = async( req, res ) => {
    try {
        const categories = await CategoryModel.find();
        if ( !categories.length ) {
            return res.status(404).json({
                ok: false,
                message: 'Aún no hay categorías'
            });
        }
        else {
            return res.status(200).json({
                ok: true,
                message: 'Se han cargado las cetgorías',
                categories,
            });
        }
    } catch (error) {
        console.log( error );
        fetchErrorActions( res, error, 'Hubo un error al cargar las categorías' );
    }
};

export const createCategory = async( req, res ) => {
    const { categoryTitle } = req.body;
    const { _id } = req;
    const urlCategory = createURLitem( categoryTitle );
    try {
        const admin = await AdminModel.findOne({ _id });
        if( !admin ) {
            return res.status(403).json({
                ok: false,
                message: 'No estás autorizado para hacer modificaciones',
            });
        }
        else {
            let category = new CategoryModel( req.body );
            category.categoryUrl = `/tienda/${ urlCategory }`;
            category.admin = _id;
            await category.save();
            return res.status(200).json({
                ok: true,
                message: 'La categoría fue creada exitosamente',
                category,
            });
        }
    } catch (error) {
        console.log( error );
        fetchErrorActions( res, error, 'Hubo un error al crear la categoría' );
    }
};

export const deleteCategory = async( req, res ) => {
    const { id } = req.params;
    const { _id } = req;
    try {
        const admin = await AdminModel.findOne({ _id });
        if( !admin ) {
            return res.status(403).json({
                ok: false,
                message: 'No estás autorizado para hacer modificaciones',
            });
        }
        const category = await CategoryModel.findOne({ _id: id });
        if ( !category ) {
            return res.status(404).json({
                ok: false,
                message: 'La categoría que intentas eliminar no existe',
            });
        }
        else {
            await CategoryModel.findByIdAndDelete( id );
            return res.status(200).json({
                ok: false,
                message: 'La categoría fue eliminada exitosamente',
            });
        }
    } catch (error) {
        console.log( error );
        fetchErrorActions( res, error, 'Hubo un error al intentar eliminar la categoría' );
    }
};