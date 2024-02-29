import { companiesRepository } from "@/app/repositories";
import { company_validator } from "@/app/validators";
import { ValidatorResult } from "@/domain/validator/ValidatorResult";
import { Request, Response } from "express";

export async function getCompanies(req: Request, res: Response) {
    const { page, limits } = req.query;

    let offset = 0;
    let limit = 10;

    if (page) {
        offset = parseInt(page as string) || 0;
    }

    if (limits) {
        limit = parseInt(limits as string) || limit;
    }

    let data = await companiesRepository.getCompaniesByPage(offset, limit);

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

export async function getCompanyById(req: Request, res: Response) {
    const { id } = req.params;

    let data = await companiesRepository.getCompanyById(parseInt(id));

    if (!data) {
        res.status(200).json({
            status: "success",
            message: "Comapny not found",
            data: []
        });

        return;
    }

    res.status(200).json({
        status: "success",
        data
    });
}

export async function createCompany(req: Request, res: Response) {
    const company: CompanyInterface = req.body;

    let validate_result: ValidatorResult = company_validator.validate(company);
    if (!validate_result.is_valid) {
        res.status(200).json({ status: "error", message: "Invalid body parameters", errors: validate_result.messages });
        return;
    }

    const companies = await companiesRepository.getCompanyByName(company.name);
    if(companies){
        res.status(200).json({ status: "error", message: "Name already in use" });
        return;
    }

    const owner_id = req.user?.id as number;
    let result = await companiesRepository.createCompany({ ...company, owner_id });
    if (!result) {
        res.status(200).json({ status: "error", message: "Can't create company, something went wrong" });
        return;
    }

    res.status(200).json({ status: "success", data: result });
}