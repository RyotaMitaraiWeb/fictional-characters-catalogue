import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { ClaimsModule } from './common/modules/claims/claims.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, ClaimsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
