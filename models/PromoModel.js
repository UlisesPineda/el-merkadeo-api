import { Schema, model } from 'mongoose' ;

const SchemaPromo  = Schema({
    promoItem: {
        type: String,
        required: true,
    },
    promoDescription: {
        type: String,
        required: true,
    },
    urlPromo: {
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

export default model( 'Promo', SchemaPromo );