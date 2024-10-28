import { Actions, SAVE_GRADE } from '../actions/master.action';
import {  Grade } from '../model/master-data.model';

export interface GradeState {
  gradeList: Grade | null;
  }
export const initialGradeState: GradeState = {
  gradeList: null
};

export function gradeReducer(
  state = initialGradeState.gradeList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_GRADE:
      return { ...state, gradeList: action.payload};
    default:
      return state;
  }
}
