import { UserModel } from "./user.model";

// ----------- RESPONSE MODEL-------------------
export interface AuthResponseData {
  code: number;
  message: string;
  data: UserModel;
}
