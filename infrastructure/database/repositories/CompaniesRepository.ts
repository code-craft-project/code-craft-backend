import { USER_JOIN_PROPS } from "@/domain/repositories/UsersRepositoryInterface";
import { MySQLDatabase } from "../MySQLDatabase";
import { COMPANY_CREATE_PROPS, COMPANY_SELECT_PROPS, CompaniesRepositoryInterface } from "@/domain/repositories/CompaniesRepositoryInterface";

export default class CompaniesRepository implements CompaniesRepositoryInterface {
    database: MySQLDatabase;
    constructor(database: MySQLDatabase) {
        this.database = database;
    }

    async createCompany(company: CompanyInterface): Promise<CompanyInterface | null> {
        const result = await this.database.query<CompanyInterface>(
            `insert into companies (${COMPANY_CREATE_PROPS}) values (?);`,
            [
                company.name,
                company.owner_id,
                company.profile_image_url,
            ]
        );
        if (result) {
            return result;
        }

        return null;
    }

    async getCompanyById(id: number): Promise<CompanyInterface | null> {
        let data = await this.database.query<CompanyInterface[]>(`select ${COMPANY_SELECT_PROPS}, JSON_OBJECT(${USER_JOIN_PROPS}) AS owner from companies join users on owner_id = users.id where companies.id = ?;`, [id]);

        if (data && data.length > 0) {
            return data[0];
        }

        return null;
    }

    async getCompanyByName(name: string): Promise<CompanyInterface | null> {
        let data = await this.database.query<CompanyInterface[]>(`select ${COMPANY_SELECT_PROPS}, JSON_OBJECT(${USER_JOIN_PROPS}) AS owner from companies join users on owner_id = users.id where name = ?;`, [name]);

        if (data && data.length > 0) {
            return data[0];
        }

        return null;
    }

    async getCompaniesByPage(page: number = 0, limits: number = 10): Promise<CompanyInterface[] | null> {
        let data = await this.database.query<CompanyInterface[]>(`select ${COMPANY_SELECT_PROPS}, JSON_OBJECT(${USER_JOIN_PROPS}) AS owner from companies join users on owner_id = users.id limit ?;`, [page, limits]);
        if (!data) {
            return null;
        }

        return data;
    }
}