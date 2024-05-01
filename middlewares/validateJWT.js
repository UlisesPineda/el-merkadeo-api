import jwt from 'jsonwebtoken';

export const validateJWT = ( req, res, next ) => {
    const token = req.header('x-token');
    if( !token ){
        return res.status(401).json({
            ok: false,
            msg: 'No existe el token'
        });
    }
    else {
        try {
            const { _id } = jwt.verify( token, process.env.JWT_AUTH_KEY );  
            req._id = _id;
        } catch (error) {
            console.log(error);
            return res.status(401).json({
                ok: false,
                msg: 'Token no válido'
            });
        };
    }
    next();
};