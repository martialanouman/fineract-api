import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { LoansController } from './loans.controller'
import { LoansService } from './loans.service'

@Module({
  providers: [LoansService],
  controllers: [LoansController],
  imports: [HttpModule],
})
export class LoansModule {}
