import { Schema, model } from 'mongoose';

const SchemaUser = Schema({
    userName: {
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
    isAccepted: {
        type: Boolean,
        required: true,
    },
    isActive: {
        type: Boolean,
        required: true,
    },
    token: {
        type: String,
        required: false,
    },
    cart: {
        type: Array,
        required: false,
    },
    purchased: {
        type: Array,
        required: false,
    },
    adress: {
        type: Object,
        required: false,
    }
});

export default model( 'User', SchemaUser );