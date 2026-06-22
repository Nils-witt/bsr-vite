import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { Vehicle } from '../data/Vehicle';

interface ReduxVehicleState {
  vehicles: Vehicle[];
}

const initialState: ReduxVehicleState = {
  vehicles: [],
};

const vehicleSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    addVehicle(state, action: PayloadAction<Vehicle>) {
      state.vehicles.push(action.payload);
    },
    removeVehicle(state, action: PayloadAction<number>) {
      state.vehicles = state.vehicles.filter((v) => v.id !== action.payload);
    },
    updateVehicle(state, action: PayloadAction<Vehicle>) {
      const index = state.vehicles.findIndex((v) => v.id === action.payload.id);
      if (index !== -1) state.vehicles[index] = action.payload;
    },
  },
});

export const { addVehicle, removeVehicle, updateVehicle } = vehicleSlice.actions;
export default vehicleSlice.reducer;
