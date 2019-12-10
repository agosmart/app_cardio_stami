import { DataListeEtab } from "./data_liste_etab";

export interface UserModel {
  id: number;
  api_token: string;
  date_naissance: string;
  email: string;
  gender: string;
  mobile: string;
  nom: string;
  prenom: string;
  uid: string;
  etablissement_id: number;
  etablissment: Array<DataListeEtab>;
}
