import { MySQLDatabase } from "../MySQLDatabase";
import { ORGANIZATION_CHALLENGE_CREATE_PROPS, OrganizationChallengesRepositoryInterface } from "@/domain/repositories/OrganizationChallengesRepositoryInterface";

export default class OrganizationChallengesRepository implements OrganizationChallengesRepositoryInterface {
    database: MySQLDatabase;
    constructor(database: MySQLDatabase) {
        this.database = database;
    }

    async createOrganizationChallenge(organizationChallenge: OrganizationChallengeEntity): Promise<InsertResultInterface | null> {
        let result = await this.database.query<InsertResultInterface>(`insert into organization_challenges (${ORGANIZATION_CHALLENGE_CREATE_PROPS}) values (?);`, [
            organizationChallenge.organization_id,
            organizationChallenge.challenge_id,
        ]);

        if (result) {
            return result;
        }

        return null;
    }

    async removeOrganizationChallenge(organizationChallenge: OrganizationChallengeEntity): Promise<InsertResultInterface | null> {
        let result = await this.database.query<InsertResultInterface>(`delete from organization_challenges where organization_id = ? and challenge_id = ?;`, organizationChallenge.organization_id, organizationChallenge.challenge_id);

        if (result) {
            return result;
        }

        return null;
    }
}