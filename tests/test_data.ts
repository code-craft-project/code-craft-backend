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
    id: 1,
    name: "Google",
    description: `Google, founded in 1998 by Larry Page and Sergey Brin while they were Ph.D. students at Stanford University, has evolved into one of the world's most influential technology companies. Renowned for its innovative approach to internet-based services and products, Google has fundamentally transformed the way people interact with information and technology.`,
    creator_id: 1,
    type: 'company',
    profile_image_url: "https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA",
    created_at: "2004-09-04"
};

export const jobpost: JobPostEntity = {
    title: "Software engineer",
    description: "A software engineer that can contribute to our project",
    organization_id: 1,
    role: "Software Engineer",
    type: "on-site",
    contractType: 'full-time',
    location: 'Medea Algeria',
};

export const event: EventEntity = {
    title: "CodeJam",
    description: "CodeJam is a coding challenges event",
    is_public: true,
    start_at: new Date(),
    end_at: new Date(Date.now() + 1000 * 3600 * 24),
    is_team_based: true,
    max_team_members: 5,
    organization_id: 1,
    logo_url: 'https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210125191729/Google%E2%80%99s-Coding-Competitions-You-Can-Consider-in-2021.png'
};

export const privateEvent: EventEntity = {
    title: "CodeJam",
    description: "CodeJam is a coding challenges event",
    is_public: false,
    password: "test",
    start_at: new Date(),
    end_at: new Date(Date.now() + 1000 * 3600 * 24),
    is_team_based: false,
    organization_id: 1,
    logo_url: 'https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210125191729/Google%E2%80%99s-Coding-Competitions-You-Can-Consider-in-2021.png'
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

export const testCases: TestCaseEntity[] = [
    { challenge_id: 1, inputs: [], output: '' },
    { challenge_id: 1, inputs: [], output: '' },
];

export const eventChallengesIds: number[] = [];
export const organizationChallengesIds: number[] = [];
export const publicChallengesIds: number[] = [];
export const query = 'search';