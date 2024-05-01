import nodemailer from 'nodemailer';

export const sendResumeOrderMail = async( email, id, userCart, user ) => {

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const data = userCart.map(
        ( item ) => {
            return (
                `
                    <td  align="center" style="padding: 25px 5px; display: block;">
                        <img src=${ item.image } alt="Imagen de producto" style="display: block; margin: 10px auto; height: 100px; width: 100px;"></img>
                        <p style="font-size: 16px; color: #333; text-align: center;" > ${ item.itemTitle } </p>
                        <p style="font-size: 16px; color: #333; text-align: center;" >Precio unitario: $ ${ item.price  } </p>
                        <p style="font-size: 16px; color: #333; text-align: center;" > ${ item.quantity } unidad(es)</p>
                        <p style="font-size: 16px; color: #333; text-align: center;" > No. pedido: ${ id } </p>
                    </td>                                        
                `
            )
        }
    );

    await transporter.sendMail({
         from: 'El Merkadeo <contacto@elmerkadeo.com>',
         to: email,
         subject: `DETALLES DE TU PEDIDO NO: ${ id }`,
         text: 'Tu pedido fue procesado exitosamente',
         html: `
            <!DOCTYPE html>
            <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>AQUÍ ESTAN LOS DETALLES DE TU PEDIDO NO: ${ id } </title>
                </head>
                <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="300" style="background-color: #ffffff; margin-top: 20px;">
                        <tr>
                            <td align="center" style="padding: 25px 5px; display: block;">
                                <img src="${ process.env.IMG_AVATAR_URL }" alt="Avatar El Merkadeo" style="display: block; margin: 10px auto; height: 100px; width: 100px;">
                                <p style="font-size: 16px; color: #333; text-align: center;">Hola <strong style="color: #493d52">${ user }</strong>, aquí están los detalles de tu compra, en breve te haremos llegar tu número de guía con el que podrás rastrear tu pedido.</p>
                                <p style="font-size: 16px; color: #333; text-align: center;">Agradecemos tu confianza y esperamos disfrutes de tus productos.</p>
                            </td>
                            ${ data }
                        </tr>
                    </table>
                </body>
            </html>
         `,
    });
};
