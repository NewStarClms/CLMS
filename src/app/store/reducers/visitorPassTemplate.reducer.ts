import { Actions, SAVE_VISITOR_PASS_TEMPLATE } from '../actions/master.action';
import {  VisitorPassTemplate } from '../model/master-data.model';

export interface VisitorPassTemplateState {
  visitorPassTemplateList: VisitorPassTemplate | null;
  }
export const initialVisitorPassTemplateState: VisitorPassTemplateState = {
  visitorPassTemplateList: null
};

export function visitorPassTemplateReducer(
  state = initialVisitorPassTemplateState.visitorPassTemplateList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_VISITOR_PASS_TEMPLATE:
      return { ...state, visitorPassTemplateList: action.payload};
    default:
      return state;
  }
}
