export const fetchErrorActions = ( res, error, message ) => {
    console.log( error );
    return res.status(500).json({
        ok: false,
        message,
    });
};