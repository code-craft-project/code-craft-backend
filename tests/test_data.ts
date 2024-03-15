export const user: UserEntity = {
    username: "test",
    first_name: "jest",
    last_name: "test",
    email: "test@jest.com",
    password: "test",
};

export const user2: UserEntity = {
    username: "user2",
    first_name: "user2",
    last_name: "test",
    email: "user2@jest.com",
    password: "user2",
};

export const userCredentials = {
    email: "test@jest.com",
    password: "test"
};

export const user2Credentials = {
    email: "user2@jest.com",
    password: "user2"
};

export const organization: OrganizationEntity = {
    name: "test",
    type: "company"
};

export const jobpost: JobPostEntity = {
    title: "Software engineer",
    description: "A software engineer that can contribute to our project",
    organization_id: 1,
    role: "Software Engineer",
    type: "full-time"
};

export const event: EventEntity = {
    title: "CodeJam",
    description: "CodeJam is a coding challenges event",
    is_public: true,
    start_at: new Date(),
    end_at: new Date(Date.now() + 1000 * 3600 * 24),
    is_team_based: true,
    max_team_members: 5,
    organization_id: 1
};

export const privateEvent: EventEntity = {
    title: "CodeJam",
    description: "CodeJam is a coding challenges event",
    is_public: false,
    password: "test",
    start_at: new Date(),
    end_at: new Date(Date.now() + 1000 * 3600 * 24),
    is_team_based: false,
    organization_id: 1
};

export const team: TeamEntity = {
    name: "Coders",
    description: "We are coders",
    is_private: false,
};

export const privateTeam: TeamEntity = {
    name: "Coders",
    description: "We are coders",
    is_private: true,
    password: "test"
};

export const challenge: ChallengeEntity = {
    title: "Two sum",
    description: "Return the indices of two numbers that the sum of them equals the target",
    topic: "web devlopment",
    level: "easy",
    is_public: true,
    type: "in_out",
};


export const privateChallenge: ChallengeEntity = {
    title: "Priave Two sum",
    description: "Priave Return the indices of two numbers that the sum of them equals the target",
    topic: "Priave web devlopment",
    level: "easy",
    is_public: false,
    type: "in_out",
};