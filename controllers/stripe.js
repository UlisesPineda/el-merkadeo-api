import Stripe from 'stripe';

const stripe = new Stripe( process.env.STRIPE_PRIVET_KEY );

export const processPayment = async( req, res ) => {
    const { id, amount, description } = req.body;
    try {
        const payment = await stripe.paymentIntents.create({
            amount,
            description: 'Estos son los detalles de tu compra',
            currency: 'MXN',
            payment_method: id,
            confirm: true,
            return_url: `${ process.env.FRONT_END_URL }/carrito`,
        });
        return res.status(200).json({
            ok: true,
            message: 'El pago fue procesado exitosamente',
            text: 'Te hemos enviado un correo con los detalles de tu compra',
            id,
            amount,
            description,
            payment,
        });
    } catch (error) {
        console.log( error );
        if ( error.code === 'card_declined' ){
            return res.status(500).json({
                ok: false,
                founds: true,
                message: 'La tarjeta fue declinada por cualquiera de las siguientes opciones:',
                text: 'Insuficiencia de fondos, Tarjeta perdida, tarjeta robada'
            });
        }
        if ( error.code === 'expired_card' ){
            return res.status(500).json({
                ok: false,
                message: 'La tarjeta está vencida',
                text: 'Intenta con una tarjeta vigente',
            });
        }
        if ( error.code === 'incorrect_cvc' ){
            return res.status(500).json({
                ok: false,
                message: 'El código de seguridad de la tarjeta es incorrecto',
                text: 'Corrige la información de tu tarjeta',
            });
        }
        if ( error.code === 'incorrect_number' ){
            return res.status(500).json({
                ok: false,
                message: 'El número de tarjeta es incorrecto',
                text: 'Corrige la información de tu tarjeta',
            });
        }
        else {
            return res.status(500).json({
                ok: false,
                message: 'Hubo un error al procesar el pago',
                text: 'Intenta más tarde',
            });
        }
    }
};