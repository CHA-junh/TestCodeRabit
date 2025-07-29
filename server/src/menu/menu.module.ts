import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuController } from './menu.controller';
import { MenuEntity } from './entities/menu.entity';
import { MenuService } from './menu.service';
import { ProgramEntity } from '../entities/program.entity';
import { ProgramService } from '../entities/program.service';

@Module({
  imports: [TypeOrmModule.forFeature([MenuEntity, ProgramEntity])],
  controllers: [MenuController],
  providers: [MenuService, ProgramService],
  exports: [MenuService, ProgramService],
})
export class MenuModule {}


