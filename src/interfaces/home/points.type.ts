export interface IResponsePostPoints {
  points: string;
}
export interface IResponseGetPoints {
  ok: boolean;
  total: number;
  points: Point[];
}

export interface Point {
  status: boolean;
  // points: number;
  totalPoints: number;
  user: UserPoint;
  createdAt: Date;
  updatedAt: Date;
  _id: string;
  // uid: string;
}
export interface UserPoint {
  // _id: string;
  name: string;
}
