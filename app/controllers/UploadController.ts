import { Request, Response } from "express";

import mime from 'mime-types';
import fileUpload from "express-fileupload";

export default class UploadController {

    uploadImage = async (req: any, res: Response) => {
        try {
            const { image }: { image: fileUpload.UploadedFile } = req.files;

            if (!image) return res.sendStatus(400);

            if (!/^image/.test(image.mimetype)) return res.sendStatus(400);

            const currentDate = new Date();
            const hhmmss = currentDate
                .toTimeString()
                .split(" ")[0]
                .replace(/:/g, "");
            const MMMM = String(currentDate.getMilliseconds()).padStart(4, "0");
            const ddmmyyyy =
                String(currentDate.getDate()).padStart(2, "0") +
                String(currentDate.getMonth() + 1).padStart(2, "0") +
                currentDate.getFullYear();

            const fileName = `${hhmmss}${MMMM}_${ddmmyyyy}`;

            const path = `/public/images/${fileName}.${mime.extension(image.mimetype)}`;
            image.mv(`${process.cwd()}${path}`, (err: any) => {
                if (err) {
                    console.error('Error uploading file:', err);
                    return res.status(404).json({ status: "error", message: "Upload failed" });
                }
                res.status(200).json({ status: "success", message: "Image uploaded successfully", data: path });
            });

        } catch (err) {
            res.status(404).json({ status: "error", message: "Upload failed" });
        }
    }

    uploadFile = async (req: any, res: Response) => {
        try {
            const { file }: { file: fileUpload.UploadedFile } = req.files;

            if (!file) return res.sendStatus(400);

            const currentDate = new Date();
            const hhmmss = currentDate
                .toTimeString()
                .split(" ")[0]
                .replace(/:/g, "");
            const MMMM = String(currentDate.getMilliseconds()).padStart(4, "0");
            const ddmmyyyy =
                String(currentDate.getDate()).padStart(2, "0") +
                String(currentDate.getMonth() + 1).padStart(2, "0") +
                currentDate.getFullYear();

            const fileName = `${hhmmss}${MMMM}_${ddmmyyyy}`;

            const path = `/public/files/${fileName}.${mime.extension(file.mimetype)}`;
            file.mv(`${process.cwd()}${path}`, (err: any) => {
                if (err) {
                    console.error('Error uploading file:', err);
                    return res.status(404).json({ status: "error", message: "Upload failed" });
                }
                res.status(200).json({ status: "success", message: "File uploaded successfully", data: path });
            });

        } catch (err) {
            res.status(404).json({ status: "error", message: "Upload failed" });
        }
    }
};