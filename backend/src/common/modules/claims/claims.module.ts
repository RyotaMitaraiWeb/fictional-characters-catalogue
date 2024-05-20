import { Module } from '@nestjs/common';
import { ClaimsService } from './claims.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [ClaimsService],
  imports: [JwtModule, ConfigModule],
  exports: [ClaimsService],
})
export class ClaimsModule {}
