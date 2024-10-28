import { Actions, SAVE_CATEGORY } from "../actions/master.action";
import { Category, CategoryModel } from "../model/master-data.model";

export interface CategoryState {
  categoryList: CategoryModel | null;
  }
export const initialCategoryState: CategoryState = {
  categoryList: null
};

export function categoryReducer(
  state = initialCategoryState.categoryList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_CATEGORY:
      return { ...state, categoryList: action.payload};
    default:
      return state;
  }
}
