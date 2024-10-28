import { Action } from '@ngrx/store';
import { ReportModel } from '../model/report.model';

export const SAVE_REPORT_SETUP = '[SL_UI] SAVE REPORT SETUP';
export const SAVE_REPORT_ENTITIES = '[SL_UI] SAVE REPORT ENTITIES';
export const SAVE_REPORT_TYPE = '[SL_UI] SAVE_REPORT_TYPE';

//start Report
export class SaveReportSetupAction implements Action {
    readonly type = SAVE_REPORT_SETUP;
    constructor(public payload: ReportModel) { }
}

export class fetchReportTypeAction implements Action {
    readonly type = SAVE_REPORT_TYPE;
    constructor(public payload: ReportModel) { }
}

export type Actions = SaveReportSetupAction | fetchReportTypeAction