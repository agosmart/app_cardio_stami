import { ReponseAvisModel } from "./reponseAvis.model";
// ----------- RESPONSE MODEL-------------------
export interface ReponseAvisResponseData {
  code: number;
  message: string;
  data: ReponseAvisModel;
}
