import { Actions, SAVE_BUSINESS_TYPE} from '../actions/master.action';
import { BusinessTypeModel } from '../model/master-data.model';

export const businessFeatureKey = 'businessTypeList';
export interface BusinessState {
  businessTypeList: BusinessTypeModel | null;
  }
export const initialState: BusinessState = {
  businessTypeList: null
};

export function businessTypeReducer(
  state = initialState.businessTypeList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_BUSINESS_TYPE:
      // console.log('sss-', action.payload)
      return { ...state, businessTypeList: action.payload};
    default:
      return state;
  }
}
