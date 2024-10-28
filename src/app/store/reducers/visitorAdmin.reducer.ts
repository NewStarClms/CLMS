import { Actions, SAVE_VISITOR_ADMIN } from '../actions/visitorAdmin.action';
import {  VisitorAdmin } from '../model/visitorAdmin.model';

export interface VisitorAdminState {
  visitorAdminList: VisitorAdmin | null;
  }
export const initialVisitorAdminState: VisitorAdminState = {
  visitorAdminList: null
};

export function VisitorAdminReducer(
  state = initialVisitorAdminState.visitorAdminList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_VISITOR_ADMIN:
      return { ...state, visitorAdminList: action.payload};
    default:
      return state;
  }
}
