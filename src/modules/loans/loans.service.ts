import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { lastValueFrom } from 'rxjs'
import { ILoanApplicationResponse } from './interfaces/loan-application-response.interface'
import { ILoanApplication } from './interfaces/loan-application.interface'

@Injectable()
export class LoansService {
  private baseURL = 'https://localhost:8443/fineract-provider/api/v1'

  constructor(private httpService: HttpService) {}

  async createLoanApplication(
    application: ILoanApplication,
  ): Promise<ILoanApplicationResponse> {
    try {
      await lastValueFrom(
        this.httpService.post<ILoanApplicationResponse>(
          `${this.baseURL}/loans`,
          application,
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
