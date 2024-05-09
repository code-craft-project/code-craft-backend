import { SKILL_CREATE_PROPS, SKILL_SELECT_PROPS, SkillsRepositoryInterface } from "@/domain/repositories/SkillsRepositoryInterface";
import { MySQLDatabase } from "../MySQLDatabase";

export default class SkillsRepository implements SkillsRepositoryInterface {
    database: MySQLDatabase;
    constructor(database: MySQLDatabase) {
        this.database = database;
    }

    async createSkill(skill: SkillEntity): Promise<InsertResultInterface | null> {
        const result = await this.database.query<InsertResultInterface>(
            `insert into skills (${SKILL_CREATE_PROPS}) values (?);`,
            [
                skill.name,
                skill.user_id
            ]
        );
        if (result) {
            return result;
        }

        return null;
    }

    async deleteSkill(skill_id: number): Promise<InsertResultInterface | null> {
        let result = await this.database.query<InsertResultInterface>(`delete from skills where id = ?;`, skill_id);

        if (result) {
            return result;
        }

        return null;
    }

    async getSkillsByUserId(user_id: number): Promise<SkillEntity[] | null> {
        let data = await this.database.query<SkillEntity[]>(`select ${SKILL_SELECT_PROPS} from skills where skills.user_id = ?`, [user_id]);

        if (data) {
            return data;
        }

        return null;
    }

    async getSkillById(skill_id: number): Promise<SkillEntity | null> {
        let skills = await this.database.query<SkillEntity[]>(`select ${SKILL_SELECT_PROPS} from skills where id = ?;`, skill_id);
        if (!skills || skills?.length == 0) {
            return null;
        }

        return skills[0];
    }
}