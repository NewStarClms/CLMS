import { Actions, SAVE_VISITOR_AREA } from '../actions/master.action';
import {  VisitorAreas } from '../model/master-data.model';

export interface VisitorAreasState {
  visitorAreasList: VisitorAreas | null;
  }
export const initialVisitorAreasState: VisitorAreasState = {
  visitorAreasList: null
};

export function VisitorAreasReducer(
  state = initialVisitorAreasState.visitorAreasList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_VISITOR_AREA:
      return { ...state, visitorAreasList: action.payload};
    default:
      return state;
  }
}
