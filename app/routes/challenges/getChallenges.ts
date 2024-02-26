import { MySQLDatabase } from "@/infrastructure/database/MySQLDatabase";
import { Request, Response } from "express";

export async function getChallenges(req: Request, res: Response) {
    let db = new MySQLDatabase();
    let result = await db.query("select * from users");
    console.log({ result });
    res.send("Hello World");
}