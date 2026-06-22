export interface IPersonell {
  sum: number;
  fuehrer: number;
  unterfuehrer: number;
  helfer: number;
}

export type VehicleState = 'preregistered' | 'arrived' | 'registered' | 'assigned' | 'dispatched';

export class Vehicle {
  id: number;
  name: string;
  plate: string;
  typ: string;
  personnel: IPersonell;

  state: VehicleState = 'preregistered';

  constructor(id: number, name: string, plate: string, typ: string, personnel: IPersonell) {
    this.id = id;
    this.name = name;
    this.plate = plate;
    this.typ = typ;
    this.personnel = personnel;
  }
}
