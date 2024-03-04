export interface ILoanApplicationResponse {
  status: 'ok' | 'error'
  statusCode?: number
  errors: []
}
