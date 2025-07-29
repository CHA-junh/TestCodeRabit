import { Module } from '@nestjs/common';
import { ProcedureDbParser } from '../utils/procedure-db-parser.util';
// import { DatabaseModule } from '../database/database.module'; // ?�거

// COM 관??컨트롤러??
import { COMZ080P00Controller } from './COMZ080P00.controller';
import { COMZ100P00Controller } from './COMZ100P00.controller';
import { CodeController } from './code.controller';
import { COMZ010M00Controller } from './COMZ010M00.controller';
import { COMZ020M00Controller } from './COMZ020M00.controller';
import { COMZ030P00Controller } from './COMZ030P00.controller';
import { COMZ040P00Controller } from './COMZ040P00.controller';
import { COMZ050P00Controller } from './COMZ050P00.controller';
import { COMZ060P00Controller } from './COMZ060P00.controller';

// COM 관???�비?�들
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
 * - COM 관??모든 컨트롤러?� ?�비?��? 관리하??모듈
 * - ?�업관�? ?�용?��?�? 코드관�? ?��?관�???COM 기능?�을 ?�함
 * - ?�면�?컨트롤러/?�비?? COMZ010M00, COMZ020M00, COMZ030P00, COMZ040P00, COMZ050P00, COMZ060P00
 * - 공통 기능: Employee, Users, UnitPrice, Code
 *
 * @controllers
 * - COMZ080P00Controller: 직원 관�?
 * - COMZ100P00Controller: ?�용??관�?
 * - CodeController: 코드 관�?
 * - COMZ010M00Controller: ?�스?�코?��?�?
 * - COMZ020M00Controller: ?��? 관�?
 * - COMZ030P00Controller: ?��? 검??
 * - COMZ040P00Controller: ?�업번호검??
 * - COMZ050P00Controller: ?�업명�???
 * - COMZ060P00Controller: 부?�번?��???
 *
 * @providers
 * - COMZ080P00Service: 직원 관??비즈?�스 로직
 * - COMZ100P00Service: ?�용??관??비즈?�스 로직
 * - CodeService: 코드 관??비즈?�스 로직
 * - COMZ010M00Service: ?�스?�코?��?�?비즈?�스 로직
 * - COMZ020M00Service: ?��? 관�?비즈?�스 로직
 * - COMZ030P00Service: ?��? 검??비즈?�스 로직
 * - COMZ040P00Service: ?�업번호검??비즈?�스 로직
 * - COMZ050P00Service: ?�업명�???비즈?�스 로직
 * - COMZ060P00Service: 부?�번?��???비즈?�스 로직
 */
@Module({
  imports: [
    // DatabaseModule, // ?�거
    // ... 기존 imports ?��?
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


