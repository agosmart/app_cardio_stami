import { PatientModel } from "./patient_model";
// ----------- RESPONSE MODEL-------------------
export interface PatientResponseData {
  code: number;
  message: string;
  data: Array<PatientModel>;
}
