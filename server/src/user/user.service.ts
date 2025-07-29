import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserInfoDto } from './dto/user-info.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  private readonly SALT_ROUNDS = 12; // bcrypt ?�트 ?�운??

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  /**
   * ?�력�?검�?
   */
  private validateUserId(userId: string): void {
    if (!userId || typeof userId !== 'string') {
      throw new BadRequestException('?�효?��? ?��? ?�용??ID?�니??');
    }

    // ?�용??ID ?�식 검�?(?�자�??�용)
    if (!/^\d+$/.test(userId)) {
      throw new BadRequestException('?�용??ID???�자�??�력 가?�합?�다.');
    }

    // 길이 ?�한
    if (userId.length > 20) {
      throw new BadRequestException('?�용??ID가 ?�무 깁니??');
    }
  }

  /**
   * SHA512 ?�시 ?�성
   */
  private generateSHA512Hash(input: string): string {
    return crypto
      .createHash('sha512')
      .update(input)
      .digest('hex')
      .toUpperCase();
  }

  /**
   * ?�번?�로 ?�용???�보 조회 (부?�명/직급�??�함) - SQL Injection 방�?
   */
  async findUserWithDept(userId: string): Promise<UserInfoDto | null> {
    try {
      // ?�력�?검�?
      this.validateUserId(userId);

      // TypeORM QueryBuilder�??�용???�전??쿼리
      const result = await this.dataSource
        .createQueryBuilder()
        .select([
          'A.USER_ID as "userId"',
          'A.USER_NM as "userName"',
          'A.DEPT_CD as "deptCd"',
          'V.DEPT_NM as "deptNm"',
          'A.DUTY_CD as "dutyCd"',
          '(SELECT SML_CSF_NM FROM TBL_SML_CSF_CD WHERE LRG_CSF_CD = :lrgCsfCd AND SML_CSF_CD = A.DUTY_CD AND ROWNUM = 1) AS "dutyNm"',
          'A.DUTY_DIV_CD as "dutyDivCd"',
          'A.AUTH_CD as "authCd"',
          'A.EMAIL_ADDR as "emailAddr"',
          'A.USR_ROLE_ID as "usrRoleId"',
          'V.DEPT_DIV_CD as "deptDivCd"',
          'V.HQ_DIV_CD as "hqDivCd"',
          'V.HQ_DIV_NM as "hqDivNm"',
          'V.DEPT_FULL_NM as "deptFullNm"',
          'V.DEPT_TP as "deptTp"',
        ])
        .from('TBL_USER_INF', 'A')
        .innerJoin(
          'V_DEPT_SUB',
          'V',
          'V.DEPT_CD = A.DEPT_CD AND V.USE_YN = :useYn',
        )
        .where('A.USER_ID = :userId', {
          userId,
          lrgCsfCd: '116',
          useYn: 'Y',
        })
        .getRawOne();

      return result || null;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('?�용???�보 조회 �??�류가 발생?�습?�다.');
    }
  }

  /**
   * ?�용??비�?번호 검�?(?�이브리??방식: ?�문 + SHA512 + bcrypt)
   */
  async validateUserPassword(
    userId: string,
    password: string,
  ): Promise<boolean> {
    try {
      // ?�력�?검�?
      this.validateUserId(userId);

      if (!password || typeof password !== 'string') {
        console.log(
          `??비�?번호 검�??�패 (${userId}): 비�?번호가 ?�효?��? ?�음`,
        );
        return false;
      }

      const user = await this.userRepository.findOne({ where: { userId } });
      if (!user || !user.userPwd) {
        // 로그 ?�전 ?�거 - 보안??민감???�보 ?�출 방�?
        return false;
      }

      // 1. SHA512 ?�시 검�?(기존 방식, 128??16진수)
      const isSHA512Pattern =
        user.userPwd.length === 128 && /^[A-Fa-f0-9]{128}$/.test(user.userPwd);

      if (isSHA512Pattern) {
        const sha512Hash = this.generateSHA512Hash(password);

        // ?�?�문??구분 ?�이 비교
        if (user.userPwd.toUpperCase() === sha512Hash.toUpperCase()) {
          // 로그???�공 ???�동?�로 bcrypt�?마이그레?�션
          this.migratePasswordToBcrypt(userId, password).catch((error) => {
            console.warn(
              `비�?번호 마이그레?�션 ?�패 (${userId}):`,
              error.message,
            );
          });
          return true;
        }

        // ?�용??ID?� ?�일??경우???�도
        if (userId === password) {
          const userIdHash = this.generateSHA512Hash(userId);
          if (user.userPwd.toUpperCase() === userIdHash.toUpperCase()) {
            return true;
          }
        }

        return false;
      }

      // 2. bcrypt ?�시 검�?(?�로??방식, 60???�상?�면??$2b$ ?�는 $2a$�??�작)
      if (
        user.userPwd.length >= 60 &&
        (user.userPwd.startsWith('$2b$') || user.userPwd.startsWith('$2a$'))
      ) {
        const bcryptResult = await bcrypt.compare(password, user.userPwd);
        return bcryptResult;
      }

      // 3. ?�문 비�?번호 검�?(?�거??방식)
      if (user.userPwd === password) {
        // 로그???�공 ???�동?�로 bcrypt�?마이그레?�션
        this.migratePasswordToBcrypt(userId, password).catch((error) => {
          console.warn(
            `비�?번호 마이그레?�션 ?�패 (${userId}):`,
            error.message,
          );
        });
        return true;
      }

      return false;
    } catch (error) {
      // 로그 ?�전 ?�거 - 보안??민감???�보 ?�출 방�?
      return false;
    }
  }

  /**
   * ?�문 비�?번호�?bcrypt�?마이그레?�션
   */
  private async migratePasswordToBcrypt(
    userId: string,
    plainPassword: string,
  ): Promise<void> {
    try {
      const hashedPassword = await bcrypt.hash(plainPassword, this.SALT_ROUNDS);
      await this.userRepository.update(
        { userId },
        {
          userPwd: hashedPassword,
          pwdChngDttm: new Date().toISOString().slice(0, 14),
        },
      );
      console.log(`??비�?번호 마이그레?�션 ?�료: ${userId}`);
    } catch (error) {
      console.error(`??비�?번호 마이그레?�션 ?�패: ${userId}`, error);
      throw error;
    }
  }

  /**
   * ?�용??존재 ?��? ?�인
   */
  async userExists(userId: string): Promise<boolean> {
    try {
      // ?�력�?검�?
      this.validateUserId(userId);

      const count = await this.userRepository.count({ where: { userId } });
      return count > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * 비�?번호 변�?(bcrypt ?�용)
   */
  async updatePassword(userId: string, newPassword: string): Promise<boolean> {
    try {
      // ?�력�?검�?
      this.validateUserId(userId);

      if (!newPassword || typeof newPassword !== 'string') {
        throw new BadRequestException('?�효?��? ?��? 비�?번호?�니??');
      }

      // 비�?번호 복잡??검�?
      if (newPassword.length < 8) {
        throw new BadRequestException('비�?번호??최소 8???�상?�어???�니??');
      }

      if (newPassword === userId) {
        throw new BadRequestException('비�?번호???�번�??�일?????�습?�다.');
      }

      // bcrypt�??�용??비�?번호 ?�싱
      const hashedPassword = await bcrypt.hash(newPassword, this.SALT_ROUNDS);

      const result = await this.userRepository.update(
        { userId },
        {
          userPwd: hashedPassword,
          pwdChngDttm: new Date().toISOString().slice(0, 14),
        },
      );
      return (result.affected ?? 0) > 0;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('비�?번호 변�?�??�류가 발생?�습?�다.');
    }
  }
}


