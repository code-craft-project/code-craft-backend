import UserSessionsRepository from "@/infrastructure/database/repositories/UserSessionsRepository";

export default class UserSessionsService {
    userSessionsRepository: UserSessionsRepository;

    constructor(userSessionsRepository: UserSessionsRepository) {
        this.userSessionsRepository = userSessionsRepository;
    }

    async createUserSession(userSession: UserSessionEntity): Promise<InsertResultInterface | null> {
        return await this.userSessionsRepository.createUserSession(userSession);
    }

    async deleteUserSessionByAccessToken(accessToken: string): Promise<InsertResultInterface | null> {
        return await this.userSessionsRepository.deleteUserSessionByAccessToken(accessToken);
    }

    async getUserSessionByAccessToken(accessToken: string): Promise<UserSessionEntity | null> {
        return await this.userSessionsRepository.getUserSessionByAccessToken(accessToken);
    }
};