import { ListeMedByCRModel } from "./listeMedByCr.model";

// ----------- RESPONSE MODEL-------------------
export interface ListeMedByCRResponseData {
  code: number;
  message: string;
  data: ListeMedByCRModel;
}
