interface TeamEntity {
    id?: number;
    name: string;
    description: string;
    is_private: boolean;
    password?: string;
    leader_id?: number;
    event_id?: number;
};