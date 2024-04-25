import { USER_JOIN_PROPS } from "@/domain/repositories/UsersRepositoryInterface";
import { MySQLDatabase } from "../MySQLDatabase";
import { ORGANIZATION_CREATE_PROPS, ORGANIZATION_SELECT_PROPS, OrganizationsRepositoryInterface } from "@/domain/repositories/OrganizationsRepositoryInterface";

export default class OrganizationsRepository implements OrganizationsRepositoryInterface {
    database: MySQLDatabase;
    constructor(database: MySQLDatabase) {
        this.database = database;
    }

    async createOrganization(organization: OrganizationEntity): Promise<InsertResultInterface | null> {
        const result = await this.database.query<InsertResultInterface>(
            `insert into organizations (${ORGANIZATION_CREATE_PROPS}) values (?);`,
            [
                organization.name,
                organization.description,
                organization.type,
                organization.creator_id,
                organization.profile_image_url,
            ]
        );
        if (result) {
            return result;
        }

        return null;
    }

    async getOrganizationById(id: number): Promise<OrganizationEntity | null> {
        let data = await this.database.query<OrganizationEntity[]>(`select ${ORGANIZATION_SELECT_PROPS}, JSON_OBJECT(${USER_JOIN_PROPS}) AS creator from organizations join users on creator_id = users.id where organizations.id = ?;`, [id]);

        if (data && data.length > 0) {
            return data[0];
        }

        return null;
    }

    async getOrganizationByName(name: string): Promise<OrganizationEntity | null> {
        let data = await this.database.query<OrganizationEntity[]>(`select ${ORGANIZATION_SELECT_PROPS}, JSON_OBJECT(${USER_JOIN_PROPS}) AS creator from organizations join users on creator_id = users.id where name = ?;`, [name]);

        if (data && data.length > 0) {
            return data[0];
        }

        return null;
    }

    async getOrganizationsByPage(page: number = 0, limits: number = 10): Promise<OrganizationEntity[] | null> {
        let data = await this.database.query<OrganizationEntity[]>(`select ${ORGANIZATION_SELECT_PROPS}, JSON_OBJECT(${USER_JOIN_PROPS}) AS creator from organizations join users on creator_id = users.id limit ?;`, [page, limits]);
        if (!data) {
            return null;
        }

        return data;
    }
}