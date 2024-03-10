import UsersRepository from "@/infrastructure/database/repositories/UsersRepository";

export default class UsersService {
    usersRepository: UsersRepository;

    constructor(usersRepository: UsersRepository) {
        this.usersRepository = usersRepository;
    }

    async createUser(user: UserEntity): Promise<InsertResultInterface | null> {
        return await this.usersRepository.createUser(user);
    }

    async getUserById(id: number): Promise<UserEntity | null> {
        return await this.usersRepository.getUserById(id);
    }

    async getUserByEmail(email: string): Promise<UserEntity | null> {
        return await this.usersRepository.getUserByEmail(email);
    }

    async getUserByUsername(username: string): Promise<UserEntity | null> {
        return await this.usersRepository.getUserByUsername(username);
    }
};