import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BlacklistedToken } from './entities/blacklisted-token.entity.js';

@Injectable()
export class TokenBlacklistService {
    constructor(
        @InjectRepository(BlacklistedToken)
        private readonly repo: Repository<BlacklistedToken>,
    ) { }

    async blacklist(jti: string, expiresAt: Date): Promise<void> {
        const item = this.repo.create({
            jti,
            expiresAt,
        });
        await this.repo.save(item);
    }
    async isBlacklisted(jti: string): Promise<boolean> {
        const found = await this.repo.findOne({
            where: { jti },
        });
        return !!found;
    }
    @Cron(CronExpression.EVERY_HOUR)
    async cleanup(): Promise<void> {
        await this.repo.delete({
            expiresAt: LessThan(new Date()),
        });
    }
}