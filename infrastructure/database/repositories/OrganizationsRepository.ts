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

    async getDashboardStat(organization_id: number): Promise<OrganizationStats | null> {
        let data = await this.database.query<OrganizationStats[]>(`select (select count(*) from members where members.organization_id = ?) as total_members, (select count(*) from organization_challenges where organization_challenges.organization_id = ?) as total_challenges, (select count(*) from events where organization_id = ?) as total_events, (select count(*) from event_participants where event_id in (select id from events where organization_id = ?)) as total_participants;`, organization_id, organization_id, organization_id, organization_id);

        if (!data) {
            return null;
        }

        if (data.length > 0) {
            return data[0];
        }

        return null;
    }

    async updateOrganizationById(organization_id: number, organization: OrganizationEntity): Promise<InsertResultInterface | null> {
        let query = '';

        const params = [];
        const propertyNames = Object.getOwnPropertyNames(organization);
        for (let i = 0; i < propertyNames.length; i++) {
            let property = propertyNames[i];
            query += `${property} = ?`;
            params.push((organization as any)[property]);
            if (i < (propertyNames.length - 1)) {
                query += ',';
            }
        }

        let updateOrganization = await this.database.query<InsertResultInterface>(`update organizations set ${query} where id = ?;`, ...params, organization_id);
        if (!updateOrganization) {
            return null;
        }

        return updateOrganization;
    }

    async getOrganizationsByUserId(user_id: number): Promise<OrganizationEntity[] | null> {
        let data = await this.database.query<OrganizationEntity[]>(`select ${ORGANIZATION_SELECT_PROPS}, JSON_OBJECT(${USER_JOIN_PROPS}) AS creator from organizations join users on creator_id = users.id where organizations.id in (select organization_id from members where members.user_id = ?);`, user_id);
        if (!data) {
            return null;
        }

        return data;
    }
}