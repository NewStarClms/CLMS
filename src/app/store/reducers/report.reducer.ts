import { Actions, SAVE_REPORT_SETUP } from '../actions/report.action';
import { ReportModel } from '../model/report.model';

export interface ReportState {
  reportList: ReportModel | null;
  }
export const initialSectionState: ReportState = {
    reportList: null
};

export function ReportReducer(
  state = initialSectionState.reportList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_REPORT_SETUP:
      return { ...state, reportList: action.payload};
    default:
      return state;
  }
}