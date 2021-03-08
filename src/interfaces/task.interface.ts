export interface ITask {
    id: number;
    action: string;
    state: string;
    updated_at?: Date;
    created_at?: Date;
    update_timestamp?: string;
    create_timestamp?: string;
    data: any;
}