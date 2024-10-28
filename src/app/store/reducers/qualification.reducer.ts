import { Actions, SAVE_QUALIFICATION} from "../actions/master.action";
import { Qualification } from "../model/master-data.model";

export interface QualificationState {
  qualificationList: Qualification | null;
  }
export const initialQualificationState: QualificationState = {
  qualificationList: null
};

export function QualificationReducer(
  state = initialQualificationState.qualificationList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_QUALIFICATION:
      return { ...state, qualificationList: action.payload};
    default:
      return state;
  }
}
