import Logger from "@/infrastructure/logger/Logger";
import { MySQLDatabase } from "../MySQLDatabase";
import UsersTableMigration from "./UsersTableMigration";
import MembersTableMigration from "./MembersTableMigration";
import ClubsTableMigration from "./ClubsTableMigration";
import ClubMembersTableMigration from "./ClubMembersTableMigration";
import ChallengesTableMigration from "./ChallengesTableMigration";
import CompaniesTableMigration from "./CompaniesTableMigration";
import CompanyMembersTableMigration from "./CompanyMembersTableMigration";
import EventsTableMigration from "./EventsTableMigration";
import ClubEventsTableMigration from "./ClubEventsTableMigration";
import CompanyEventsTableMigration from "./CompanyEventsTableMigration";
import ChallengeCommentsTableMigration from "./ChallengeCommentsTableMigration";
import CommentLikesTableMigration from "./CommentLikesTableMigration";
import EventParticipantsTableMigration from "./EventParticipantsTableMigration";
import JobPostsTableMigration from "./JobPostsTableMigration";
import JobApplicationsTableMigration from "./JobApplicationsTableMigration";
import SubmittionsTableMigration from "./SubmittionsTableMigration";
import SubmittionFilesTableMigration from "./SubmittionFilesTableMigration";
import ReviewsTableMigration from "./ReviewsTableMigration";
import PermissionsTableMigration from "./PermissionsTableMigration";
import CompanyPermissionsTableMigration from "./CompanyPermissionsTableMigration";
import ClubPermissionsTableMigration from "./ClubPermissionsTableMigration";
import NotificationsTableMigration from "./NotificationsTableMigration";
import TeamsTableMigration from "./TeamsTableMigration";
import TeamMembersTableMigration from "./TeamMembersTableMigration";
import UserSessionsTableMigration from "./UserSessionsTableMigration";

export class DatabaseMigration {
    private database: MySQLDatabase;
    private logger: Logger;
    constructor(database: MySQLDatabase, logger: Logger) {
        this.database = database;
        this.logger = logger;
    }

    async migrateAll() {
        let users_table = new UsersTableMigration(this.database, this.logger);
        let events_table = new EventsTableMigration(this.database, this.logger);

        let clubs_table = new ClubsTableMigration(this.database, this.logger);
        let companies_table = new CompaniesTableMigration(this.database, this.logger);
        let members_table = new MembersTableMigration(this.database, this.logger);
        let challenges_table = new ChallengesTableMigration(this.database, this.logger);
        let event_participants_table = new EventParticipantsTableMigration(this.database, this.logger);
        let notifications_table = new NotificationsTableMigration(this.database, this.logger);
        let user_sessions_table = new UserSessionsTableMigration(this.database, this.logger);

        let club_members_table = new ClubMembersTableMigration(this.database, this.logger);
        let company_members_table = new CompanyMembersTableMigration(this.database, this.logger);
        let club_events_table = new ClubEventsTableMigration(this.database, this.logger);
        let company_events_table = new CompanyEventsTableMigration(this.database, this.logger);
        let challenge_comments_table = new ChallengeCommentsTableMigration(this.database, this.logger);
        let job_posts_table = new JobPostsTableMigration(this.database, this.logger);
        let submittions_table = new SubmittionsTableMigration(this.database, this.logger);
        let permissions_table = new PermissionsTableMigration(this.database, this.logger);
        let teams_table = new TeamsTableMigration(this.database, this.logger);

        let comment_likes_table = new CommentLikesTableMigration(this.database, this.logger);
        let job_applications_table = new JobApplicationsTableMigration(this.database, this.logger);
        let submittion_files_table = new SubmittionFilesTableMigration(this.database, this.logger);
        let reviews_table = new ReviewsTableMigration(this.database, this.logger);
        let company_permissions_table = new CompanyPermissionsTableMigration(this.database, this.logger);
        let club_permissions_table = new ClubPermissionsTableMigration(this.database, this.logger);
        let team_members_table = new TeamMembersTableMigration(this.database, this.logger);

        // Level 01
        await Promise.all([
            users_table.migrate(),
            events_table.migrate(),
        ]);

        // Level 02
        await Promise.all([
            clubs_table.migrate(),
            members_table.migrate(),
            challenges_table.migrate(),
            companies_table.migrate(),
            event_participants_table.migrate(),
            notifications_table.migrate(),
            user_sessions_table.migrate(),
        ]);

        // Level 03
        await Promise.all([
            club_members_table.migrate(),
            company_members_table.migrate(),
            club_events_table.migrate(),
            company_events_table.migrate(),
            challenge_comments_table.migrate(),
            job_posts_table.migrate(),
            submittions_table.migrate(),
            permissions_table.migrate(),
            teams_table.migrate(),
        ]);

        // Level 04
        await Promise.all([
            comment_likes_table.migrate(),
            job_applications_table.migrate(),
            submittion_files_table.migrate(),
            reviews_table.migrate(),
            company_permissions_table.migrate(),
            club_permissions_table.migrate(),
            team_members_table.migrate(),
        ]);
    }

