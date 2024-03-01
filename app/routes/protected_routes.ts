import { NextFunction, Request, Response } from "express";
import { auth } from "./auth/auth_service";

const STATIC_PROTECTED_ROUTES: string[] = ["/organizations/create", "/challenges/create", "/jobposts/create"];
const DYNAMIC_PROTECTED_ROUTES: RegExp[] = [
    /^\/organizations\/[0-9]+\/add_member$/,
    /^\/organizations\/[0-9]+\/remove_member$/,
    /^\/organizations\/[0-9]+\/give_permission$/,
];

export const protectedRoutes = (req: Request, res: Response, next: NextFunction) => {
    for (let index = 0; index < DYNAMIC_PROTECTED_ROUTES.length; index++) {
        const regex = DYNAMIC_PROTECTED_ROUTES[index];
        if (req.path.match(regex)) {
            auth(req, res, next);
            return;
        }
    }

    if (STATIC_PROTECTED_ROUTES.includes(req.path)) {
        auth(req, res, next);
    } else {
        next();
    }
}