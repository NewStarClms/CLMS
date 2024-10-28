import { Actions, SAVE_DISPENSARY } from '../actions/master.action';
import {  Dispensary } from '../model/master-data.model';

export interface DispensaryState {
  dispensaryList: Dispensary | null;
  }
export const initialDispensaryState: DispensaryState = {
  dispensaryList: null
};

export function DispensaryReducer(
  state = initialDispensaryState.dispensaryList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_DISPENSARY:
      return { ...state, dispensaryList: action.payload};
    default:
      return state;
  }
}
