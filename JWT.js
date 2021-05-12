const { sign, verify } = require('jsonwebtoken');

const createTokens = (user) => {
    const accesToken = sign
        ({
            id: user.id,
            email: user.email,
            role: user.role
        }, "jwtsecretplschange"
        );

    return accesToken;
}

const validateToken = (req, res, next) => {
    const accessToken = req.cookies['access-token'];
    if (!accessToken) {
        res.status(400).json({ error: "Usuario no autenticado", authorized: false});
    }

    try {
        verify(accessToken, "jwtsecretplschange", (err, authData) => {
            if (err) {
                res.status(403).json({ mensaje: "no estás autorizado papi", error: err,authorized:false })
            } else {
                req.authData = authData; 
                res.json({
                    mensaje: "autorizado",
                    authData,
                    authorized:true

                })
                return next();
            }
        });
    } catch (err) {
        return res.status(400).json({ error: err })
    }
}

module.exports = { createTokens, validateToken };