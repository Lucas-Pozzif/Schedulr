
export interface ScheduleItem {
    client: string;
    service: string;
    edited?: boolean
}

export interface Schedule {
    [date: string]: {
        [number: number]: ScheduleItem;
    };
}