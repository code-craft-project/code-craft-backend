import { NextFunction, Request, Response } from "express";
import UsersService from "../services/UsersService";
import CredentialsValidator from "@/infrastructure/validators/CredentialsValidator";
import { ValidatorResult } from "@/domain/validator/ValidatorResult";
import bcrypt from "bcrypt";
import { generateToken, verifyToken } from "@/infrastructure/jwt";
import UserSessionsService from "../services/UserSessionsService";
import UserValidator from "@/infrastructure/validators/UserValidator";
import crypto from 'crypto';

const STATIC_PROTECTED_ROUTES: string[] = [
    "/organizations/create",
    "/challenges/create",
    "/jobposts/create",
    "/events/create",
    "/users",
    "/users/me",
    "/users/me/skills",
    "/users/me/skills/create",
    "/users/me",
    "/users/my_progress",
    "/upload/image"
];
const DYNAMIC_PROTECTED_ROUTES: RegExp[] = [
    /^\/users\/me\/skills\/[0-9]+\/delete$/,
    /^\/organizations\/me$/,
    /^\/organizations\/[0-9]+\/update$/,
    /^\/organizations\/[0-9]+\/members\/me$/,
    /^\/organizations\/[0-9]+\/members\/[0-9]+\/update$/,
    /^\/organizations\/[0-9]+\/members$/,
    /^\/organizations\/[0-9]+\/challenges$/,
    /^\/organizations\/[0-9]+\/challenges\/[0-9]+\/update$/,
    /^\/organizations\/[0-9]+\/challenges\/[0-9]+\/update_test_cases$/,
    /^\/organizations\/[0-9]+\/challenges\/[0-9]+\/delete$/,
    /^\/organizations\/[0-9]+\/dashboard$/,
    /^\/organizations\/[0-9]+\/add_member$/,
    /^\/organizations\/[0-9]+\/remove_member$/,
    /^\/organizations\/[0-9]+\/give_permission$/,
    /^\/organizations\/[0-9]+\/challenges\/create$/,
    /^\/organizations\/[0-9]+\/job_posts\/[0-9]+\/applications$/,
    /^\/events\/[0-9]+\/join_event$/,
    /^\/events\/[0-9]+\/leave_event$/,
    /^\/events\/[0-9]+\/update$/,
    /^\/events\/[0-9]+\/delete$/,
    /^\/events\/[0-9]+\/teams\/me$/,
    /^\/events\/[0-9]+\/teams\/[0-9]+\/update$/,
    /^\/events\/[0-9]+\/teams\/create$/,
    /^\/events\/[0-9]+\/teams\/delete$/,
    /^\/events\/[0-9]+\/teams\/join$/,
    /^\/events\/[0-9]+\/teams\/leave$/,
    /^\/events\/[0-9]+\/challenges$/,
    /^\/events\/[0-9]+\/challenges\/topic\/[a-z ]+$/,
    /^\/events\/[0-9]+\/challenges\/create$/,
    /^\/events\/[0-9]+\/challenges\/[0-9]+\/update$/,
    /^\/jobposts\/[0-9]+\/apply$/,
    /^\/jobposts\/[0-9]+\/update$/,
    /^\/jobposts\/[0-9]+\/delete$/,
    /^\/challenges\/[0-9]+\/comments\/create$/,
    /^\/challenges\/[0-9]+\/comments\/[0-9]+\/toggle_like$/,
    /^\/challenges\/[0-9]+\/update$/,
    /^\/challenges\/[0-9]+\/test_cases\/create$/,
    /^\/challenges\/[0-9]+\/submissions$/,
    /^\/auth\/sign_out$/,
];

export default class AuthController {
    usersService: UsersService;
    userSessionsService: UserSessionsService;
    credentialsValidator: CredentialsValidator;
    userValidator: UserValidator;

    constructor(usersService: UsersService, userSessionsService: UserSessionsService, credentialsValidator: CredentialsValidator, userValidator: UserValidator) {
        this.usersService = usersService;
        this.userSessionsService = userSessionsService;
        this.credentialsValidator = credentialsValidator;
        this.userValidator = userValidator;
    }

