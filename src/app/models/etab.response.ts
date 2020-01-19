import { EtabModel } from "./etab.model";

// ----------- RESPONSE MODEL-------------------
export interface EtabResponseData {
  code: number;
  message: string;
  data: Array<EtabModel>;
}
