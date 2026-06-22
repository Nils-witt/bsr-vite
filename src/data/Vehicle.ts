export interface IPersonell {
  sum: number;
  fuehrer: number;
  unterfuehrer: number;
  helfer: number;
}

export type VehicleState = 'preregistered' | 'arrived' | 'registered' | 'assigned' | 'dispatched';

export class Vehicle {
  id: string;
  name: string;
  plate: string;
  typ: string;
  personnel: IPersonell;
  state: VehicleState = 'preregistered';
  createdAt: string;
  updatedAt: string;
  preregisteredAt: string;
  arrivedAt?: string;
  assignedAt?: string;
  dispatchedAt?: string;

  constructor(
    id: string,
    name: string,
    plate: string,
    typ: string,
    personnel: IPersonell,
    createdAt?: string,
    updatedAt?: string,
    arrivedAt?: string,
    assignedAt?: string,
    dispatchedAt?: string,
  ) {
    this.id = id;
    this.name = name;
    this.plate = plate;
    this.typ = typ;
    this.personnel = personnel;
    const now = new Date().toISOString();
    this.createdAt = createdAt ?? now;
    this.updatedAt = updatedAt ?? now;
    this.preregisteredAt = now;
    this.arrivedAt = arrivedAt;
    this.assignedAt = assignedAt;
    this.dispatchedAt = dispatchedAt;
  }
}
