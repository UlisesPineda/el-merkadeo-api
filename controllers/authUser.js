import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import UserModel from "../models/UserModel.js";

import { generateActivateJWT } from '../helpers/generateActivateJWT.js';
import { fetchErrorActions } from '../helpers/fetchErrorActions.js';
import { generateAuthJWT } from '../helpers/generateAuthJWT.js';
import { sendChangePassUserMail } from '../helpers/sendChangePassUserMail.js';

export const registerUser = async( req, res ) => {
    const { email, password } = req.body;
    try {
        let user = await UserModel.findOne({ email });
        if(user){
            return res.status(404).json({
                ok: false,
                message: `Ya hay un usuario registrado con el corre: ${ email }`,
            });
        }
        else {
            user = new UserModel( req.body );
            const salt = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync( password, salt );
            user.token = null;
            user.isActive = true;
            user.adress = {};
            await user.save();
            return res.status(200).json({
                ok: true,
                message: 'Registro exitoso, te hemos enviado un correo con las instrucciones para activar tu usuario',
                user,
            });
        }
    } catch (error) {
        fetchErrorActions( res, error, 'No se pudo completar el registro, intenta más tarde' );
    }
};

export const activateUser = async( req, res ) => {
    const { token } = req.params;
    try {
        const user = await UserModel.findOne({ token });
        if( !user ){
            return res.status(404).json({
                ok: false,
                message: 'El usuario no existe o ya fue activado',
            });
        }
        else {
            const decodedToken = atob( user.token );
            jwt.verify( decodedToken, process.env.JWT_AUTH_KEY );
            user.isActive = true;
            user.token = null;
            await user.save();
            return res.status(200).json({
                ok: true,
                message: 'El usuario fue activado exitosamente, ya puedes iniciar sesión',
            });
        }
    } catch (error) {
        fetchErrorActions( res, error, 'Hubo un error al activar el usuario' );
    }
};

export const loginUser = async( req, res ) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if( !user ){
            return res.status(404).json({
                ok: false,
                message: 'El usuario no existe, revisa el correo ingresado',
            });
        }
        if( !user.isActive ){
            return res.status(422).json({
                ok: false,
                message: 'El usuario no se ha activado, revisa tu correo y sigue las instrucciones para activarlo',
            });
        }
        const validPassword = bcrypt.compareSync( password, user.password );
        if( !validPassword ){
            return res.status(403).json({
                ok: false,
                message: 'El password es incorrecto, revisa la información ingresada'
            });
        }
        else {
            const {  _id, userName, email, cart, adress, purchased } = user;
            const authToken = await generateAuthJWT( _id );
            return res.status(200).json({
                ok: true,
                message: `El usuario: ${ email } ha iniciadio sesión exitosamente`,
                _id,
                userName,
                email,
                cart,
                purchased,
                adress,
                authToken,
            });
        }
    } catch (error) {
        fetchErrorActions( res, error, 'Hubo un error al iniciar la sesión' );
    }
};

export const reqResetUserPassword = async( req, res ) => {
    const { email } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if( !user ){
            return res.status(404).json({
                ok: false,
                message: `El usuario con el correo: ${ email } no existe`,
            });
        }
        else {
            const token = await generateActivateJWT( email );
            const encodedToken = btoa( token );
            user.token = encodedToken;
            user.isActive = false;
            await user.save();
            const { _id, userName } = user;
            sendChangePassUserMail( email, userName, encodedToken );
            return res.status(200).json({
                ok: true,
                message: 'La solicitud de nuevo password fue procesada exitosamente',
                text: 'Te hemos enviado un correo con las instrucciones para cambiarlo, revisa tu carpeta de SPAM en caso de no verlo en tu bandeja de entrada',
                _id,
                email,
                encodedToken,
            });
        }
    } catch (error) {
        fetchErrorActions( res, error, 'Hubo un errro al realizar el cambio de password' );
    }
};

