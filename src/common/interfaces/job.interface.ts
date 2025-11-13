export interface IEmailJob {
  email: string;
}

export interface IVerifyEmailJob extends IEmailJob {
  token: string;
}

export interface IForgotPasswordJob extends IEmailJob {
  token: string;
}
