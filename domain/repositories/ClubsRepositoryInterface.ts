export const CLUB_SELECT_PROPS: string = 'clubs.id as id, clubs.name as name, clubs.leader_id as leader_id, clubs.profile_image_url as profile_image_url, clubs.updated_at as updated_at, clubs.created_at as created_at';
export const CLUB_CREATE_PROPS: string = 'name, leader_id, profile_image_url';

export interface ClubsRepositoryInterface {
    createClub(user: ClubInterface): Promise<ClubInterface | null>;
    getClubById(id: number): Promise<ClubInterface | null>;
    getClubByName(name: string): Promise<ClubInterface | null>;
    getClubsByPage(page: number, limits: number): Promise<ClubInterface[] | null>;
};