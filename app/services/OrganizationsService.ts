import OrganizationsRepository from "@/infrastructure/database/repositories/OrganizationsRepository";

export default class OrganizationsService {
    organizationsRepository: OrganizationsRepository;

    constructor(organizationsRepository: OrganizationsRepository) {
        this.organizationsRepository = organizationsRepository;
    }

    async createOrganization(organization: OrganizationEntity): Promise<InsertResultInterface | null> {
        return await this.organizationsRepository.createOrganization(organization);
    }

    async getOrganizationById(id: number): Promise<OrganizationEntity | null> {
        return await this.organizationsRepository.getOrganizationById(id);
    }

    async getOrganizationByName(name: string): Promise<OrganizationEntity | null> {
        return await this.organizationsRepository.getOrganizationByName(name);
    }

    async getOrganizationsByPage(page?: number, limits?: number): Promise<OrganizationEntity[] | null> {
        return await this.organizationsRepository.getOrganizationsByPage(page, limits);
    }
};