export const resetPasswordUser = async( req, res ) => {
    const { password } = req.body;
    const { token } = req.params;
    try {
        const user = await UserModel.findOne({ token });
        if( !user ) {
            return res.status(404).json({
                ok: false,
                message: 'El usuario no existe, contacta a soporte'
            });
        }
        else {
            const decodedToken = atob( token );
            jwt.verify( decodedToken, process.env.JWT_AUTH_KEY );
            const salt = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync( password, salt );
            user.token = null;
            user.isActive = true;
            await user.save();
            return res.status(200).json({
                ok: true,
                message: 'El password fue actualizado exitosamente'
            });
        }
    } catch (error) {
        fetchErrorActions( res, error, 'Hubo un error al realizar el cambio de password del usuario' );
    }
};

export const changeUserName = async( req, res ) => {
    const { _id } = req;
    const { userName } = req.body;
    try {
        const user = await UserModel.findOne({ _id });
        if ( !user ) {
            return res.status(404).json({
                ok: false,
                message: 'El usuario no existe, contacta a soporte'
            });
        }
        else {
            user.userName = userName;
            const { email, cart, adress } = user;
            const authToken = await generateAuthJWT( _id );
            await user.save();
            return res.status(200).json({
                ok: true,
                message: 'El nombre de usuario fue actualizado exitosamente',
                _id,
                userName,
                email,
                cart,
                adress,
                authToken,
            });
        }
    } catch (error) {
        fetchErrorActions( res, error, 'Hubo un error al cambiar el nombre de usuario' );
    }
};

export const changeUserEmail = async( req, res ) => {
    const { _id } = req;
    const { email } = req.body;
    try {
        const user = await UserModel.findOne({ _id });
        if ( !user ) {
            return res.status(404).json({
                ok: false,
                message: 'El usuario no existe, contacta a soporte'
            });
        }
        else {
            user.email = email;
            const { userName, cart, adress } = user;
            const authToken = await generateAuthJWT( _id );
            await user.save();
            return res.status(200).json({
                ok: true,
                message: 'El nombre de usuario fue actualizado exitosamente',
                _id,
                userName,
                email,
                cart,
                adress,
                authToken,
            });
        }
    } catch (error) {
        fetchErrorActions( res, error, 'Hubo un error al cambiar el correo' );
    }
};

export const changeUserPassword = async( req, res ) => {
    const { _id } = req;
    const { password } = req.body;
    try {
        const user = await UserModel.findOne({ _id });
        if ( !user ) {
            return res.status(404).json({
                ok: false,
                message: 'El usuario no existe, contacta a soporte'
            });
        }
        else {
            const { userName, email, cart, adress } = user;
            const authToken = await generateAuthJWT( _id );
            const salt = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync( password, salt );
            await user.save();
            return res.status(200).json({
                ok: true,
                message: 'El password fue actualizado exitosamente',
                _id,
                userName,
                email,
                cart,
                adress,
                authToken,
            });
        }
    } catch (error) {
        fetchErrorActions( res, error, 'Hubo un error al cambiar el password' );
    }
};

export const changeUserAdress = async( req, res ) => {
    const { _id } = req;
    const { adress, district, zipcode, city } = req.body
    try {
        const user = await UserModel.findOne({ _id });
        if ( !user ) {
            return res.status(404).json({
                ok: false,
                message: 'El usuario no existe, contacta a soporte'
            });
        }
        else {
            const { userName, email, cart } = user;
            const authToken = await generateAuthJWT( _id );
            const newAdress = {
                adress,
                district,
                zipcode,
                city
            };
            user.adress = newAdress
            await user.save();
            return res.status(200).json({
                ok: true,
                message: 'El dirección fue actualizada exitosamente',
                _id,
                userName,
                email,
                cart,
                adress: newAdress,
                authToken,
            });
        }
    } catch (error) {
        fetchErrorActions( res, error, 'Hubo un error al actualizar la dirección' );
    }
};

export const renewUserToken = async( req, res ) => {
    const { _id } = req;
    try {
        const authToken = await generateAuthJWT( _id );
        const user = await UserModel.findOne({ _id });
        const { userName, email, cart, adress, purchased } = user;
        return res.status(200).json({
            ok: true,
            message: 'La sesión fue renovada exitosamente',
            _id,
            userName,
            email,
            cart,
            purchased,
            adress,
            authToken,
        });
    } catch (error) {
        fetchErrorActions( res, error, 'Hubo un error al renovar la sesión' );
    }
};