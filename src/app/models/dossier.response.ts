import { DossierModel } from "./dossier.model";

// ----------- RESPONSE MODEL-------------------
export interface DossierResponseData {
  code: number;
  message: string;
  data: Array<DossierModel>;
}
