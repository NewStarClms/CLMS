import { Actions, SAVE_NATUREOFWORK } from '../actions/master.action';
import {  NatureOfWork } from '../model/master-data.model';

export interface NatureofworkState {
  natureofworkList: NatureOfWork | null;
  }
export const initialNatureofworkState: NatureofworkState = {
  natureofworkList: null
};

export function natureofworkReducer(
  state = initialNatureofworkState.natureofworkList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_NATUREOFWORK:
      return { ...state, natureofworkList: action.payload};
    default:
      return state;
  }
}
