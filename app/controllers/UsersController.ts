import { Request, Response } from "express";
import UsersService from "../services/UsersService";

export default class UsersController {
    usersService: UsersService;

    constructor(usersService: UsersService) {
        this.usersService = usersService;
    }

    getCurrentUser = async (req: Request, res: Response) => {
        const user = req.user;

        res.status(200).json({
            status: "success",
            data: user
        });
    }

    getUserById = async (req: Request, res: Response) => {
        const { id } = req.params;

        const user = await this.usersService.getUserById(parseInt(id));
        if (!user) {
            res.status(200).json({ status: "error", message: "User not found" });
            return;
        }

        res.status(200).json({ status: "success", data: user });
    }

    updateUser = async (req: Request, res: Response) => {
        const user = req.user;
        const data = req.body;

        const allowedProperties = [
            'username',
            'first_name',
            'last_name',
            'email',
            'profile_image_url',
        ];

        const propertyNames: string[] = Object.getOwnPropertyNames(data);
        for (let property of propertyNames) {
            if (!allowedProperties.includes(property)) {
                res.status(200).json({ status: "error", message: `Can't update ${property}` });
                return;
            }
        }

        if (data.username) {
            const userByUsername = await this.usersService.getUserByUsername(data.username);
            if (userByUsername && userByUsername.id != user?.id) {
                res.status(200).json({ status: "error", message: `username already in use` });
                return;
            }
        }

        if (data.email) {
            const userByEmail = await this.usersService.getUserByEmail(data.email);
            if (userByEmail && userByEmail.id != user?.id) {
                res.status(200).json({ status: "error", message: `email already in use` });
                return;
            }
        }

        const updateUser = await this.usersService.updateUser(user?.id!, data);
        if (!updateUser) {
            res.status(200).json({ status: "error", message: "Something went wrong" });
            return;
        }

        res.status(200).json({ status: "success", message: "User updated successfully" });
    }
};