type ContractType = 'full-time' | 'part-time';
type JobType = 'remote' | 'on-site' | 'hybird';

interface JobPostEntity {
    id?: number;
    title: string;
    description: string;
    role: string;
    type: JobType;
    contractType: ContractType;
    location: string;
    organization_id: number;
    organization?: OrganizationEntity;
    created_at?: string;
};