import { DetailArchiveModel } from "./detail.archive.model";

export interface ArchiveModel {
  patientId: number;
  inscription: string;
  lastName: string;
  firstName: string;
  birthDayFr: string;
  birthDay: string;
  age: number;
  gender: number;
  qrCode: string;
  dossiers: Array<DetailArchiveModel>;
}
