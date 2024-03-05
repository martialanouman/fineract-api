import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  Param,
  Post,
} from '@nestjs/common'
import { LoanApplicationDto } from './dto/loan-application.dto'
import { RepaymentDto } from './dto/repayment.dto'
import { LoansService } from './loans.service'

@Controller('loans')
export class LoansController {
  constructor(private service: LoansService) {}

  @Post('/')
  @HttpCode(201)
  async createLoanApplication(@Body() data: LoanApplicationDto) {
    try {
      return await this.service.createLoanApplication(data)
    } catch (e) {
      throw new HttpException(e.cause.error, +e.cause.error.httpStatusCode, {
        cause: e,
      })
    }
  }

  @Post('/:loanId/repayments')
  @HttpCode(201)
  async createRepayment(
    @Param('loanId') loanId: number,
    @Body() data: RepaymentDto,
  ) {
    try {
      return await this.service.createRepayment(loanId, data)
    } catch (e) {
      throw new HttpException(e.cause.error, +e.cause.error.httpStatusCode, {
        cause: e,
      })
    }
  }
}
