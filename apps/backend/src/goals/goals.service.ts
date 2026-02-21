import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GoalsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: any) {
    return this.prisma.goal.create({
      data: {
        userId,
        name: dto.name,
        targetAmount: dto.targetAmount,
        currentAmount: dto.currentAmount || 0,
        deadline: new Date(dto.deadline),
        category: dto.category,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.goal.findMany({
      where: { userId },
      orderBy: { deadline: 'asc' },
    });
  }

  async findOne(userId: string, id: string) {
    const goal = await this.prisma.goal.findFirst({
      where: { id, userId },
    });

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    return goal;
  }

  async update(userId: string, id: string, dto: any) {
    await this.findOne(userId, id);

    return this.prisma.goal.update({
      where: { id },
      data: {
        name: dto.name,
        targetAmount: dto.targetAmount,
        currentAmount: dto.currentAmount,
        deadline: dto.deadline ? new Date(dto.deadline) : undefined,
        category: dto.category,
      },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    
    return this.prisma.goal.delete({
      where: { id },
    });
  }

  async contribute(userId: string, id: string, amount: number) {
    const goal = await this.findOne(userId, id);

    return this.prisma.goal.update({
      where: { id },
      data: {
        currentAmount: Number(goal.currentAmount) + amount,
      },
    });
  }

  async getProgress(userId: string, id: string) {
    const goal = await this.findOne(userId, id);
    
    const progress = (Number(goal.currentAmount) / Number(goal.targetAmount)) * 100;
    const remaining = Number(goal.targetAmount) - Number(goal.currentAmount);

    return {
      goal,
      progress: Math.min(progress, 100),
      remaining: Math.max(remaining, 0),
    };
  }
}
