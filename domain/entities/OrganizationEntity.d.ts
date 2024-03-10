interface OrganizationEntity {
    id?: number;
    name: string;
    creator_id: number;
    type: 'club' | 'company';
    profile_image_url: string;
    created_at?: string;
    updated_at?: string;
};