export interface DossierModel {
  // id_dossier: number;
  // id_etablissement: number;
  // id_patient: number;
  // id_medecin: number;
  // douleur_thoracique: string;
  // nom_patient: string;
  // prenom_patient: string;
  // gender_patient: number;
  // qrcode_patient: string;
  // naissance_patient: string;
  // poids: number;
  // ecg: string;
  // start_at: string;
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
}
