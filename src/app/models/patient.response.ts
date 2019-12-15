import { PatientModel } from "./patient.model";
// ----------- RESPONSE MODEL-------------------
export interface PatientResponseData {
  code: number;
  message: string;
  data: Array<PatientModel>;
}
