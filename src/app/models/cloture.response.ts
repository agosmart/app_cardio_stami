import { ClotureModel } from "./cloture.model";

// ----------- RESPONSE MODEL-------------------
export interface ClotureResponseData {
  code: number;
  message: string;
  data: ClotureModel;
}
