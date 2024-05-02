import UsersRepository from "@/infrastructure/database/repositories/UsersRepository";

export default class UsersService {
    usersRepository: UsersRepository;

    constructor(usersRepository: UsersRepository) {
        this.usersRepository = usersRepository;
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
};