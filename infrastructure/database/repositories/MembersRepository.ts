import { MEMBER_CREATE_PROPS, MEMBER_SELECT_PROPS, MembersRepositoryInterface } from "@/domain/repositories/MembersRepositoryInterface";
import { MySQLDatabase } from "../MySQLDatabase";

export default class MembersRepository implements MembersRepositoryInterface {
    database: MySQLDatabase;
    constructor(database: MySQLDatabase) {
        this.database = database;
    }

    async createMember(member: MemberInterface): Promise<InsertResultInterface | null> {
        let result = await this.database.query<InsertResultInterface>(`insert into members (${MEMBER_CREATE_PROPS}) values (?);`, [
            member.role,
            member.user_id,
            member.organization_id,
        ]);

        if (result) {
            return result;
        }

        return null;
    }

    async getMemberById(member_id: number): Promise<MemberInterface | null> {
        let data = await this.database.query<MemberInterface[]>(`select ${MEMBER_SELECT_PROPS} from members where id = ?;`, [member_id]);

        if (data && data.length > 0) {
            return data[0];
        }

        return null;
    }

    async removeOrganizationMemberById(member_id: number, organization_id: number): Promise<MemberInterface | null> {
        let result = await this.database.query<MemberInterface>(`delete from members where id = ? and organization_id = ?;`, [member_id, organization_id]);

        if (result) {
            return result;
        }

        return null;
    }

    async getMemberByOrganizationId(user_id: number, organization_id: number): Promise<MemberInterface | null> {
        let data = await this.database.query<MemberInterface[]>(`select ${MEMBER_SELECT_PROPS} from members where user_id = ? and organization_id = ?;`, user_id, organization_id);

        if (data && data.length > 0) {
            return data[0];
        }

        return null;
    }

    async getOrganizationMembers(organization_id: number): Promise<MemberInterface[] | null> {
        let result = await this.database.query<MemberInterface[]>(`select ${MEMBER_SELECT_PROPS} from members where organization_id = ?;`, [organization_id]);

        if (result) {
            return result;
        }

        return null;
    }
}