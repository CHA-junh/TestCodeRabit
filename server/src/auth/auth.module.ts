import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { MenuModule } from '../menu/menu.module';

@Module({
  imports: [UserModule, MenuModule],
  controllers: [AuthController],
})
export class AuthModule {}


