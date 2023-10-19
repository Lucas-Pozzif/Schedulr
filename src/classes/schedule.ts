
export interface ScheduleItem {
    client: string;
    service: string;
}

export interface Schedule {
    [date: string]: {
        [number: number]: ScheduleItem;
    };
}