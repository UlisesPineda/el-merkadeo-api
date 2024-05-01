import { Schema, model } from 'mongoose' ;

const SchemaSuscriber  = Schema({
    suscriber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        required: true,
    },
});

export default model( 'Suscriber', SchemaSuscriber );