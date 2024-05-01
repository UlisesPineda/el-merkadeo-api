export const isAcceptedTerms = (value, { req }) => {
    const acceptedValue = req.body.isAccepted;
    return acceptedValue ? true : false;
};
