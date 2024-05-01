import bcrypt from 'bcryptjs';

import AdminModel from "../models/AdminModel.js";

import { generateActivateJWT } from '../helpers/generateActivateJWT.js';
import { fetchErrorActions } from '../helpers/fetchErrorActions.js';
import { generateAuthJWT } from '../helpers/generateAuthJWT.js';
import { sendConfirmAdminMail } from '../helpers/sendConfirmAdminMail.js';
import { sendChangePasswordMail } from '../helpers/sendChangePasswordMail.js';

export const registerAdmin = async( req, res ) => {
    const { email, password } = req.body;
    try {
        let admin = await AdminModel.findOne({ email });
        if( admin ){
            return res.status(404).json({
                ok: false,
                message: `Ya existe un administrador registrado con el correo: ${ email }`,
            });
        }
        else {
            const token = await generateActivateJWT( email );
            const encodedToken = btoa( token );
            const salt = bcrypt.genSaltSync();
            admin = new AdminModel( req.body );
            admin.password = bcrypt.hashSync( password, salt );
            admin.token = encodedToken;
            admin.isActive = false;
            await admin.save();
            const { _id, name, adminName } = admin;
            sendConfirmAdminMail( email, adminName, encodedToken );
            return res.status(200).json({
                ok: true,
                message: 'El administrador fue creado exitosamente ',
                text: 'se le ha enviado un correo con las instrucciones para activarlo',
                _id,
                name,
                email,
                encodedToken,
            });
        }
    } catch (error) {
        fetchErrorActions( res, error, 'Hubo un error al crear el nuevo administrador' );
    }
};

export const activateAdmin = async( req, res ) => {
    const { token } = req.params;
    try {
        const admin = await AdminModel.findOne({ token });
        if( !admin ){
            return res.status(404).json({
                ok: false,
                message: 'El administrador no existe',
                text: 'Contacta a soporte'
            });
        }
        else {
            admin.token = null,
            admin.isActive = true;
            await admin.save()
            return res.status(200).json({
                ok: true,
                message: 'El administrador fue activado correctamente',
                text: 'Ya puedes iniciar sesión'
            });
        }
    } catch (error) {
        fetchErrorActions( res, error, 'Hubo un error al activar el administrador' );
    }
};

export const loginAdmin = async( req, res ) => {
    const { email, password } = req.body;
    try {
        const admin = await AdminModel.findOne({ email });
        if( !admin ){
            return res.status(404).json({
                ok: false,
                message: 'El correo ingresado no existe',
                text: 'Verifica el correo ingresado'
            });
        }
        if( !admin.isActive ){
            return res.status(422).json({
                ok: false,
                message: 'El administrador no se ha activado',
                text: 'Revisa tu correo y sigue las instrucciones para activarlo'
            });
        }
        const validPassword = bcrypt.compareSync( password, admin.password );
        if( !validPassword ){
            return res.status(403).json({
                ok: false,
                message: 'El password es incorrecto',
                text: 'Verifica la información ingresada'
            });
        }
        else {
            const { _id, adminName, email } = admin;
            const authToken = await generateAuthJWT( _id );
            return res.status(200).json({
                ok: true,
                message: `El administrador: ${ email } ha iniciadio sesión exitosamente`,
                _id,
                adminName,
                email,
                authToken,
            });
        }
    } catch (error) {
        fetchErrorActions( res, error, 'Hubo un error al iniciar la sesión' );
    }
};

export const reqResetAdminPassword = async( req, res ) => {
    const { email } = req.body;
    try {
        const admin = await AdminModel.findOne({ email });
        if( !admin ){
            return res.status(404).json({
                ok: false,
                message: `El administrador con el correo: ${ email } no existe`,
            });
        }
        else {
            const token = await generateActivateJWT( email );
            const encodedToken = btoa( token );
            admin.token = encodedToken;
            admin.isActive = false;
            await admin.save();
            const { _id, adminName } = admin;
            sendChangePasswordMail( email, adminName, encodedToken );
            return res.status(200).json({
                ok: true,
                message: 'La solicitud de nuevo password fue procesada exitosamente',
                text: 'Te hemos enviado un correo con las instrucciones para cambiarlo',
                _id,
                email,
                encodedToken,
            });
        }
    } catch (error) {
        fetchErrorActions( res, error, 'Hubo un error en la solicitud para el nuevo password' );
    }
};

