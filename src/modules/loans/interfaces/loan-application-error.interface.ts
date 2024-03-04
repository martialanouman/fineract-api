export interface IErrorDetail {
  developerMessage: string
  defaultUserMessage: string
  userMessageGlobalisationCode: string
  parameterName: string
  args: any[]
}

export interface ILoanApplicationError {
  developerMessage: string
  httpStatusCode: string
  defaultUserMessage: string
  userMessageGlobalisationCode: string
  errors: IErrorDetail[]
}
