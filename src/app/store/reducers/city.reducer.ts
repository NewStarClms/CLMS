import { Actions, SAVE_CITY } from '../actions/master.action';
import {  City } from '../model/master-data.model';

export interface CityState {
  cityList: City | null;
  }
export const initialCityState: CityState = {
  cityList: null
};

export function CityReducer(
  state = initialCityState.cityList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_CITY:
      return { ...state, cityList: action.payload};
    default:
      return state;
  }
}
