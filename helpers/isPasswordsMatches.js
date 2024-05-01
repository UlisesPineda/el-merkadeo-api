export const isPasswordsMatches = ( value, { req } ) => {
    const passwordConfirm = req.body.confirmPassword;
    return value === passwordConfirm ? true : false;
};