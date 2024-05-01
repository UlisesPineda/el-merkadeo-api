import { fetchErrorActions } from "../helpers/fetchErrorActions.js";
import SuscriberModel from "../models/SuscriberModel.js";

export const getSuscribers = async( req, res ) => {
    try {
        const suscribers = await SuscriberModel.find();
        if ( !suscribers.length ) {
            return res.status(404).json({
                ok: false,
                message: 'Aún no tienes suscriptores en tu lista'
            });
        }
        else {
            return res.status(200),json({
                ok: true,
                message: 'Los suscriptores se han cargado correcatmente',
                suscribers,
            });
        }
    } catch (error) {
        console.log( error );
        fetchErrorActions( res, error, 'Hubo un error al cargar el listado de suscriptores' );
    }
};

export const addSuscriber = async( req, res ) => {
    const { name, email } = req.body;
    try {
        const suscriber = await SuscriberModel.findOne({ email });
        if ( suscriber ) {
            return res.status(400).json({
                ok: false,
                message: 'El suscriptor ya está en nuestras listas 😃',
            });
        }
        else {
            const suscriber = new SuscriberModel( req.body );
            suscriber.isActive = true;
            suscriber.save();
            return res.status(200).json({
                ok: true,
                message: 'El suscriptor fue registrado exitosamente',
            });
        }
    } catch (error) {
        console.log( error );
        fetchErrorActions( res, error, 'Hubo un error al crear al nuevo suscriptor' );
    }
};

export const unSuscribeSus = async() => {
    const { id } = req.params;
    try {
        const suscriber = await SuscriberModel.findOne({ _id: id });
        if ( !suscriber ) {
            return res.status(404).json({
                ok: false,
                message: 'El suscriptor no existe',
            });
        }
        if ( suscriber.isActive === false ) {
            return res.status(400).json({
                ok: false,
                message: 'El suscriptor ya está dado de baja',
            });
        }
        else {
            suscriber.isActive = false;
            await suscriber.save();
            return res.status(200).json({
                ok: true,
                message: 'El suscriptor fue dado de baja exitosamente exitosamente',
            });
        }
    } catch (error) {
        console.log( error );
        fetchErrorActions( res, error, 'Hubo un error al dar de baja al suscriptor' );
    }
};