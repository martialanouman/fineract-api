import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { lastValueFrom } from 'rxjs'
import { IFineractResponse } from './interfaces/fineract-response.interface'
import { ILoanApplication } from './interfaces/loan-application.interface'
import { IRepayment } from './interfaces/repayment.interface'

@Injectable()
export class LoansService {
  private baseURL = 'https://localhost:8443/fineract-provider/api/v1'

  constructor(private httpService: HttpService) {}

  async createLoanApplication(
    application: ILoanApplication,
  ): Promise<IFineractResponse> {
    try {
      await lastValueFrom(
        this.httpService.post(`${this.baseURL}/loans`, application),
      )

      return { status: 'ok', errors: [] }
    } catch (error) {
      return {
        status: 'error',
        errors: error.response.data.errors,
        statusCode: error.response.data.httpStatusCode,
      }
    }
  }

  async createRepayment(
    loanId: number,
    repayment: IRepayment,
  ): Promise<IFineractResponse> {
    try {
      await lastValueFrom(
        this.httpService.post(
          `${this.baseURL}/loans/${loanId}/transactions?command=repayment`,
          repayment,
        ),
      )

      return { status: 'ok', errors: [] }
    } catch (error) {
      return {
        status: 'error',
        errors: error.response.data.errors,
        statusCode: error.response.data.httpStatusCode,
      }
    }
  }
}
