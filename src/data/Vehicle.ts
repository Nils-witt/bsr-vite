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
  arrivedAt?: string;

  constructor(
    id: string,
    name: string,
    plate: string,
    typ: string,
    personnel: IPersonell,
    createdAt?: string,
    updatedAt?: string,
    arrivedAt?: string,
  ) {
    this.id = id;
    this.name = name;
    this.plate = plate;
    this.typ = typ;
    this.personnel = personnel;
    const now = new Date().toISOString();
    this.createdAt = createdAt ?? now;
    this.updatedAt = updatedAt ?? now;
    this.arrivedAt = arrivedAt;
  }
}
