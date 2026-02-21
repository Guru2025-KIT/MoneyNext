import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('goals')
@UseGuards(JwtAuthGuard)
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  create(@Req() req: any, @Body() dto: any) {
    return this.goalsService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.goalsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.goalsService.findOne(req.user.id, id);
  }

  @Get(':id/progress')
  getProgress(@Req() req: any, @Param('id') id: string) {
    return this.goalsService.getProgress(req.user.id, id);
  }

  @Post(':id/contribute')
  contribute(@Req() req: any, @Param('id') id: string, @Body() body: { amount: number }) {
    return this.goalsService.contribute(req.user.id, id, body.amount);
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: any) {
    return this.goalsService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.goalsService.remove(req.user.id, id);
  }
}
