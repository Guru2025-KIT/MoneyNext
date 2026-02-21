import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: any) {
    console.log('[ACCOUNTS] Creating account:', { userId, dto });
    
    try {
      const account = await this.prisma.account.create({
        data: {
          userId,
          name: dto.name,
          type: dto.type,
          balance: Number(dto.balance) || 0,
          currency: dto.currency || 'INR',
        },
      });
      
      console.log('[ACCOUNTS] Account created successfully:', account.id);
      return account;
    } catch (error) {
      console.error('[ACCOUNTS] Create error:', error);
      throw error;
    }
  }

  async findAll(userId: string) {
    return this.prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const account = await this.prisma.account.findFirst({
      where: { id, userId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  async update(userId: string, id: string, dto: any) {
    await this.findOne(userId, id);

    return this.prisma.account.update({
      where: { id },
      data: {
        name: dto.name,
        type: dto.type,
        balance: dto.balance !== undefined ? Number(dto.balance) : undefined,
        currency: dto.currency,
      },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    
    return this.prisma.account.delete({
      where: { id },
    });
  }

  async getBalance(userId: string, id: string) {
    const account = await this.findOne(userId, id);
    return { balance: account.balance };
  }
}
