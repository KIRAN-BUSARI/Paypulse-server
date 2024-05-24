import jwt from "jsonwebtoken";
import { config } from "dotenv";
config()

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({
            success: false,
            message: "Invalid Header"
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.userId) {
            req.userId = decoded.userId;
            next();
        }

    } catch (err) {
        return res.status(403).json({
            success: false,
            message: "Could not verify the token"
        });
    }
};

export {
    authMiddleware
}