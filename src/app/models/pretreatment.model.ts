import { TreatmentModel } from './treatment.model';

export interface PretreatmentModel {
    bolus: number;
    stepId: number;
    dossierId: number;
    doctorId: number;
    treatments: Array<TreatmentModel>;
  }