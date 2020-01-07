import { ArchiveModel } from "./archive.model";

// ----------- RESPONSE MODEL-------------------
export interface ArchiveResponseData {
  code: number;
  message: string;
  data: ArchiveModel;
}
