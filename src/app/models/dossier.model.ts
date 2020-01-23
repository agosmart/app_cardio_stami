import { EcgData } from "./ecg.data.model";
export interface DossierModel {
  dossierId: number;
  etabId: number;
  etabName: string;
  patientId: number;
  doctorId: number;
  dThorasic: string;
  lastName: string;
  firstName: string;
  birthDay: string;
  birthDayFr: string;
  age: number;
  gender: number;
  qrCode: string;
  weight: number;
  ecgImage: string;
  ecgAfficher?: string;
  startAt: string;
  statusDossier: number;
  stepId: number;

  // info dossier
  page: string;
  diagnostic: string;
  diabetes?: number;
  hta?: number;
  tobacco?: number;
  dyslip?: string;
  insCardiaque?: number;
  cardIscStable?: number;
  sca?: string;
  daignoDate?: string;
  angioCoran?: string;
  atlDate?: string;

  LastDemandeAvisId?: number;
  lastMotifId?: number;
  resultId?: number;
  resultName?: string;
  demandeAvisId?: number;
  demandes?: Array<DemandeAvisModel>;
  ecgData?: Array<EcgData>;
  idCr?: number;
  lastCrName?: string;
  // etabName?: string;
  // motifName?: number;
}

export interface DemandeAvisModel {
  demandeId: number;
  motifId: number;
  motifName: string;
  reponses: Array<ResponseAvisModel>;
}

export interface ResponseAvisModel {
  reponseId: number;
  demandeId: number;
  doctorId: number;
  reponse: string;
  doctor: string;
}

/*
import { DiagModel } from './diag.model';
//import { EcgModel } from "./ecg.model";

export interface DossierModel {
  dossierId: number;
  etabId: number;
  patientId: number;
  doctorId: number;
  dThorasic: string;
  weight: number;
  ecgImage: string;
  ecgAfficher: string;
  startAt: string;
  // info dossier
  diabetes: number;
  hta: number;
  tobacco: number;
  dyslip: string;
  insCardiaque: number;
  cardIscStable: number;
  sca: string;
  daignoDate: string;
  angioCoran: string;
  atlDate: string;
  stapeId: number;
  page: string;
  demandeAvisId: number;
  resultId?: number;
  resultName?: string;
  stepId?: number;
  idCr?: number;
  diagnostic: DiagModel;
}
*/
