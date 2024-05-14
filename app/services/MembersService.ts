import MembersRepository from "@/infrastructure/database/repositories/MembersRepository";

export default class MembersService {
    membersRepository: MembersRepository;

    constructor(membersRepository: MembersRepository) {
        this.membersRepository = membersRepository;
    }

    async createMember(member: MemberEntity): Promise<InsertResultInterface | null> {
        return await this.membersRepository.createMember(member);
    }

    async getMemberById(id: number): Promise<MemberEntity | null> {
        return await this.membersRepository.getMemberById(id);
    }

    async getMemberByUserId(user_id: number): Promise<MemberEntity | null> {
        return await this.membersRepository.getMemberByUserId(user_id);
    }

    async getOrganizationMembers(organization_id: number): Promise<MemberEntity[] | null> {
        return await this.membersRepository.getOrganizationMembers(organization_id);
    }

    async getMemberByOrganizationId(user_id: number, organization_id: number): Promise<MemberEntity | null> {
        return await this.membersRepository.getMemberByOrganizationId(user_id, organization_id);
    }

    async removeOrganizationMemberById(member_id: number, organization_id: number): Promise<MemberEntity | null> {
        return await this.membersRepository.removeOrganizationMemberById(member_id, organization_id);
    }

    async isAdmin(user_id: number, organization_id: number): Promise<boolean> {
        const member = await this.membersRepository.getMemberByOrganizationId(user_id, organization_id);
        if (!member) {
            return false;
        }

        if (member.role != "admin") {
            return false;
        }

        return true;
    }

    async isChallengesManager(user_id: number, organization_id: number): Promise<boolean> {
        const member = await this.membersRepository.getMemberByOrganizationId(user_id, organization_id);
        if (!member) {
            return false;
        }

        if (member.role != "admin" && member.role != "challenges_manager") {
            return false;
        }

        return true;
    }

    async isEventsManager(user_id: number, organization_id: number): Promise<boolean> {
        const member = await this.membersRepository.getMemberByOrganizationId(user_id, organization_id);
        if (!member) {
            return false;
        }

        if (member.role != "admin" && member.role != "events_manager") {
            return false;
        }

        return true;
    }

    async isJobPostsManager(user_id: number, organization_id: number): Promise<boolean> {
        const member = await this.membersRepository.getMemberByOrganizationId(user_id, organization_id);
        if (!member) {
            return false;
        }

        if (member.role != "admin" && member.role != "job_posts_manager") {
            return false;
        }

        return true;
    }

    async updateMember(member_id: number, member: MemberEntity): Promise<InsertResultInterface | null> {
        return await this.membersRepository.updateMember(member_id, { role: member.role });
    }
};