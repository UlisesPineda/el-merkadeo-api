import { check } from "express-validator";

export const verifyEmptyField = ( field, message ) => {
    return check( field, `-El ${ message } está vacío y es requerido` ).notEmpty();
};