export const resetPasswordAdmin = async( req, res ) => {
    const { password } = req.body;
    const { token } = req.params;
    try {
        const admin = await AdminModel.findOne({ token });
        if ( !admin ) {
            return res.status(404).json({
                ok: false,
                message: 'El administrador no existe, contacta a soporte'
            });
        }
        else {
            const salt = bcrypt.genSaltSync();
            admin.password = bcrypt.hashSync( password, salt );
            admin.token = null;
            admin.isActive = true;
            await admin.save();
            return res.status(200).json({
                ok: true,
                message: 'El password fue actualizado exitosamente'
            });
        }
    } catch (error) {
        console.log( error );
        fetchErrorActions( res, error, 'Hubo un error al realizar el cambio de password del administrador' );
    }
};

export const updateNameAdmin = async( req, res ) => {
    const { adminName } = req.body;
    const { _id } = req;
    try {
        const admin = await AdminModel.findOne({ _id });
        if( !admin ) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontró al administrador',
            });
        }
        else {
            const { _id, email } = admin;
            const authToken = await generateAuthJWT( _id );
            admin.adminName = adminName;
            await admin.save();
            return res.status(200).json({
                ok: true,
                message: 'El nombre del administrador fue actualizado correctamente',
                _id,
                adminName,
                email,
                authToken,
            });
        }
    } catch (error) {
        console.log( error );
        fetchErrorActions( res, error, 'Hubo un error al actualizar la información del administrador' );
    }
};

export const updateEmailAdmin = async( req, res ) => {
    const { email } = req.body;
    const { _id } = req;
    try {
        const admin = await AdminModel.findOne({ _id });
        if( !admin ) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontró al administrador',
            });
        }
        else {
            const { _id, adminName } = admin;
            const authToken = await generateAuthJWT( _id );
            admin.email = email;
            await admin.save();
            return res.status(200).json({
                ok: true,
                message: 'El correo del administrador fue actualizado correctamente',
                _id,
                adminName,
                email,
                authToken,
            });
        }
    } catch (error) {
        console.log( error );
        fetchErrorActions( res, error, 'Hubo un error al actualizar la información del administrador' );
    }
};

export const updatePasswordAdmin = async( req, res ) => {
    const { password, newPassword } = req.body;
    const { _id } = req;
    try {
        const admin = await AdminModel.findOne({ _id });
        if( !admin ) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontró al administrador',
            });
        }
        const validPassword = bcrypt.compareSync( password, admin.password );
        if( !validPassword ){
            return res.status(403).json({
                ok: false,
                message: 'El password es incorrecto',
                text: 'Verifica la información ingresada'
            });
        }
        else {
            const { _id, adminName, email } = admin;
            const salt = bcrypt.genSaltSync();
            admin.password = bcrypt.hashSync( newPassword, salt );
            await admin.save();
            const authToken = await generateAuthJWT( _id );
            return res.status(200).json({
                ok: true,
                message: 'El password fue actualizado correctamente',
                _id,
                adminName,
                email,
                authToken,
            });
        }
    } catch (error) {
        console.log( error );
        fetchErrorActions( res, error, 'Hubo un error al actualizar el password del administrador' );
    }
};
export const renewAdminToken = async( req, res ) => {
    const { _id } = req;
    try {
        const authToken = await generateAuthJWT( _id );
        const admin = await AdminModel.findOne({ _id });
        const { adminName, email } = admin;
        return res.status(200).json({
            ok: true,
            message: 'La sesión fue renovada exitosamente',
            _id,
            adminName,
            email,
            authToken,
        });
    } catch (error) {
        fetchErrorActions( res, error, 'Hubo un error al renovar la sesión' );
    }
};