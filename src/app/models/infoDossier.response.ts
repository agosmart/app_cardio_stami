import { InfoDossierModel } from "./infoDossier.model";

// ----------- RESPONSE MODEL-------------------
export interface InfoDossierResponseData {
  code: number;
  message: string;
  data: InfoDossierModel;
}
