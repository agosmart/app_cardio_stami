import { TreatmentModel } from "./treatment.model";

export interface PretreatmentModel {
  bolus?: number;
  stepId: number;
  dossierId: number;
  doctorId: number;
  resultId?: number;
  crId?: number;
  treatments: Array<TreatmentModel>;
}
