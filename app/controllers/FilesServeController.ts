import { Request, Response } from "express";
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';

export default class FilesServeController {
    serveImage = async (req: Request, res: Response) => {
        try {
            const filePath = path.join(process.cwd(), 'public', req.url);

            let contentType = mime.contentType(filePath);;
            if (!contentType) {
                res.status(404).send({ status: "error", message: "Image not found" });
                return;
            }
            res.setHeader('Content-Type', contentType);

            const fileStream = fs.createReadStream(filePath);

            fileStream.on('error', (err) => {
                res.removeHeader('Content-Type');
                res.status(404).send({ status: "error", message: "Image not found" });
            });

            fileStream.pipe(res);
        } catch (err) {
            res.removeHeader('Content-Type');
            res.status(404).send({ status: "error", message: "Image not found" });
        }
    }

    serveFile = async (req: Request, res: Response) => {
        try {
            const filePath = path.join(process.cwd(), 'public', req.url);
            const fileName = path.basename(filePath);

            let contentType = mime.contentType(filePath);;
            if (!contentType) {
                res.status(404).send({ status: "error", message: "File not found" });
                return;
            }

            res.setHeader('Content-Type', contentType);
            res.setHeader('Content-disposition', 'attachment; filename=' + fileName);


            const fileStream = fs.createReadStream(filePath);

            fileStream.on('error', (err) => {
                res.removeHeader('Content-Type');
                res.status(404).send({ status: "error", message: "File not found" });
            });

            fileStream.pipe(res);
        } catch (err) {
            res.removeHeader('Content-Type');
            res.status(404).send({ status: "error", message: "Image not found" });
        }
    }
};