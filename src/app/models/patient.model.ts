export interface PatientModel {
  patientId: number;
  lastName: string;
  firstName: string;
  gender: number;
  birthDay: string;
  qrCode?: string;
}
