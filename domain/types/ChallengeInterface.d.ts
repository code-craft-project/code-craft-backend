interface ChallengeInterface {
    id: number;
    name: string;
    topic: string;
    level: string;
    is_public: boolean; // if it private that mean it related to event.
    type: "in_out" | "project";
    creator_id: number;
};