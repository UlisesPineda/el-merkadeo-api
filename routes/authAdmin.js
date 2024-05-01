import { Router } from 'express';
import { check } from 'express-validator';

import { validateJWT } from '../middlewares/validateJWT.js';
import { verifyEmptyField } from '../middlewares/verifyEmptyField.js';
import { validateFieldInput } from '../middlewares/validateFieldInput.js';

import { isUnlimitedAdmin } from '../helpers/isUnlimitedAdmin.js';
import { isPasswordsMatches } from '../helpers/isPasswordsMatches.js';
import { 
    activateAdmin, 
    loginAdmin, 
    registerAdmin, 
    renewAdminToken, 
    reqResetAdminPassword, 
    resetPasswordAdmin, 
    updateEmailAdmin, 
    updateNameAdmin,
    updatePasswordAdmin
} from '../controllers/authAdmin.js';


const isNameRight = /^[a-zA-Z\u00C0-\u02AF\s]{1,30}$/;
const nameErrorMessage = '-El nombre solo acepta palabras en mayúsculas o minúsculas y un máximo de 30 caracteres';
const isPasswordRight = /^(?=.*[a-zA-Z0-9])(?=.*[/*\-+]).{8,16}$/;
const passswordErrMessage = '-El password debe contener de 8 a 16 caracteres, debe contener números y letras y al menos uno de los siguientes caracteres especiales: / * - +';

export const authAdminRouter = Router();

authAdminRouter.post(
    '/register-admin',
    [
        verifyEmptyField( 'adminName', 'nombre' ),
        verifyEmptyField( 'email', 'correo' ),
        verifyEmptyField( 'password', 'password' ),
        check('adminName', nameErrorMessage).matches( isNameRight ),
        check('email', 'El formato de correo es incorrecto').isEmail(),
        check('password', passswordErrMessage).matches( isPasswordRight ),
        check('password', '-Los passwords no coinciden').custom( isPasswordsMatches ),
        check('isUnlimited', '-Debes indicar si el aministrador será ilimitado').custom( isUnlimitedAdmin ),
        validateFieldInput,
    ],
    registerAdmin,
);

authAdminRouter.get(
    '/activate-admin/:token',
    activateAdmin,
);

authAdminRouter.post(
    '/login-admin',
    [
        verifyEmptyField( 'email', 'correo' ),
        verifyEmptyField( 'password', 'password' ),
        check('email', 'El formato de correo es incorrecto').isEmail(),
        check('password', passswordErrMessage).matches( isPasswordRight ),
        validateFieldInput,
    ],
    loginAdmin,
    );

authAdminRouter.post(
    '/request-reset-password',
    [
        verifyEmptyField( 'email', 'correo' ),
        check( 'email', 'El formato de correo es incorrecto' ).isEmail(),
        validateFieldInput,
    ],
    reqResetAdminPassword,
);

authAdminRouter.put(
    '/reset-password/:token',
    [
        verifyEmptyField( 'password', 'password' ),
        verifyEmptyField( 'newPassword', 'confirmación de password' ),
        check( 'password', passswordErrMessage ).matches( isPasswordRight ),
        check( 'password', passswordErrMessage ).matches( isPasswordRight ),
        check( 'password', '-Los passwords no coinciden' ).custom( ( value, { req } ) => {
            const passwordConfirm = req.body.newPassword;
            return value === passwordConfirm ? true : false;
        } ),
        validateFieldInput,
    ],
    resetPasswordAdmin,
);
    
authAdminRouter.put(
    '/update-admin-name',
    [
        verifyEmptyField( 'adminName', 'nuevo nombre' ),
        check( 'adminName', nameErrorMessage ).matches( isNameRight ),
        validateFieldInput,
    ],
    validateJWT,
    updateNameAdmin,
);

authAdminRouter.put(
    '/update-admin-email',
    [
        verifyEmptyField( 'email', 'nuevo correo' ),
        check( 'email', 'El formato de correo es incorrecto' ).isEmail(),
        validateFieldInput,
    ],
    validateJWT,
    updateEmailAdmin,
);

authAdminRouter.put(
    '/update-admin-password',
    [
        verifyEmptyField( 'password', 'password actual' ),
        verifyEmptyField( 'newPassword', 'nuevo password' ),
        check( 'password', passswordErrMessage ).matches( isPasswordRight ),
        check( 'newPassword', passswordErrMessage ).matches( isPasswordRight ),
        validateFieldInput,
    ],
    validateJWT,
    updatePasswordAdmin,
);

authAdminRouter.get(
    '/renew-admin-token',
    validateJWT,
    renewAdminToken,
);