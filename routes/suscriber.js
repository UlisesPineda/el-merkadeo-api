import { Router } from 'express';
import { check } from 'express-validator';

import { addSuscriber, getSuscribers, unSuscribeSus } from '../controllers/suscriber.js';
import { verifyEmptyField } from '../middlewares/verifyEmptyField.js';
import { validateFieldInput } from '../middlewares/validateFieldInput.js';

export const suscriberRouter = Router();

const isNameRight = /^[a-zA-Z\u00C0-\u02AF\s]{1,30}$/;
const nameErrorMessage = '-El nombre de usuario solo acepta palabras en mayúsculas o minúsculas y un máximo de 30 caracteres';

suscriberRouter.get(
    '/get-suscribers',
    getSuscribers,
);

suscriberRouter.post(
    '/add-suscriber',
    [
        verifyEmptyField('suscriber', 'nombre del suscriptor'),
        verifyEmptyField('email', 'correo del suscriptor'),
        check('suscriber', nameErrorMessage).matches( isNameRight ),
        check('email', 'El formato de correo es inválido').isEmail(),
        validateFieldInput
    ],
    addSuscriber,
);

suscriberRouter.put(
    '/unsuscribe',
    unSuscribeSus,
);