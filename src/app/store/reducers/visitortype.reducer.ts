import { Actions, SAVE_VISITOR_TYPE} from '../actions/master.action';
import {  VisitorType } from '../model/master-data.model';

export interface VisitorTypeState {
  visitorTypeList: VisitorType | null;
  }
export const initialVisitorTypeState: VisitorTypeState = {
  visitorTypeList: null
};

export function VisitorTypeReducer(
  state = initialVisitorTypeState.visitorTypeList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_VISITOR_TYPE:
      return { ...state, visitorTypeList: action.payload};
    default:
      return state;
  }
}
