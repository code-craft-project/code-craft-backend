import { USER_JOIN_PROPS } from "@/domain/repositories/UsersRepositoryInterface";
import { MySQLDatabase } from "../MySQLDatabase";
import { CLUB_CREATE_PROPS, CLUB_SELECT_PROPS, ClubsRepositoryInterface } from "@/domain/repositories/ClubsRepositoryInterface";

export default class ClubsRepository implements ClubsRepositoryInterface {
    database: MySQLDatabase;
    constructor(database: MySQLDatabase) {
        this.database = database;
    }

    async createClub(club: ClubInterface): Promise<ClubInterface | null> {
        const result = await this.database.query<ClubInterface>(
            `insert into clubs (${CLUB_CREATE_PROPS}) values (?);`,
            [
                club.name,
                club.leader_id,
                club.profile_image_url,
            ]
        );
        if (result) {
            return result;
        }

        return null;
    }

    async getClubById(id: number): Promise<ClubInterface | null> {
        let data = await this.database.query<ClubInterface[]>(`select ${CLUB_SELECT_PROPS}, JSON_OBJECT(${USER_JOIN_PROPS}) AS owner from clubs join users on leader_id = users.id where clubs.id = ?;`, [id]);

        if (data && data.length > 0) {
            return data[0];
        }

        return null;
    }

    async getClubByName(name: string): Promise<ClubInterface | null> {
        let data = await this.database.query<ClubInterface[]>(`select ${CLUB_SELECT_PROPS}, JSON_OBJECT(${USER_JOIN_PROPS}) AS owner from clubs join users on leader_id = users.id where name = ?;`, [name]);

        if (data && data.length > 0) {
            return data[0];
        }

        return null;
    }

    async getClubsByPage(page: number = 0, limits: number = 10): Promise<ClubInterface[] | null> {
        let data = await this.database.query<ClubInterface[]>(`select ${CLUB_SELECT_PROPS}, JSON_OBJECT(${USER_JOIN_PROPS}) AS owner from clubs join users on leader_id = users.id limit ?;`, [page, limits]);
        if (!data) {
            return null;
        }

        return data;
    }
}