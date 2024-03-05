import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { type AxiosResponse } from 'axios'
import { of, throwError } from 'rxjs'
import { IFineractResponse } from './interfaces/fineract-response.interface'
import { type ILoanApplication } from './interfaces/loan-application.interface'
import { IRepayment } from './interfaces/repayment.interface'
import { LoansService } from './loans.service'

vi.mock('@nestjs/axios')

const mockFineractUsername = 'fineract'
const mockFineractPassword = 'password'
const mockTenantId = 'tenant'

const basicAuthToken = Buffer.from(
  `${mockFineractUsername}:${mockFineractPassword}`,
).toString('base64')

describe('LoansService', () => {
  let service: LoansService
  let httpService: HttpService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoansService, ConfigService],
    })
      .useMocker((token) => {
        if (token === HttpService) {
          const MockHttpService = vi.mocked(HttpService)
          return new MockHttpService()
        }
      })
      .compile()

    service = module.get<LoansService>(LoansService)
    httpService = module.get<HttpService>(HttpService)
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  beforeAll(() => {
    vi.stubEnv('FINERACT_USERNAME', mockFineractUsername)
    vi.stubEnv('FINERACT_PASSWORD', mockFineractPassword)
    vi.stubEnv('FINERACT_TENANT_ID', mockTenantId)
  })

  afterAll(() => {
    vi.unstubAllEnvs()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create a new loan application', async () => {
    it('should create a new loan application', async () => {
      const loanApplication: ILoanApplication = {
        amortizationType: 1,
        clientId: 1,
        dateFormat: 'dd-MM-yyyy',
        expectedDisbursementDate: '04-03-2024',
        externalId: '786444UUUYYH7',
        interestCalculationPeriodType: 1,
        interestRatePerPeriod: 12,
        interestType: 0,
        loanTermFrequency: 3,
        locale: 'en_US',
        loanTermFrequencyType: 2,
        loanType: 'individual',
        numberOfRepayments: 3,
        principal: 1000,
        productId: 1,
        repaymentEvery: 1,
        repaymentFrequencyType: 2,
        repaymentsStartingFromDate: '04-04-2024',
        submittedOnDate: '04-03-2024',
        transactionProcessingStrategyCode: 'mifos-standard-strategy',
      }
      const url = 'https://localhost:8443/fineract-provider/api/v1/loans'

      vi.mocked(httpService.post).mockReturnValueOnce(
        of({
          status: 200,
          data: { clientId: 1, loanId: 1 },
        } as AxiosResponse),
      )

      const result = await service.createLoanApplication(loanApplication)

      expect(result.status).toBe('ok')
      expect(result.errors.length).toBe(0)

      expect(httpService.post).toHaveBeenCalledOnce()
      expect(httpService.post).toHaveBeenCalledWith(url, loanApplication, {
        headers: {
          Authorization: `Basic ${basicAuthToken}`,
          'Fineract-Platform-Tenantid': mockTenantId,
        },
      })
    })
  })

  it('should return an error message when the loan application fails', async () => {
    const badLoanApplication = {} as ILoanApplication

    const errorMessage = 'Invalid loan application'
    const statusCode = 400

    vi.mocked(httpService.post).mockReturnValueOnce(
      throwError(() => ({
        response: {
          status: statusCode,
          data: {
            httpStatusCode: statusCode,
            developerMessage: errorMessage,
            defaultUserMessage: errorMessage,
            errors: [
              {
                developerMessage: 'Loan with externalId is already registered.',
                defaultUserMessage:
                  'Loan with externalId is already registered.',
                userMessageGlobalisationCode:
                  'error.msg.loan.with.externalId.already.used',
                parameterName: 'id',
                args: [],
              },
            ],
          },
        },
      })),
    )

    let result: Error
    await service
      .createLoanApplication(badLoanApplication)
      .catch((error) => (result = error))

    expect(result).toBeInstanceOf(Error)

    const cause = result.cause as IFineractResponse

    expect(cause.status).toBe('error')
    expect(cause.errors.length).toBe(1)
    expect(cause.statusCode).toBe(statusCode)
  })

  describe('create a repayment', () => {
    it('should create a new repayment', async () => {
      const repayment: IRepayment = {
        transactionDate: '04-03-2024',
        transactionAmount: 1000,
        externalId: '',
        paymentTypeId: '',
        note: '',
        dateFormat: 'dd-MM-yyyy',
        locale: 'en',
      }

      const loanId = 1

      const url = `https://localhost:8443/fineract-provider/api/v1/loans/${loanId}/transactions?command=repayment`

      vi.mocked(httpService.post).mockReturnValueOnce(
        of({
          status: 200,
          data: { transactionId: 1 },
        } as AxiosResponse),
      )

      const result = await service.createRepayment(1, repayment)

      expect(result.status).toBe('ok')
      expect(result.errors.length).toBe(0)

      expect(httpService.post).toHaveBeenCalledOnce()
      expect(httpService.post).toHaveBeenCalledWith(url, repayment)
    })

    it('should return an error message when the repayment fails', async () => {
      const badRepayment = {} as IRepayment

      const errorMessage = 'Invalid repayment'
      const statusCode = 400

      vi.mocked(httpService.post).mockReturnValueOnce(
        throwError(() => ({
          response: {
            status: statusCode,
            data: {
              httpStatusCode: statusCode,
              developerMessage: errorMessage,
              defaultUserMessage: errorMessage,
              errors: [
                {
                  developerMessage: 'Invalid repayment',
                  defaultUserMessage: 'Invalid repayment',
                  userMessageGlobalisationCode: 'error.msg.invalid.repayment',
                  parameterName: 'id',
                  args: [],
                },
              ],
            },
          },
        })),
      )

      let result: Error
      await service
        .createRepayment(1, badRepayment)
        .catch((error) => (result = error))

      const cause = result.cause as IFineractResponse

      expect(cause.status).toBe('error')
      expect(cause.errors.length).toBe(1)
      expect(cause.statusCode).toBe(statusCode)
    })
  })
})
