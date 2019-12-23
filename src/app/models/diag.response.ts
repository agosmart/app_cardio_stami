import { DiagModel } from "./diag.model";

// ----------- RESPONSE MODEL-------------------
export interface DiagResponseData {
  code: number;
  message: string;
  data: DiagModel;
}
