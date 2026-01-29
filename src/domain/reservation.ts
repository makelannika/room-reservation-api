export type ISODateString = string;

export interface Reservation {
  id: string;
  roomId: string;
  userId: string;
  startTime: ISODateString;
  endTime: ISODateString;
}
