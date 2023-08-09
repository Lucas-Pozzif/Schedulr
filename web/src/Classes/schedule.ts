class Schedule {
  constructor() {}
}

class ScheduleDay{

}

class ScheduleTime {
  takenAt?: number; //Timestamp or undefined
  service?: string; //ServiceId or undefined (for just blocked)
  client?: string; //ClientId or undefined (if undefined the client can't unblock it)

  constructor() {}



  
}
