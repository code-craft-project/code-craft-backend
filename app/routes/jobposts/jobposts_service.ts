import { jobPostsRepository } from "@/app/repositories";
import { job_post_validator } from "@/app/validators";
import { ValidatorResult } from "@/domain/validator/ValidatorResult";
import { Request, Response } from "express";

export async function getJobPosts(req: Request, res: Response) {
    const { page, limits } = req.query;

    let offset = 0;
    let limit = 10;

    if (page) {
        offset = parseInt(page as string) || 0;
    }

    if (limits) {
        limit = parseInt(limits as string) || limit;
    }

    let data = await jobPostsRepository.getJobPostsByPage(offset, limit);

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

export async function getJobPostById(req: Request, res: Response) {
    const { id } = req.params;

    let data = await jobPostsRepository.getJobPostById(parseInt(id));

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

export async function createJobPost(req: Request, res: Response) {
    const jobpost: JobPostInterface = req.body;

    let validate_result: ValidatorResult = job_post_validator.validate(jobpost);
    if (!validate_result.is_valid) {
        res.status(200).json({ status: "error", message: "Invalid body parameters", errors: validate_result.messages });
        return;
    }

    // FIXME: Check if user has necessary access
    let result = await jobPostsRepository.createJobPost({ ...jobpost });
    if (!result) {
        res.status(200).json({ status: "error", message: "Can't create job post, something went wrong" });
        return;
    }

    res.status(200).json({ status: "success", data: result });
}