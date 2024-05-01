import bcrypt from 'bcryptjs';

import UserModel from "../models/UserModel.js";

import { generateActivateJWT } from "../helpers/generateActivateJWT.js";
import { fetchErrorActions } from '../helpers/fetchErrorActions.js';

export const requestResetUserPassword = async( req, res ) => {
    const { email } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if( !user ){
            return res.status(404).json({
                ok: false,
                message: 'El usuario no existe, revisa la información ingresada',
            });
        }
        else {
            const token = await generateActivateJWT( email );
            const encodedToken = btoa( token );
            user.token = encodedToken;
            await user.save();
            // const { email, user } = user;
            // sendResetPasswordMail( email, user, encodedToken );
            return res.status(200).json({
                ok: true,
                message: 'Solicitud exitosa, te hemos enviado un correo con las instrucciones para cambiar tu password',
                token: encodedToken,
            });
        }
    } catch (error) {
        fetchErrorActions( res, error, 'Hubo un error al solicitar el cambio de password' );
    }
};
export const resetUserPassword = async( req, res ) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
        const user = await UserModel.findOne({ token });
        if( !user ){
            return res.status(404).json({
                ok: false,
                message: 'El usuario no existe',
            });
        }
        else {
            const salt = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync( password, salt );
            user.token = null;
            await user.save();
            return res.status(200).json({
                ok: true,
                message: 'El password fue actualizado exitosamente, ya puedes iniciar sesión',
            });
        }
    } catch (error) {
        fetchErrorActions( res, error, 'Hubo un error al realizar el cambio de password' );
    }
};

export const changeUserPassword = async( req, res ) => {
    const { password, newPassword } = req.body;
    const { _id } = req;
    try {
        const user = await UserModel.findOne({ _id });
        if( !user ){
            return res.status(404).json({
                ok: false,
                message: 'El usuario no existe',
            });
        }
        const validPassword = bcrypt.compareSync( password, user.password );
        if( !validPassword ){
            return res.status(401).json({
                ok: false,
                message: 'El password actual ingresado es incorrecto, revisa la información ingresada',
            });
        }
        else {
            const salt = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync( newPassword, salt );
            await user.save();
            return res.status(200).json({
                ok: true,
                message: 'El password fue actualizado exitosamente, cámbialo en tu próximo inicio de sesión',
            });
        }
    } catch (error) {
        fetchErrorActions( res, error, 'Hubo un error al cambiar el password, intenta más tarde' );
    }
};

export const changeUserEmail = async( req, res ) => {
    const { newEmail, password } = req.body;
    const { _id } = req;
    try {
        const user = await UserModel.findOne({ _id });
        if( !user ){
            return res.status(404).json({
                ok: false,
                message: 'El usuario no existe',
            });
        }
        const validPassword = bcrypt.compareSync( password, user.password );
        if( !validPassword ){
            return res.status(401).json({
                ok: false,
                message: 'El password actual ingresado es incorrecto, revisa la información ingresada',
            });
        }    
        else {
            user.email = newEmail;
            await user.save();
            const { email } = user;
            return res.status(200).json({
                ok: true,
                message: 'El correo fue actualizado exitosamente, cámbialo en tu próximo inicio de sesión',
                email,
            });
        }
    } catch (error) {
        fetchErrorActions( res, error, 'Hubo un error al cambiar el correo, intenta más tarde' );
    }
};