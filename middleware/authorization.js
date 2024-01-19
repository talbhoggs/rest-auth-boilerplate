const authorization = (...roles) => {
    // (...roles) means that this function accepts n number of parameter

    // callback
    return (req, res, next) => {
        if (!req.userinfo || !req.userinfo.roles) {
            return res.status(403).json({
                successful: false,
                message: 'Access Denied',
                timestamp: Date.now(),
                status: 403,
            });
        }

        //const valid = req.userinfo.roles.map(role => roles.includes(role)).find(val => val === true);

        let valid = false;
        req.userinfo.roles.forEach(role => {
            if (roles.includes(role)) valid = true;
        });

        if (!valid) {
            return res.status(403).json({
                successful: false,
                message: 'Access Denied',
                timestamp: Date.now(),
                status: 403,
            });
        }

        next();
    };
};

module.exports = authorization;
