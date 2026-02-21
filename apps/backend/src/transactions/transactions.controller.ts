import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Req() req: any, @Body() dto: any) {
    return this.transactionsService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.transactionsService.findAll(req.user.id);
  }

  @Get('stats')
  getStats(@Req() req: any) {
    return this.transactionsService.getStats(req.user.id);
  }

  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.transactionsService.findOne(req.user.id, id);
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: any) {
    return this.transactionsService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.transactionsService.remove(req.user.id, id);
  }
}
