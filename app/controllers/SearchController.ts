import { Request, Response } from "express";
import SearchService from "../services/SearchService";

export default class SearchController {
    searchService: SearchService;

    constructor(searchService: SearchService) {
        this.searchService = searchService;
    }

    searchJobPosts = async (req: Request, res: Response) => {
        const { q } = req.query;

        if (!q) {
            res.status(200).json({ status: "error", message: 'q param is required' });
            return;
        }

        const searchResult = await this.searchService.searchJobPosts(q as string);

        res.status(200).json({ status: "success", data: searchResult });
    }

    searchEvents = async (req: Request, res: Response) => {
        const { q } = req.query;

        if (!q) {
            res.status(200).json({ status: "error", message: 'q param is required' });
            return;
        }

        const searchResult = await this.searchService.searchEvents(q as string);
        
        res.status(200).json({ status: "success", data: searchResult });
    }

    searchChallenges = async (req: Request, res: Response) => {
        const { q } = req.query;

        if (!q) {
            res.status(200).json({ status: "error", message: 'q param is required' });
            return;
        }

        const searchResult = await this.searchService.searchChallenges(q as string, req.user?.id);
        
        res.status(200).json({ status: "success", data: searchResult });
    }

    searchOrganizations = async (req: Request, res: Response) => {
        const { q } = req.query;

        if (!q) {
            res.status(200).json({ status: "error", message: 'q param is required' });
            return;
        }

        const searchResult = await this.searchService.searchOrganizations(q as string);
        
        res.status(200).json({ status: "success", data: searchResult });
    }
};