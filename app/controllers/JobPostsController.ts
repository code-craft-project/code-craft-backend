import JobPostValidator from "@/infrastructure/validators/JobPostValidator";
import { Request, Response } from "express";
import JobPostsService from "../services/JobPostsService";
import { ValidatorResult } from "@/domain/validator/ValidatorResult";

export default class JobPostsController {
    jobPostsService: JobPostsService;
    jobPostValidator: JobPostValidator;

    constructor(jobPostsService: JobPostsService, jobPostValidator: JobPostValidator) {
        this.jobPostsService = jobPostsService;
        this.jobPostValidator = jobPostValidator;
    }

    async getJobPosts(req: Request, res: Response) {
        const { page, limits } = req.query;
    
        let offset = 0;
        let limit = 10;
    
        if (page) {
            offset = parseInt(page as string) || 0;
        }
    
        if (limits) {
            limit = parseInt(limits as string) || limit;
        }
    
        let data = await this.jobPostsService.getJobPostsByPage(offset, limit);
    
        if (!data) {
            res.status(200).json({
                status: "success",
                message: "No data",
                data: []
            });
    
            return;
        }
    
        res.status(200).json({
            status: "success",
            data
        });
    }
    
    async getJobPostById(req: Request, res: Response) {
        const { id } = req.params;
    
        let data = await this.jobPostsService.getJobPostById(parseInt(id));
    
        if (!data) {
            res.status(200).json({
                status: "success",
                message: "Job Post not found",
                data: []
            });
    
            return;
        }
    
        res.status(200).json({
            status: "success",
            data
        });
    }
    
    async createJobPost(req: Request, res: Response) {
        const jobpost: JobPostEntity = req.body;
    
        let validate_result: ValidatorResult = this.jobPostValidator.validate(jobpost);
        if (!validate_result.is_valid) {
            res.status(200).json({ status: "error", message: "Invalid body parameters", errors: validate_result.messages });
            return;
        }
    
        // FIXME: Check if user has necessary access
        let result = await this.jobPostsService.createJobPost({ ...jobpost });
        if (!result) {
            res.status(200).json({ status: "error", message: "Can't create job post, something went wrong" });
            return;
        }
    
        res.status(200).json({ status: "success", data: result });
    }
};