export const isUnlimitedAdmin = (value, { req }) => {
    const unlimitedActions = req.body.isUnlimited;
    return unlimitedActions ? true : false;
};
