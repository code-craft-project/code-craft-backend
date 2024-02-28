import jwt, { JwtPayload } from "jsonwebtoken";

export const verifyToken = (access_token: string): jwt.JwtPayload | null => {
    try {
        const decoded = jwt.verify(access_token, process.env.JWT_SECRET as string, { algorithms: ["HS256"] });
        return decoded as JwtPayload;
    } catch (err) {
        console.error("verifyToken:", err);
        return null;
    }
};

export const generateToken = (payload: any): string => {
    return jwt.sign(payload, process.env.JWT_SECRET as string, { algorithm: "HS256" });
}