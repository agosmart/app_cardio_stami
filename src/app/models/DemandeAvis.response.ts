import { DemandeAvisModel } from "./demandeAvis.model";
export interface DemandeAvisResponseData {
  code: number;
  message: string;
  data: DemandeAvisModel;
}
