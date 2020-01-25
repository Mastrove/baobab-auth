import { UserInstance } from "db/models/user";
import { OrganizationInstance } from "db/models/organization";

export interface SignUp {
  email: string;
  organization: string;
  password: string;
}


export interface SignUpSuccess {
  user: UserInstance;
  organization: OrganizationInstance;
}