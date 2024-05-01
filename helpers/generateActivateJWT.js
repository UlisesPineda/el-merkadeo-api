import jwt from 'jsonwebtoken';

export const generateActivateJWT = ( email ) => {
    return new Promise(
        ( resolve, reject ) => {
            const payload = { email };
            jwt.sign(
                payload,
                process.env.JWT_AUTH_KEY,
                {
                    expiresIn: '7d',
                },
                ( error, token ) => {
                    if( error ){
                        console.log( error );
                        reject( 'Error al generar el token de activación' );
                    }
                    else {
                        resolve( token );
                    }
                }
            );
        }
    );
};