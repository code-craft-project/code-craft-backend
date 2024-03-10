import ChallengesRepository from "@/infrastructure/database/repositories/ChallengesRepository";

export default class ChallengesService {
    challengesRepository: ChallengesRepository;

    constructor(challengesRepository: ChallengesRepository) {
        this.challengesRepository = challengesRepository;
    }

    async createChallenge(challenge: ChallengeEntity): Promise<InsertResultInterface | null> {
        return await this.challengesRepository.createChallenge(challenge);
    }

    async getChallengeById(id: number): Promise<ChallengeEntity | null> {
        return await this.challengesRepository.getChallengeById(id);
    }

    async getChallengesByPage(page?: number, limits?: number): Promise<ChallengeEntity[] | null> {
        return await this.challengesRepository.getChallengesByPage(page, limits);
    }
};