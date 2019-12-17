import { DataListeEtab } from "./data_liste_etab";

export interface UserModel {
  id: number;
  apiToken: string;
  birthDay: string;
  email: string;
  gender: string;
  mobile: string;
  lastName: string;
  firstName: string;
  uid: string;
  etablissement_id: number;
  etablissment: Array<DataListeEtab>;
}
