import UserSessionsRepository from "@/infrastructure/database/repositories/UserSessionsRepository";

export default class UserSessionsService {
    userSessionsRepository: UserSessionsRepository;

    constructor(userSessionsRepository: UserSessionsRepository) {
        this.userSessionsRepository = userSessionsRepository;
    }

    async createUserSession(userSession: UserSessionEntity): Promise<InsertResultInterface | null> {
        return await this.userSessionsRepository.createUserSession(userSession);
    }
};