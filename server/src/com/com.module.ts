import { Module } from '@nestjs/common';
import { ProcedureDbParser } from '../utils/procedure-db-parser.util';
// import { DatabaseModule } from '../database/database.module'; // 제거

// COM 관련 컨트롤러들
import { COMZ080P00Controller } from './COMZ080P00.controller';
import { COMZ100P00Controller } from './COMZ100P00.controller';
import { CodeController } from './code.controller';
import { COMZ010M00Controller } from './COMZ010M00.controller';
import { COMZ020M00Controller } from './COMZ020M00.controller';
import { COMZ030P00Controller } from './COMZ030P00.controller';
import { COMZ040P00Controller } from './COMZ040P00.controller';
import { COMZ050P00Controller } from './COMZ050P00.controller';
import { COMZ060P00Controller } from './COMZ060P00.controller';

// COM 관련 서비스들
import { COMZ080P00Service } from './COMZ080P00.service';
import { COMZ100P00Service } from './COMZ100P00.service';
import { CodeService } from './code.service';
import { COMZ010M00Service } from './COMZ010M00.service';
import { COMZ020M00Service } from './COMZ020M00.service';
import { COMZ030P00Service } from './COMZ030P00.service';
import { COMZ040P00Service } from './COMZ040P00.service';
import { COMZ050P00Service } from './COMZ050P00.service';
import { COMZ060P00Service } from './COMZ060P00.service';

/**
 * COM 모듈
 *
 * @description
 * - COM 관련 모든 컨트롤러와 서비스를 관리하는 모듈
 * - 사업관리, 사용자관리, 코드관리, 단가관리 등 COM 기능들을 포함
 * - 화면별 컨트롤러/서비스: COMZ010M00, COMZ020M00, COMZ030P00, COMZ040P00, COMZ050P00, COMZ060P00
 * - 공통 기능: Employee, Users, UnitPrice, Code
 *
 * @controllers
 * - COMZ080P00Controller: 직원 관리
 * - COMZ100P00Controller: 사용자 관리
 * - CodeController: 코드 관리
 * - COMZ010M00Controller: 시스템코드관리
 * - COMZ020M00Controller: 단가 관리
 * - COMZ030P00Controller: 단가 검색
 * - COMZ040P00Controller: 사업번호검색
 * - COMZ050P00Controller: 사업명검색
 * - COMZ060P00Controller: 부서번호검색
 *
 * @providers
 * - COMZ080P00Service: 직원 관련 비즈니스 로직
 * - COMZ100P00Service: 사용자 관련 비즈니스 로직
 * - CodeService: 코드 관련 비즈니스 로직
 * - COMZ010M00Service: 시스템코드관리 비즈니스 로직
 * - COMZ020M00Service: 단가 관리 비즈니스 로직
 * - COMZ030P00Service: 단가 검색 비즈니스 로직
 * - COMZ040P00Service: 사업번호검색 비즈니스 로직
 * - COMZ050P00Service: 사업명검색 비즈니스 로직
 * - COMZ060P00Service: 부서번호검색 비즈니스 로직
 */
@Module({
  imports: [
    // DatabaseModule, // 제거
    // ... 기존 imports 유지
  ],
  controllers: [
    COMZ080P00Controller,
    COMZ100P00Controller,
    CodeController,
    COMZ010M00Controller,
    COMZ020M00Controller,
    COMZ030P00Controller,
    COMZ040P00Controller,
    COMZ050P00Controller,
    COMZ060P00Controller,
  ],
  providers: [
    ProcedureDbParser,
    COMZ080P00Service,
    COMZ100P00Service,
    CodeService,
    COMZ010M00Service,
    COMZ020M00Service,
    COMZ030P00Service,
    COMZ040P00Service,
    COMZ050P00Service,
    COMZ060P00Service,
  ],
  exports: [
    COMZ080P00Service,
    COMZ100P00Service,
    CodeService,
    COMZ010M00Service,
    COMZ020M00Service,
    COMZ030P00Service,
    COMZ040P00Service,
    COMZ050P00Service,
    COMZ060P00Service,
  ],
})
export class ComModule {}
