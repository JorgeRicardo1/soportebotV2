export interface TokenRole {
  token: string;
  role: RoleAccess;
  infoUser: InfoUser;
}

export interface RoleAccess {
  roleAccessId?: number;
  roleAccess: string;
  functionalAreaId?: number;
  functionalArea?: string;
}

export interface InfoUser {
  fullname: string;
}

export interface PayloadRole {
  thirdPartyId: number;
  roleAccess: number;
  functionalAreaId: number;
}

export interface DataAccess {
  role: RoleAccess;
  infoUser: InfoUser;
}
