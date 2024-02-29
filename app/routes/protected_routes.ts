import { NextFunction, Request, Response } from "express";
import { auth } from "./auth/auth_service";

const STATIC_PROTECTED_ROUTES: string[] = ["/companies/create", "/clubs/create"];

export const protectedRoutes = (req: Request, res: Response, next: NextFunction) => {
    if (STATIC_PROTECTED_ROUTES.includes(req.path)) {
        auth(req, res, next);
    } else {
        next();
    }
}