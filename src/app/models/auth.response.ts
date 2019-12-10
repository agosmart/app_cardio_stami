import { UserModel } from "./user.model";

// ----------- RESPONSE MODEL-------------------
export interface AuthResponseData {
  code: number;
  data: UserModel;
  message: string;
}
