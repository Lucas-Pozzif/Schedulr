export interface ScheduleItem {
  client: string;
  service: string;
  edited?: boolean;
}

export interface Schedule {
  [date: string]: {
    [number: number]: ScheduleItem;
  };
}

export interface ScheduleItemW {
  client: string;
  service: string;
  professional: string;
  messageSent: boolean;
  contact: string;
}

export interface ScheduleW {
  [date: string]: {
    [contact: string]: ScheduleItemW;
  };
}
