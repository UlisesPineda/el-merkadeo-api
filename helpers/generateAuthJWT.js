import jwt from 'jsonwebtoken';

export const generateAuthJWT = ( _id ) => {
    return new Promise((resolve, reject) => {
        const payload = { _id };
        jwt.sign( 
            payload, 
            process.env.JWT_AUTH_KEY,
            {
                expiresIn: '1h',
            },
            (err, token) => {
                if( err ) {
                    console.log( err );
                    reject( 'No se pudo generar el token' );
                }
                else {
                    resolve( token );
                }
            }
         );
    });
};