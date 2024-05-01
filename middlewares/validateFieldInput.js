import { validationResult } from 'express-validator';

export const validateFieldInput = ( req, res, next ) => {
    const errors = validationResult( req ).array();

    if( errors.length ) {
        const errorMessages = errors.map( error => error.msg );
        return res.status(400).json({
            ok: false,
            messages: errorMessages,
        });
    }
    next();
};