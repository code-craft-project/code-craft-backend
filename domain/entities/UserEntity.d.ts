interface UserEntity {
    id?: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    created_at?: date;
    updated_at?: date;
    profile_image_url: string;
};