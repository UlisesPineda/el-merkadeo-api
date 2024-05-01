import { Router } from 'express';
import { check } from 'express-validator';

import { validateJWT } from '../middlewares/validateJWT.js';
import { verifyEmptyField } from '../middlewares/verifyEmptyField.js';
import { validateFieldInput } from '../middlewares/validateFieldInput.js';

import { isPasswordsMatches } from '../helpers/isPasswordsMatches.js';
import { 
    changeUserEmail,
    changeUserPassword,
    requestResetUserPassword, 
    resetUserPassword,
} from '../controllers/settingsUser.js';

const isPasswordRight = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/;
const passswordErrMessage = '-El password debe contener de 8 a 16 caracteres, al menos una mayúscula, una minúscula, al menos un número';

export const settingsUserRouter = Router();

settingsUserRouter.get(
    '/request-reset-password',
    [
        verifyEmptyField( 'email', 'correo' ),
        check('email', '-El formato de correo en inválido').isEmail(),
        validateFieldInput,
    ],
    requestResetUserPassword,
);

settingsUserRouter.put(
    '/reset-password/:token',
    [
        verifyEmptyField( 'password', 'password' ),
        verifyEmptyField( 'confirmPassword', 'campo confirmar password' ),
        check('password', '-Los passwords no coinciden').custom( isPasswordsMatches ),
        validateFieldInput,
    ],
    resetUserPassword,
);

settingsUserRouter.put(
    '/change-password',
    [
        verifyEmptyField( 'password', 'password actual' ),
        verifyEmptyField( 'newPassword', 'nuevo password' ),
        verifyEmptyField( 'confirmPassword', 'campo confirmar password' ),
        check('newPassword', passswordErrMessage).matches( isPasswordRight ),
        check('newPassword', '-Los nuevos passwords no coinciden').custom( isPasswordsMatches ),
        validateFieldInput, 
    ],
    validateJWT,
    changeUserPassword,
);

settingsUserRouter.put(
    '/change-email',
    [
        verifyEmptyField( 'password', 'password actual' ),
        verifyEmptyField( 'newEmail', 'campo de nuevo correo' ),
        check('newEmail', '-El formato del nuevo correo es inválido').isEmail(),
        validateFieldInput,
    ],
    validateJWT,
    changeUserEmail,
);