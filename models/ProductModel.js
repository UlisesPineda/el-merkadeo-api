import { Schema, model } from 'mongoose';

const SchemaProduct = Schema({
    item: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    urlProduct: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    quantity: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    normalizedUrlCategory: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    normalizedItem: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    normalizedColor: {
        type: String,
        required: true,
    },
    size: {
        type: String,
        required: true,
    },
    images: {
        type: Array,
        required: true,
    },
    isSoldOut: {
        type: Boolean,
        required: false,
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'Admin',
        required: true, 
    },
});

export default model( 'Product', SchemaProduct );