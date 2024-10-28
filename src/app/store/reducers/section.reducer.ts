import { Actions, SAVE_SECTION} from "../actions/master.action";
import { Section } from "../model/master-data.model";

export interface SectionState {
  sectionList: Section | null;
  }
export const initialSectionState: SectionState = {
  sectionList: null
};

export function SectionReducer(
  state = initialSectionState.sectionList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_SECTION:
      return { ...state, sectionList: action.payload};
    default:
      return state;
  }
}
