interface EventEntity {
    id?: number;
    title: string;
    description: string;
    is_public: boolean;
    password: string; // Or Maybe with links
    logo_url: string;
    start_at: timestamp;
    end_at: timestamp;
    organization_id: number;
};