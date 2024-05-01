import nodemailer from 'nodemailer';

export const sendChangePasswordMail = async( email, adminName, token ) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    await transporter.sendMail({
         from: 'El Merkadeo <contacto@elmerkadeo.com>',
         to: email,
         subject: "GENERA UN NUEVO PASSWORD EN TU CUENTA DE ADMINISTRADOR",
         text: 'Crea un nuevo password para que puedas administrar tus productos en tu e-commer de El Merkadeo',
         html: `
            <!DOCTYPE html>
            <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>GENERA UN NUEVO PASSWORD</title>
                </head>
                <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="300" style="background-color: #ffffff; margin-top: 20px;">
                        <tr>
                            <td align="center" style="padding: 25px 5px;">
                                <img src="${ process.env.IMG_AVATAR_URL }" alt="Avatar El Merkadeo" style="display: block; margin: 10px auto; height: 100px; width: 100px;">
                                <p style="font-size: 16px; color: #333; text-align: center;">Hola <strong style="color: #493d52">${ adminName }</strong>, da clic en el siguiente enlace para generar un nuevo password de administrador en tu E-commerce EL MERKADEO.</p>
                                <a href="${ process.env.FRONT_END_URL }/nuevo-password-administrador/${ token }" style="display: inline-block; padding: 10px 20px; background-color: #493d52; border-radius: 5px; color: #fff; text-decoration: none; font-size: 16px; margin-top: 50px;">GENERAR NUEVO PASSWORD</a>
                            </td>
                        </tr>
                    </table>
                </body>
            </html>
         `,
    });
};