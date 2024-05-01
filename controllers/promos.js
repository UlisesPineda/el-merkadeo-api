import AdminModel from "../models/AdminModel.js";
import PromoModel from "../models/PromoModel.js";

import { fetchErrorActions } from "../helpers/fetchErrorActions.js";

export const getPromos = async( req, res ) => {
    try {
        const promos = await PromoModel.find();
        if( !promos.length ) {
            return res.status(404).json({
                ok: true,
                message: 'No hay promociones vigentes',
            });
        }
        else {
            return res.status(200).json({
                ok: true,
                message: 'Se cargaron correctamente todas las promociones del sitio',
                promos,
            });
        }
    } catch (error) {
        fetchErrorActions( res, error, 'Hubo un problema al cargar el catálogo' );
    }
};

export const addPromo = async( req, res ) => {
    const { _id } = req;
    try {
        const admin = await AdminModel.findOne({ _id });
        if( !admin ) {
            return res.status(403).json({
                ok: false,
                message: 'No estas autorizado para hacer cambios',
            });
        }
        else {
            const promo = await new PromoModel( req.body );
            promo.admin = _id;
            await promo.save();
            return res.status(200).json({
                ok: true,
                message: 'La promoción fue creada exitosamente',
                promo,
            });
        }
    } catch (error) {
        fetchErrorActions( res, error, 'Hubo un problema al agregar la promoción, intenta más tarde' );
    }
};

export const deletePromo =  async( req, res ) => {
    const { id } = req.params;
    const { _id } = req;
    try {
        const admin = await AdminModel.findOne({ _id });
        if( !admin ) {
            return res.status(403).json({
                ok: false,
                message: 'No estas autorizado para hacer cambios',
            });
        }
        const promo = await PromoModel.findOne({ _id: id });
        if( !promo ) {
            return res.status(404).json({
                ok: false,
                message: 'La promoción que intentas eliminar no existe',
            });
        }
        else {
            await PromoModel.findByIdAndDelete( id );
            return res.status(200).json({
                ok: true,
                message: 'La promoción fue eliminada correctamente',
            });
        }
    } catch (error) {
        console.log( error );
        fetchErrorActions( res, error, 'Hubo un problema al eliminar la promoción, intenta más tarde' );
    }
};
