import Logger from "@/infrastructure/logger/Logger";
import { MySQLDatabase } from "../MySQLDatabase";
import UsersTableMigration from "./UsersTableMigration";
import MembersTableMigration from "./MembersTableMigration";
import ChallengesTableMigration from "./ChallengesTableMigration";
import EventsTableMigration from "./EventsTableMigration";
import ChallengeCommentsTableMigration from "./ChallengeCommentsTableMigration";
import CommentLikesTableMigration from "./CommentLikesTableMigration";
import EventParticipantsTableMigration from "./EventParticipantsTableMigration";
import JobPostsTableMigration from "./JobPostsTableMigration";
import JobApplicationsTableMigration from "./JobApplicationsTableMigration";
import SubmissionsTableMigration from "./SubmissionsTableMigration";
import SubmissionFilesTableMigration from "./SubmissionFilesTableMigration";
import ReviewsTableMigration from "./ReviewsTableMigration";
import PermissionsTableMigration from "./PermissionsTableMigration";
import NotificationsTableMigration from "./NotificationsTableMigration";
import TeamsTableMigration from "./TeamsTableMigration";
import TeamMembersTableMigration from "./TeamMembersTableMigration";
import UserSessionsTableMigration from "./UserSessionsTableMigration";
import OrganizationsTableMigration from "./OrganizationsTableMigration";
import EventChallengesTableMigration from "./EventChallengesTableMigration";
import TestCasesTableMigration from "./TestCasesTableMigration";
import TestCaseInputsTableMigration from "./TestCaseInputsTableMigration";
import OrganizationChallengesTableMigration from "./OrganizationChallengesTableMigration";

export class DatabaseMigration {
    private database: MySQLDatabase;
    private logger: Logger;
    constructor(database: MySQLDatabase, logger: Logger) {
        this.database = database;
        this.logger = logger;
    }

    async migrateAll() {
        try {
            let users_table = new UsersTableMigration(this.database, this.logger);

            let user_sessions_table = new UserSessionsTableMigration(this.database, this.logger);
            let organizations_table = new OrganizationsTableMigration(this.database, this.logger);
            let challenges_table = new ChallengesTableMigration(this.database, this.logger);
            let notifications_table = new NotificationsTableMigration(this.database, this.logger);

            let members_table = new MembersTableMigration(this.database, this.logger);
            let events_table = new EventsTableMigration(this.database, this.logger);
            let job_posts_table = new JobPostsTableMigration(this.database, this.logger);
            let organization_challenges_table = new OrganizationChallengesTableMigration(this.database, this.logger);
            let challenge_comments_table = new ChallengeCommentsTableMigration(this.database, this.logger);
            let test_cases_table = new TestCasesTableMigration(this.database, this.logger);
            let submissions_table = new SubmissionsTableMigration(this.database, this.logger);

            let event_participants_table = new EventParticipantsTableMigration(this.database, this.logger);
            let event_challenges_table = new EventChallengesTableMigration(this.database, this.logger);
            let permissions_table = new PermissionsTableMigration(this.database, this.logger);
            let job_applications_table = new JobApplicationsTableMigration(this.database, this.logger);
            let comment_likes_table = new CommentLikesTableMigration(this.database, this.logger);
            let test_case_inputs_table = new TestCaseInputsTableMigration(this.database, this.logger);
            let reviews_table = new ReviewsTableMigration(this.database, this.logger);
            let submission_files_table = new SubmissionFilesTableMigration(this.database, this.logger);

            let teams_table = new TeamsTableMigration(this.database, this.logger);

            let team_members_table = new TeamMembersTableMigration(this.database, this.logger);

            // Level 01
            await Promise.all([
                users_table.migrate(),
            ]);

            // Level 02
            await Promise.all([
                user_sessions_table.migrate(),
                organizations_table.migrate(),
                challenges_table.migrate(),
                notifications_table.migrate(),
            ]);

            // Level 03
            await Promise.all([
                members_table.migrate(),
                events_table.migrate(),
                job_posts_table.migrate(),
                organization_challenges_table.migrate(),
                challenge_comments_table.migrate(),
                test_cases_table.migrate(),
                submissions_table.migrate(),
            ]);

            // Level 04
            await Promise.all([
                event_participants_table.migrate(),
                event_challenges_table.migrate(),
                permissions_table.migrate(),
                job_applications_table.migrate(),
                comment_likes_table.migrate(),
                test_case_inputs_table.migrate(),
                reviews_table.migrate(),
                submission_files_table.migrate(),
            ]);

            // Level 05
            await Promise.all([
                teams_table.migrate(),
            ]);

            // Level 06
            await Promise.all([
                team_members_table.migrate(),
            ]);
        } catch (err) {
            this.logger.error("Something went wrong");
            console.error(err);
        }
    }

    async dropAll() {
        try {
            let users_table = new UsersTableMigration(this.database, this.logger);

            let user_sessions_table = new UserSessionsTableMigration(this.database, this.logger);
            let organizations_table = new OrganizationsTableMigration(this.database, this.logger);
            let challenges_table = new ChallengesTableMigration(this.database, this.logger);
            let notifications_table = new NotificationsTableMigration(this.database, this.logger);

            let members_table = new MembersTableMigration(this.database, this.logger);
            let events_table = new EventsTableMigration(this.database, this.logger);
            let job_posts_table = new JobPostsTableMigration(this.database, this.logger);
            let organization_challenges_table = new OrganizationChallengesTableMigration(this.database, this.logger);
            let challenge_comments_table = new ChallengeCommentsTableMigration(this.database, this.logger);
            let test_cases_table = new TestCasesTableMigration(this.database, this.logger);
            let submissions_table = new SubmissionsTableMigration(this.database, this.logger);

            let event_participants_table = new EventParticipantsTableMigration(this.database, this.logger);
            let event_challenges_table = new EventChallengesTableMigration(this.database, this.logger);
            let permissions_table = new PermissionsTableMigration(this.database, this.logger);
            let job_applications_table = new JobApplicationsTableMigration(this.database, this.logger);
            let comment_likes_table = new CommentLikesTableMigration(this.database, this.logger);
            let test_case_inputs_table = new TestCaseInputsTableMigration(this.database, this.logger);
            let reviews_table = new ReviewsTableMigration(this.database, this.logger);
            let submission_files_table = new SubmissionFilesTableMigration(this.database, this.logger);

            let teams_table = new TeamsTableMigration(this.database, this.logger);

            let team_members_table = new TeamMembersTableMigration(this.database, this.logger);

            // Level 06
            await Promise.all([
                team_members_table.drop(),
            ]);

            // Level 05
            await Promise.all([
                teams_table.drop(),
            ]);

            // Level 04
            await Promise.all([
                event_participants_table.drop(),
                event_challenges_table.drop(),
                permissions_table.drop(),
                job_applications_table.drop(),
                comment_likes_table.drop(),
                test_case_inputs_table.drop(),
                reviews_table.drop(),
                submission_files_table.drop(),
            ]);

            // Level 03
            await Promise.all([
                members_table.drop(),
                events_table.drop(),
                job_posts_table.drop(),
                organization_challenges_table.drop(),
                challenge_comments_table.drop(),
                test_cases_table.drop(),
                submissions_table.drop(),
            ]);

            // Level 02
            await Promise.all([
                user_sessions_table.drop(),
                organizations_table.drop(),
                challenges_table.drop(),
                notifications_table.drop(),
            ]);

            // Level 01
            await Promise.all([
                users_table.drop(),
            ]);
        } catch (err) {
            this.logger.error("Something went wrong");
            console.error(err);
        }
    }
}