import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  create(@Req() req: any, @Body() dto: any) {
    return this.accountsService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.accountsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.accountsService.findOne(req.user.id, id);
  }

  @Get(':id/balance')
  getBalance(@Req() req: any, @Param('id') id: string) {
    return this.accountsService.getBalance(req.user.id, id);
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: any) {
    return this.accountsService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.accountsService.remove(req.user.id, id);
  }
}
