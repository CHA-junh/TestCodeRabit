export interface UserInfoDto {
  userId: string;
  userName?: string;
  deptCd?: string;
  deptNm?: string;
  dutyCd?: string;
  dutyNm?: string;
  dutyDivCd?: string;
  authCd?: string;
  emailAddr?: string;
  usrRoleId?: string;
  needsPasswordChange?: boolean;
  deptDivCd?: string;
  hqDivCd?: string;
  hqDivNm?: string;
  deptTp?: string;
}

export class LoginResponseDto {
  success: boolean;
  message: string;
  user?: UserInfoDto;
  token?: string;
}
