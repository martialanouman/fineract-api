import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import https from 'https'
import { lastValueFrom } from 'rxjs'
import { type IFineractResponse } from './interfaces/fineract-response.interface'
import { type ILoanApplication } from './interfaces/loan-application.interface'
import { type IRepayment } from './interfaces/repayment.interface'

@Injectable()
export class LoansService {
  private baseURL = 'https://localhost:8443/fineract-provider/api/v1'
  private basicAuthToken: string
  private fineractTenantId: string

  constructor(
    private httpService: HttpService,
    private config: ConfigService,
  ) {
    this.httpService.axiosRef.defaults.httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    })
  }

  private getHeaders() {
    this.basicAuthToken = Buffer.from(
      `${this.config.get('FINERACT_USERNAME')}:${this.config.get(
        'FINERACT_PASSWORD',
      )}`,
    ).toString('base64')

    this.fineractTenantId = this.config.get('FINERACT_TENANT_ID')

    return {
      Authorization: `Basic ${this.basicAuthToken}`,
      'Fineract-Platform-Tenantid': this.fineractTenantId,
    }
  }

  async createLoanApplication(
    application: ILoanApplication,
  ): Promise<IFineractResponse> {
    try {
      await lastValueFrom(
        this.httpService.post(`${this.baseURL}/loans`, application, {
          headers: this.getHeaders(),
        }),
      )

      return { status: 'ok', error: null }
    } catch (error) {
      throw new Error(error.response.data.developerMessage, {
        cause: {
          status: 'error',
          error: error.response.data,
          statusCode: error.response.data.httpStatusCode,
        },
      })
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
          {
            headers: this.getHeaders(),
          },
        ),
      )

      return { status: 'ok', error: null }
    } catch (error) {
      throw new Error(error.response.data.developerMessage, {
        cause: {
          status: 'error',
          error: error.response.data,
          statusCode: error.response.data.httpStatusCode,
        },
      })
    }
  }
}
