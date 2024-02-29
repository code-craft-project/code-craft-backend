export const COMPANY_SELECT_PROPS: string = 'companies.id as id, companies.name as name, companies.owner_id as owner_id, companies.profile_image_url as profile_image_url, companies.updated_at as updated_at, companies.created_at as created_at';
export const COMPANY_CREATE_PROPS: string = 'name, owner_id, profile_image_url';

export interface CompaniesRepositoryInterface {
    createCompany(user: CompanyInterface): Promise<CompanyInterface | null>;
    getCompanyById(id: number): Promise<CompanyInterface | null>;
    getCompanyByName(name: string): Promise<CompanyInterface | null>;
    getCompaniesByPage(page: number, limits: number): Promise<CompanyInterface[] | null>;
};