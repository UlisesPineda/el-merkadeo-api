import { Schema, model } from 'mongoose' ;

const SchemaModel  = Schema({
    adminName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: false,
    },
    isUnlimited: {
        type: Boolean,
        required: true,
    },
    isActive: {
        type: Boolean,
        required: true,
    },
});

export default model( 'Admin', SchemaModel );