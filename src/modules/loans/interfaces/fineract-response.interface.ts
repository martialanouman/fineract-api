export interface IFineractResponse {
  status: 'ok' | 'error'
  statusCode?: number
  errors: []
}
