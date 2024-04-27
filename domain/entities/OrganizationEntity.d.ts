interface OrganizationEntity {
    id?: number;
    name: string;
    description: string;
    creator_id?: number;
    type: 'club' | 'company';
    profile_image_url?: string;
    created_at?: string;
    updated_at?: string;
};

interface OrganizationDashboardStats {
    latest_events: EventEntity[];
    latest_challenges: ChallengeEntity[];
    latest_members: MemberEntity[];
    total_members: number;
    total_events: number;
    total_challenges: number;
    total_participants: number;
};

interface OrganizationStats {
    total_members: number;
    total_events: number;
    total_challenges: number;
    total_participants: number;
};