import { Body, Controller, HttpCode, Param, Post } from '@nestjs/common'
import { LoanApplicationDto } from './dto/loan-application.dto'
import { RepaymentDto } from './dto/repayment.dto'
import { LoansService } from './loans.service'

@Controller('loans')
export class LoansController {
  constructor(private service: LoansService) {}

  @Post('/')
  @HttpCode(201)
  createLoanApplication(@Body() data: LoanApplicationDto) {
    return this.service
      .createLoanApplication(data)
      .catch((error) => error.cause)
  }

  @Post('/:loanId/repayments')
  @HttpCode(201)
  createRepayment(@Param('loanId') loanId: number, @Body() data: RepaymentDto) {
    return this.service
      .createRepayment(loanId, data)
      .catch((error) => error.cause)
  }
}
