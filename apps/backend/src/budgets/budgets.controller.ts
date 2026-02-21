import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('budgets')
@UseGuards(JwtAuthGuard)
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  create(@Req() req: any, @Body() dto: any) {
    return this.budgetsService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.budgetsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.budgetsService.findOne(req.user.id, id);
  }

  @Get(':id/progress')
  getProgress(@Req() req: any, @Param('id') id: string) {
    return this.budgetsService.getProgress(req.user.id, id);
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: any) {
    return this.budgetsService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.budgetsService.remove(req.user.id, id);
  }
}
