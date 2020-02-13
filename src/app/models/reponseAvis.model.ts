export interface ReponseAvisModel {
  ReponseId: number;
  demandeId: number;
  doctorId: number;
  reponses: Reponse;
  doctor: string;
  motifId: number;
  demandeToCr: DemandeToCr;
}

export interface DemandeToCr {
  etabId: number;
  etabType: number;
  etabName: string;
}

export interface Reponse {
  reponseId: number;
  demandeId: number;
  doctorId: number;
  reponse: string;
  doctor: string;
}
