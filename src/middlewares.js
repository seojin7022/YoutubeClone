import multer from "multer";

export const localMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.loggedInUser = req.session.user;
    res.locals.session = req.session;
    next();
};

export const protectorMiddleware = (req, res, next) => {
    if (req.session.loggedIn) {
        next()
    } else {
        return res.redirect("/login")
    }
}

export const publicOnlyMiddleware = (req, res, next) => {
    if (!req.session.loggedIn) {
        return next();
    } else {
        return res.redirect("/");
    }
}

export const pathOnlyMiddleware = (req, res, next) => {
    if (req.session.file === null) {
        return res.redirect("/");
    } else {
        next();
    }
}

export const resetMiddleware = (req, res, next) => {
    if (req.session && req.url !== "/videos/upload/details") {
        req.session.file = null;
    }
    next();
}

export const avatarUpload = multer({ dest: "uploads/avatars/" , limits: {
    fileSize: 3000000,
}});
export const videoUpload = multer({ dest: "uploads/videos/" , limits: {
    fileSize: 10000000,
}});