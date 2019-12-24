import { DiagModel } from "./diag.model";

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
  diagnostic: DiagModel;
}
