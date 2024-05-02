interface ChallengeEntity {
    id?: number;
    title: string;
    description: string;
    topic: string;
    level: string;
    is_public: boolean;
    type: "in_out" | "project";
    creator_id?: number;
    comments?: number;
    submissions?: number;
};

type ChallengeTopic = 'all topics' | 'problem solving' | 'algorithms' | 'data structures' | 'databases';