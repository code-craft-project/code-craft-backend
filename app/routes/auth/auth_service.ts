import { userSessionsRepository, usersRepository } from "@/app/repositories";
import { credentials_validator, user_validator } from "@/app/validators";
import { ValidatorResult } from "@/domain/validator/ValidatorResult";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateToken, verifyToken } from "@/infrastructure/jwt";

export const sign_in = async (req: Request, res: Response) => {
    const credentials: CredentialsInterface = req.body;

    const result: ValidatorResult = credentials_validator.validate(credentials);
    if (!result.is_valid) {
        res.status(200).json({ status: "error", message: "missing properties", errors: result.messages });
        return;
    }

    const user = await usersRepository.getUserByEmail(credentials.email);
    if (!user) {
        res.status(200).json({ status: "error", message: "User does not exist" });
        return;
    }

    const is_valid = bcrypt.compareSync(credentials.password, user.password);
    if (!is_valid) {
        res.status(200).json({ status: "error", message: "Wrong password" });
        return;
    }

    const access_token = generateToken({ id: user.id, username: user.username, email: user.email });

    await userSessionsRepository.createUserSession({ user_id: user.id as number, access_token });

    res.status(200).json({ status: "success", data: { access_token, user } });
}

export const sign_up = async (req: Request, res: Response) => {
    const user: UserInterface = req.body;

    const result: ValidatorResult = user_validator.validate(user);
    if (!result.is_valid) {
        res.status(200).json({ status: "error", message: "missing properties", errors: result.messages });
        return;
    }

    const user_with_the_same_username = await usersRepository.getUserByUsername(user.username);
    if (user_with_the_same_username) {
        res.status(200).json({ status: "error", message: "username already used by another user" });
        return;
    }

    const user_with_the_same_email = await usersRepository.getUserByEmail(user.email);
    if (user_with_the_same_email) {
        res.status(200).json({ status: "error", message: "email already used by another user" });
        return;
    }

    const salt = bcrypt.genSaltSync();
    const hashed_passowrd = await bcrypt.hash(user.password, salt);

    const create_user = await usersRepository.createUser({ ...user, password: hashed_passowrd });
    if (!create_user) {
        res.status(200).json({ status: "error", message: "Something went wrong while creating new user" });
        return;
    }

    res.status(200).json({ status: "success", data: create_user });
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.headers.authorization;

    if (!access_token) {
        res.status(200).json({ status: "error", message: "missing Authorization Header" });
        return;
    }

    const decoded = verifyToken(access_token);
    if(!decoded){
        res.status(200).json({ status: "error", message: "Invalid Token" });
        return;
    }

    const user = await usersRepository.getUserByEmail(decoded.email);
    if(!user){
        res.status(200).json({ status: "error", message: "Invalid Token" });
        return;
    }

    req.user = user;

    next();
}