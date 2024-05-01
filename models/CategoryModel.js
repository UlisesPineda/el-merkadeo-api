import { Schema, model } from 'mongoose' ;

const SchemaCategory  = Schema({
    categoryTitle: {
        type: String,
        required: true,
    },
    categoryDescription: {
        type: String,
        required: true,
    },
    categoryUrl: {
        type: String,
        required: false,
    },
    image: {
        type: Array,
        required: true,
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'Admin',
        required: true, 
    },
});

export default model( 'Category', SchemaCategory );