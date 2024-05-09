interface UserEntity {
    id?: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    bio: string;
    created_at?: date;
    updated_at?: date;
    profile_image_url?: string;
};

interface UserProgress {
    correct_easy_submissions: number;
    total_easy_submissions: number;
    correct_medium_submissions: number;
    total_medium_submissions: number;
    correct_hard_submissions: number;
    total_hard_submissions: number;
    total_correct_submissions: number;
    total_submissions: number;
};