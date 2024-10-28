import { Actions, GET_SHIFT_DATA, GET_SHIFT_MAPPED_DATA } from '../actions/master.action';
import { ShiftMaster, ShiftMappingModel } from '../model/master-data.model';

export interface ShiftState {
  shiftList: ShiftMaster | null;
  }
export const initialShiftState: ShiftState = {
    shiftList: null
};

export interface ShiftMappedState {
  shiftMapingList: ShiftMappingModel | null;
  }
export const initialShiftMappingState: ShiftMappedState = {
  shiftMapingList: null
};

export function ShiftMasterReducer(
  state = initialShiftState.shiftList,
  action: Actions
) {
  switch (action.type) {
    case GET_SHIFT_DATA:
      return { ...state, shiftList: action.payload};
    case GET_SHIFT_MAPPED_DATA:
      return { ...state, shiftMapping: action.payload}
    default:
      return state;
  }
}

export function ShiftMappedReducer(
  state = initialShiftMappingState.shiftMapingList,
  action: Actions
) {
  switch (action.type) {
    case GET_SHIFT_MAPPED_DATA:
      return { ...state, shiftMapping: action.payload}
    default:
      return state;
  }
}
