import { TreatmentModel } from './treatment.model';

export interface ContreIndicListModel {
    doctorId: number;
    dossierId: number;
    typeId: number;
    contreIndications: Array<ContreIndicElmModel>;
}
export interface ContreIndicElmModel {
    name: string;
    har: any;
}
