import SkillsRepository from "@/infrastructure/database/repositories/SkillsRepository";
import UsersRepository from "@/infrastructure/database/repositories/UsersRepository";

export default class UsersService {
    usersRepository: UsersRepository;
    skillsRepository: SkillsRepository;

    constructor(usersRepository: UsersRepository, skillsRepository: SkillsRepository) {
        this.usersRepository = usersRepository;
        this.skillsRepository = skillsRepository;
    }

    async createUser(user: UserEntity): Promise<InsertResultInterface | null> {
        return await this.usersRepository.createUser(user);
    }

    async getUserById(id: number, include_password?: boolean): Promise<UserEntity | null> {
        return await this.usersRepository.getUserById(id, include_password);
    }

    async getUserByEmail(email: string, include_password?: boolean): Promise<UserEntity | null> {
        return await this.usersRepository.getUserByEmail(email, include_password);
    }

    async getUserByUsername(username: string, include_password?: boolean): Promise<UserEntity | null> {
        return await this.usersRepository.getUserByUsername(username, include_password);
    }

    async updateUser(user_id: number, user: UserEntity): Promise<InsertResultInterface | null> {
        return await this.usersRepository.updateUser(user_id, user);
    }

    async getUserProgress(user_id: number): Promise<UserProgress | null> {
        return await this.usersRepository.getUserProgress(user_id);
    }

    async getUserSkills(user_id: number): Promise<SkillEntity[] | null> {
        return await this.skillsRepository.getSkillsByUserId(user_id);
    }

    async createUserSkill(skill: SkillEntity): Promise<SkillEntity | null> {
        const createSkill = await this.skillsRepository.createSkill(skill);
        if (createSkill) {
            return await this.skillsRepository.getSkillById(createSkill.insertId);
        }

        return null;
    }

    async deleteSkillById(skill_id: number): Promise<InsertResultInterface | null> {
        return await this.skillsRepository.deleteSkill(skill_id);
    }
};