    async dropAll() {
        let users_table = new UsersTableMigration(this.database, this.logger);
        let events_table = new EventsTableMigration(this.database, this.logger);

        let clubs_table = new ClubsTableMigration(this.database, this.logger);
        let companies_table = new CompaniesTableMigration(this.database, this.logger);
        let members_table = new MembersTableMigration(this.database, this.logger);
        let challenges_table = new ChallengesTableMigration(this.database, this.logger);
        let event_participants_table = new EventParticipantsTableMigration(this.database, this.logger);
        let notifications_table = new NotificationsTableMigration(this.database, this.logger);
        let user_sessions_table = new UserSessionsTableMigration(this.database, this.logger);

        let club_members_table = new ClubMembersTableMigration(this.database, this.logger);
        let company_members_table = new CompanyMembersTableMigration(this.database, this.logger);
        let club_events_table = new ClubEventsTableMigration(this.database, this.logger);
        let company_events_table = new CompanyEventsTableMigration(this.database, this.logger);
        let challenge_comments_table = new ChallengeCommentsTableMigration(this.database, this.logger);
        let job_posts_table = new JobPostsTableMigration(this.database, this.logger);
        let submittions_table = new SubmittionsTableMigration(this.database, this.logger);
        let permissions_table = new PermissionsTableMigration(this.database, this.logger);
        let teams_table = new TeamsTableMigration(this.database, this.logger);

        let comment_likes_table = new CommentLikesTableMigration(this.database, this.logger);
        let job_applications_table = new JobApplicationsTableMigration(this.database, this.logger);
        let submittion_files_table = new SubmittionFilesTableMigration(this.database, this.logger);
        let reviews_table = new ReviewsTableMigration(this.database, this.logger);
        let company_permissions_table = new CompanyPermissionsTableMigration(this.database, this.logger);
        let club_permissions_table = new ClubPermissionsTableMigration(this.database, this.logger);
        let team_members_table = new TeamMembersTableMigration(this.database, this.logger);

        // Level 04
        await Promise.all([
            comment_likes_table.drop(),
            job_applications_table.drop(),
            submittion_files_table.drop(),
            reviews_table.drop(),
            company_permissions_table.drop(),
            club_permissions_table.drop(),
            team_members_table.drop(),
        ]);
        
        // Level 03
        await Promise.all([
            club_members_table.drop(),
            company_members_table.drop(),
            club_events_table.drop(),
            company_events_table.drop(),
            challenge_comments_table.drop(),
            job_posts_table.drop(),
            submittions_table.drop(),
            permissions_table.drop(),
            teams_table.drop(),
        ]);

        // Level 02
        await Promise.all([
            clubs_table.drop(),
            members_table.drop(),
            challenges_table.drop(),
            companies_table.drop(),
            event_participants_table.drop(),
            notifications_table.drop(),
            user_sessions_table.drop(),
        ]);

        // Level 01
        await Promise.all([
            users_table.drop(),
            events_table.drop(),
        ]);
    }
}