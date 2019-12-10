import { DataListeEtab } from './data_liste_etab';
export interface StandarReturnModel {
    code: number;
    idUser: number;
    paysId: number;
    nomPays: string;
    items: DataListeEtab;

}
