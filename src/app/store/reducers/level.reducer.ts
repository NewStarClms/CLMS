import { Actions, SAVE_LEVEL } from '../actions/master.action';
import {  Level } from '../model/master-data.model';

export interface LevelState {
  levelList: Level | null;
  }
export const initialLevelState: LevelState = {
  levelList: null
};

export function levelReducer(
  state = initialLevelState.levelList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_LEVEL:
      return { ...state, levelList: action.payload};
    default:
      return state;
  }
}
