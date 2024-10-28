import { Actions, SAVE_GATE } from '../actions/master.action';
import {  Gate } from '../model/master-data.model';

export interface GateState {
  gateList: Gate | null;
  }
export const initialGateState: GateState = {
  gateList: null
};

export function GateReducer(
  state = initialGateState.gateList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_GATE:
      return { ...state, gateList: action.payload};
    default:
      return state;
  }
}
