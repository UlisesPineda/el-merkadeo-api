import { Router } from 'express';
import { check } from 'express-validator';

import { validateJWT } from '../middlewares/validateJWT.js';
import { verifyEmptyField } from '../middlewares/verifyEmptyField.js';
import { validateFieldInput } from '../middlewares/validateFieldInput.js';

import { isAcceptedTerms } from '../helpers/isAcceptedTerms.js';
import { isPasswordsMatches } from '../helpers/isPasswordsMatches.js';
import { 
    activateUser, 
    changeUserAdress, 
    changeUserEmail, 
    changeUserName, 
    changeUserPassword, 
    loginUser, 
    registerUser, 
    renewUserToken, 
    reqResetUserPassword,
    resetPasswordUser
} from '../controllers/authUser.js';

const isNameRight = /^[a-zA-Z\u00C0-\u02AF\s]{1,50}$/;
const nameErrorMessage = '-El nombre de usuario solo acepta palabras en mayúsculas o minúsculas';
const isPasswordRight = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/;
const passswordErrMessage = '-El password debe contener de 8 a 16 caracteres, al menos una mayúscula, al menos una minúscula y por lo menos un número';
const isAdressRight = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ0-9\s,]*$/;
const isZipcodeRight = /^\d{5}$/;
const isCityRight = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ,¿?¡!,'\s]*$/;

export const authUserRouter = Router();

authUserRouter.post(
    '/register-user',
    [
        verifyEmptyField( 'userName', 'nombre' ),
        verifyEmptyField( 'email', 'correo' ),
        verifyEmptyField( 'password', 'password' ),
        check('userName', nameErrorMessage).matches( isNameRight ),
        check('email', '-El formato de correo es incorrecto').isEmail(),
        check('password', passswordErrMessage).matches( isPasswordRight ),
        check('password', '-Los passwords no coinciden').custom( isPasswordsMatches ),
        check('isAccepted', '-Debes aceptar los términos y condiciones').custom( isAcceptedTerms ),
        validateFieldInput,
    ],
    registerUser,
);

authUserRouter.get(
    '/activate-user/:token',
    activateUser,
);

authUserRouter.post(
    '/login-user',
    [
        verifyEmptyField( 'email', 'correo' ),
        verifyEmptyField( 'password', 'password' ),
        check('email', '-El formato de correo es incorrecta').isEmail(),
        check('password', passswordErrMessage).matches( isPasswordRight ),
        validateFieldInput,
    ],
    loginUser,
);

authUserRouter.post(
    '/req-reset-password',
    [
        verifyEmptyField( 'email', 'correo' ),
        check('email', '-El formato de correo es incorrecta').isEmail(),
        validateFieldInput,
    ],
    reqResetUserPassword,
);

authUserRouter.put(
    '/reset-password/:token',
    [
        verifyEmptyField( 'password', 'password' ),
        verifyEmptyField( 'newPassword', 'nuevo password' ),
        check('password', passswordErrMessage).matches( isPasswordRight ),
        check('newPassword', passswordErrMessage).matches( isPasswordRight ),
        check( 'password', '-Los passwords no coinciden' ).custom( ( value, { req } ) => {
            const passwordConfirm = req.body.newPassword;
            return value === passwordConfirm ? true : false;
        } ),
        validateFieldInput,
    ],
    resetPasswordUser,
);

authUserRouter.put(
    '/change-user-name',
    [
        verifyEmptyField( 'userName', 'nombre de usuario' ),
        check('userName', nameErrorMessage).matches( isNameRight ),
        validateFieldInput,
    ],
    validateJWT,
    changeUserName,
);

authUserRouter.put(
    '/change-user-email',
    [
        verifyEmptyField( 'email', 'nuevo correo' ),
        check( 'email', '-El formato de correo es incorrecto' ).isEmail(),
        validateFieldInput,
    ],
    validateJWT,
    changeUserEmail,
);

authUserRouter.put(
    '/change-user-password',
    [
        verifyEmptyField( 'password', 'password' ),
        check( 'password', passswordErrMessage ).matches( isPasswordRight ),
        validateFieldInput,
    ],
    validateJWT,
    changeUserPassword
);

authUserRouter.put(
    '/change-user-adress',
    [
        verifyEmptyField( 'adress', 'dirección' ),
        verifyEmptyField( 'district', 'colonia' ),
        verifyEmptyField( 'zipcode', 'código postal' ),
        verifyEmptyField( 'city', 'ciudad' ),
        check('adress', '-La calle y número contienen caracteres no permitidos').matches( isAdressRight ),
        check('district', '-La colonia contiene caracteres no permitidos').matches( isAdressRight ),
        check('zipcode', '-El código postal es incorrecto').matches( isZipcodeRight ),
        check('city', '-La colonia contiene caracteres no permitidos').matches( isCityRight ),
        validateFieldInput,
    ],
    validateJWT,
    changeUserAdress,
);

authUserRouter.get(
    '/renew-user-token',
    validateJWT,
    renewUserToken,
);