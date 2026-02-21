import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BudgetsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: any) {
    return this.prisma.budget.create({
      data: {
        userId,
        name: dto.name,
        amount: dto.amount,
        spent: dto.spent || 0,
        period: dto.period,
        category: dto.category,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.budget.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const budget = await this.prisma.budget.findFirst({
      where: { id, userId },
    });

    if (!budget) {
      throw new NotFoundException('Budget not found');
    }

    return budget;
  }

  async update(userId: string, id: string, dto: any) {
    await this.findOne(userId, id);

    return this.prisma.budget.update({
      where: { id },
      data: {
        name: dto.name,
        amount: dto.amount,
        spent: dto.spent,
        period: dto.period,
        category: dto.category,
      },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    
    return this.prisma.budget.delete({
      where: { id },
    });
  }

  async getProgress(userId: string, id: string) {
    const budget = await this.findOne(userId, id);
    
    const percentage = (Number(budget.spent) / Number(budget.amount)) * 100;
    const remaining = Number(budget.amount) - Number(budget.spent);

    return {
      budget,
      percentage: Math.min(percentage, 100),
      remaining: Math.max(remaining, 0),
      isOverBudget: percentage > 100,
    };
  }
}