    signIn = async (req: Request, res: Response): Promise<void> => {
        const credentials: CredentialsInterface = req.body;

        const result: ValidatorResult = this.credentialsValidator.validate(credentials);
        if (!result.is_valid) {
            res.status(200).json({ status: "error", message: "missing properties", errors: result.messages });
            return;
        }

        const user = await this.usersService.getUserByEmail(credentials.email, true);
        if (!user) {
            res.status(200).json({ status: "error", message: "User does not exist" });
            return;
        }

        const is_valid = bcrypt.compareSync(credentials.password, user.password);
        if (!is_valid) {
            res.status(200).json({ status: "error", message: "Wrong password" });
            return;
        }

        const access_token = generateToken({ id: user.id, username: user.username, email: user.email, uuid: crypto.randomUUID() });

        await this.userSessionsService.createUserSession({ user_id: user.id as number, access_token });

        res.status(200).json({ status: "success", data: { access_token, user } });
    }

    signUp = async (req: Request, res: Response): Promise<void> => {
        const user: UserEntity = req.body;

        const result: ValidatorResult = this.userValidator.validate(user);
        if (!result.is_valid) {
            res.status(200).json({ status: "error", message: "missing properties", errors: result.messages });
            return;
        }

        const user_with_the_same_username = await this.usersService.getUserByUsername(user.username);
        if (user_with_the_same_username) {
            res.status(200).json({ status: "error", message: "username already used by another user" });
            return;
        }

        const user_with_the_same_email = await this.usersService.getUserByEmail(user.email);
        if (user_with_the_same_email) {
            res.status(200).json({ status: "error", message: "email already used by another user" });
            return;
        }

        const salt = bcrypt.genSaltSync();
        const hashed_passowrd = await bcrypt.hash(user.password, salt);

        const create_user = await this.usersService.createUser({ ...user, password: hashed_passowrd });
        if (!create_user) {
            res.status(200).json({ status: "error", message: "Something went wrong while creating new user" });
            return;
        }

        res.status(200).json({ status: "success", data: create_user });
    }

    signOut = async (req: Request, res: Response): Promise<void> => {
        const accessToken = req.headers.authorization;

        await this.userSessionsService.deleteUserSessionByAccessToken(accessToken as string);

        res.status(200).json({ status: "success", message: 'Sign out success' });
    }

    auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const access_token = req.headers.authorization;

        if (!access_token) {
            res.status(200).json({ status: "error", message: "missing Authorization Header" });
            return;
        }

        const userSession = await this.userSessionsService.getUserSessionByAccessToken(access_token);

        if (!userSession) {
            res.status(200).json({ status: "error", message: "Invalid session" });
            return;
        }

        const decoded = verifyToken(access_token);
        if (!decoded) {
            res.status(200).json({ status: "error", message: "Invalid Token" });
            return;
        }

        const user = await this.usersService.getUserByEmail(decoded.email);
        if (!user) {
            res.status(200).json({ status: "error", message: "Invalid Token" });
            return;
        }

        req.user = user;

        next();
    }

    optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const access_token = req.headers.authorization;

        if (!access_token) {
            next();
            return;
        }

        const userSession = await this.userSessionsService.getUserSessionByAccessToken(access_token);

        if (!userSession) {
            next();
            return;
        }

        const decoded = verifyToken(access_token);
        if (!decoded) {
            next();
            return;
        }

        const user = await this.usersService.getUserByEmail(decoded.email);
        if (!user) {
            next();
            return;
        }

        req.user = user;

        next();
    }

    routeProtectionMiddleWare = async (req: Request, res: Response, next: NextFunction) => {
        for (let index = 0; index < DYNAMIC_PROTECTED_ROUTES.length; index++) {
            const regex = DYNAMIC_PROTECTED_ROUTES[index];
            if (req.path.match(regex)) {
                this.auth(req, res, next);
                return;
            }
        }

        if (STATIC_PROTECTED_ROUTES.includes(req.path)) {
            this.auth(req, res, next);
        } else {
            this.optionalAuth(req, res, next);
        }
    }
};