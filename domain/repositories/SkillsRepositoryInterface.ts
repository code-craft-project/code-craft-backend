export const SKILL_SELECT_PROPS: string = 'skills.id as id, skills.name as name, skills.created_at as created_at';
export const SKILL_CREATE_PROPS: string = 'name, user_id';

export interface SkillsRepositoryInterface {
    createSkill(skill: SkillEntity): Promise<InsertResultInterface | null>;
    deleteSkill(skill_id: number): Promise<InsertResultInterface | null>;
    getSkillsByUserId(user_id: number): Promise<SkillEntity[] | null>;
    getSkillById(skill_id: number): Promise<SkillEntity | null>;
};