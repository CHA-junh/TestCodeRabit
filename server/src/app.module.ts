import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MenuModule } from './menu/menu.module';
import { DatabaseModule } from './database/database.module';
import { SysModule } from './sys/sys.module';
import { UsrModule } from './usr/usr.module';
import { ComModule } from './com/com.module';
import { CommonModule } from './common/common.module';
import { PsmModule } from './psm/psm.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env'],
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    MenuModule,
    SysModule,
    UsrModule,
    ComModule,
    CommonModule,
    PsmModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}


