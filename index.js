import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import { dbMongoConnection } from './database/config.js';

import { authUserRouter } from './routes/authUser.js';
import { settingsUserRouter } from './routes/settingsUser.js';
import { authAdminRouter } from './routes/authAdmin.js';
import { productsRouter } from './routes/products.js';
import { promoRouter } from './routes/promos.js';
import { categoryRouter } from './routes/category.js';
import { suscriberRouter } from './routes/suscriber.js';
import { stripeRouter } from './routes/stripe.js';

dbMongoConnection();

const app = express();
const port = process.env.PORT;

app.use( cors() );
app.use( express.json() );
app.use( express.static('public') );

app.use( '/api/auth-user', authUserRouter );
app.use( '/api/settings-user', settingsUserRouter );
app.use( '/api/auth-admin', authAdminRouter );
app.use( '/api/products', productsRouter );
app.use( '/api/promos', promoRouter );
app.use( '/api/category', categoryRouter );
app.use( '/api/suscribers', suscriberRouter );
app.use( '/api/payment', stripeRouter );

app.listen( port, () => {
    console.log(`Servidor corriendo en el puerto: ${ port }`);
} );
