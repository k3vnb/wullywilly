export interface IShapeBase {
  x: number;
  y: number;
  p: p5;
}

export interface IDoodleShape extends IShapeBase {
  groupId: string;
}
