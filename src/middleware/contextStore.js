export const setAuthContext = (req, contextData) => {
    req.user = contextData;
    req.auth = contextData;
};

export const getAuthContext = (req) => {
    return req.user || req.auth || null;
};
