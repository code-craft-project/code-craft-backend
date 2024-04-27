import { MEMBER_CREATE_PROPS, MEMBER_SELECT_PROPS, MembersRepositoryInterface } from "@/domain/repositories/MembersRepositoryInterface";
import { MySQLDatabase } from "../MySQLDatabase";
import { USER_JOIN_PROPS } from "@/domain/repositories/UsersRepositoryInterface";

export default class MembersRepository implements MembersRepositoryInterface {
    database: MySQLDatabase;
    constructor(database: MySQLDatabase) {
        this.database = database;
    }

    async createMember(member: MemberEntity): Promise<InsertResultInterface | null> {
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

    async getMemberById(member_id: number): Promise<MemberEntity | null> {
        let data = await this.database.query<MemberEntity[]>(`select ${MEMBER_SELECT_PROPS}, JSON_OBJECT(${USER_JOIN_PROPS}) AS user from members join users on users.id = members.user_id where id = ?;`, [member_id]);

        if (data && data.length > 0) {
            return data[0];
        }

        return null;
    }

    async removeOrganizationMemberById(member_id: number, organization_id: number): Promise<MemberEntity | null> {
        let result = await this.database.query<MemberEntity>(`delete from members where id = ? and organization_id = ?;`, [member_id, organization_id]);

        if (result) {
            return result;
        }

        return null;
    }

    async getMemberByOrganizationId(user_id: number, organization_id: number): Promise<MemberEntity | null> {
        let data = await this.database.query<MemberEntity[]>(`select ${MEMBER_SELECT_PROPS} , JSON_OBJECT(${USER_JOIN_PROPS}) AS user from members join users on users.id = members.user_id where user_id = ? and organization_id = ?;`, user_id, organization_id);

        if (data && data.length > 0) {
            return data[0];
        }

        return null;
    }

    async getOrganizationMembers(organization_id: number): Promise<MemberEntity[] | null> {
        let result = await this.database.query<MemberEntity[]>(`select ${MEMBER_SELECT_PROPS}, JSON_OBJECT(${USER_JOIN_PROPS}) AS user from members join users on users.id = members.user_id where organization_id = ?;`, [organization_id]);

        if (result) {
            return result;
        }

        return null;
    }

    async getOrganizationLatestMembers(organization_id: number): Promise<MemberEntity[] | null> {
        let result = await this.database.query<MemberEntity[]>(`select ${MEMBER_SELECT_PROPS}, JSON_OBJECT(${USER_JOIN_PROPS}) AS user from members join users on users.id = members.user_id where organization_id = ? order by members.created_at desc limit 3;`, [organization_id]);

        if (result) {
            return result;
        }

        return null;
    }
}