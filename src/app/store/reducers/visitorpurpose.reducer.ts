import { Actions, SAVE_VISITOR_PURPOSE} from '../actions/master.action';
import {  VisitPurpose } from '../model/master-data.model';

export interface VisitorPurposeState {
  visitorPurposeList: VisitPurpose | null;
  }
export const initialVisitorPurposeState: VisitorPurposeState = {
  visitorPurposeList: null
};

export function VisitorPurposeReducer(
  state = initialVisitorPurposeState.visitorPurposeList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_VISITOR_PURPOSE:
      return { ...state, visitorPurposeList: action.payload};
    default:
      return state;
  }
}
