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
  private readonly SALT_ROUNDS = 12; // bcrypt ?”íŠ¸ ?¼ìš´??

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  /**
   * ?…ë ¥ê°?ê²€ì¦?
   */
  private validateUserId(userId: string): void {
    if (!userId || typeof userId !== 'string') {
      throw new BadRequestException('? íš¨?˜ì? ?Šì? ?¬ìš©??ID?…ë‹ˆ??');
    }

    // ?¬ìš©??ID ?•ì‹ ê²€ì¦?(?«ìë§??ˆìš©)
    if (!/^\d+$/.test(userId)) {
      throw new BadRequestException('?¬ìš©??ID???«ìë§??…ë ¥ ê°€?¥í•©?ˆë‹¤.');
    }

    // ê¸¸ì´ ?œí•œ
    if (userId.length > 20) {
      throw new BadRequestException('?¬ìš©??IDê°€ ?ˆë¬´ ê¹ë‹ˆ??');
    }
  }

  /**
   * SHA512 ?´ì‹œ ?ì„±
   */
  private generateSHA512Hash(input: string): string {
    return crypto
      .createHash('sha512')
      .update(input)
      .digest('hex')
      .toUpperCase();
  }

  /**
   * ?¬ë²ˆ?¼ë¡œ ?¬ìš©???•ë³´ ì¡°íšŒ (ë¶€?œëª…/ì§ê¸‰ëª??¬í•¨) - SQL Injection ë°©ì?
   */
  async findUserWithDept(userId: string): Promise<UserInfoDto | null> {
    try {
      // ?…ë ¥ê°?ê²€ì¦?
      this.validateUserId(userId);

      // TypeORM QueryBuilderë¥??¬ìš©???ˆì „??ì¿¼ë¦¬
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
      throw new BadRequestException('?¬ìš©???•ë³´ ì¡°íšŒ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.');
    }
  }

  /**
   * ?¬ìš©??ë¹„ë?ë²ˆí˜¸ ê²€ì¦?(?˜ì´ë¸Œë¦¬??ë°©ì‹: ?‰ë¬¸ + SHA512 + bcrypt)
   */
  async validateUserPassword(
    userId: string,
    password: string,
  ): Promise<boolean> {
    try {
      // ?…ë ¥ê°?ê²€ì¦?
      this.validateUserId(userId);

      if (!password || typeof password !== 'string') {
        console.log(
          `??ë¹„ë?ë²ˆí˜¸ ê²€ì¦??¤íŒ¨ (${userId}): ë¹„ë?ë²ˆí˜¸ê°€ ? íš¨?˜ì? ?ŠìŒ`,
        );
        return false;
      }

      const user = await this.userRepository.findOne({ where: { userId } });
      if (!user || !user.userPwd) {
        // ë¡œê·¸ ?„ì „ ?œê±° - ë³´ì•ˆ??ë¯¼ê°???•ë³´ ?¸ì¶œ ë°©ì?
        return false;
      }

      // 1. SHA512 ?´ì‹œ ê²€ì¦?(ê¸°ì¡´ ë°©ì‹, 128??16ì§„ìˆ˜)
      const isSHA512Pattern =
        user.userPwd.length === 128 && /^[A-Fa-f0-9]{128}$/.test(user.userPwd);

      if (isSHA512Pattern) {
        const sha512Hash = this.generateSHA512Hash(password);

        // ?€?Œë¬¸??êµ¬ë¶„ ?†ì´ ë¹„êµ
        if (user.userPwd.toUpperCase() === sha512Hash.toUpperCase()) {
          // ë¡œê·¸???±ê³µ ???ë™?¼ë¡œ bcryptë¡?ë§ˆì´ê·¸ë ˆ?´ì…˜
          this.migratePasswordToBcrypt(userId, password).catch((error) => {
            console.warn(
              `ë¹„ë?ë²ˆí˜¸ ë§ˆì´ê·¸ë ˆ?´ì…˜ ?¤íŒ¨ (${userId}):`,
              error.message,
            );
          });
          return true;
        }

        // ?¬ìš©??ID?€ ?™ì¼??ê²½ìš°???œë„
        if (userId === password) {
          const userIdHash = this.generateSHA512Hash(userId);
          if (user.userPwd.toUpperCase() === userIdHash.toUpperCase()) {
            return true;
          }
        }

        return false;
      }

      // 2. bcrypt ?´ì‹œ ê²€ì¦?(?ˆë¡œ??ë°©ì‹, 60???´ìƒ?´ë©´??$2b$ ?ëŠ” $2a$ë¡??œì‘)
      if (
        user.userPwd.length >= 60 &&
        (user.userPwd.startsWith('$2b$') || user.userPwd.startsWith('$2a$'))
      ) {
        const bcryptResult = await bcrypt.compare(password, user.userPwd);
        return bcryptResult;
      }

      // 3. ?‰ë¬¸ ë¹„ë?ë²ˆí˜¸ ê²€ì¦?(?ˆê±°??ë°©ì‹)
      if (user.userPwd === password) {
        // ë¡œê·¸???±ê³µ ???ë™?¼ë¡œ bcryptë¡?ë§ˆì´ê·¸ë ˆ?´ì…˜
        this.migratePasswordToBcrypt(userId, password).catch((error) => {
          console.warn(
            `ë¹„ë?ë²ˆí˜¸ ë§ˆì´ê·¸ë ˆ?´ì…˜ ?¤íŒ¨ (${userId}):`,
            error.message,
          );
        });
        return true;
      }

      return false;
    } catch (error) {
      // ë¡œê·¸ ?„ì „ ?œê±° - ë³´ì•ˆ??ë¯¼ê°???•ë³´ ?¸ì¶œ ë°©ì?
      return false;
    }
  }

  /**
   * ?‰ë¬¸ ë¹„ë?ë²ˆí˜¸ë¥?bcryptë¡?ë§ˆì´ê·¸ë ˆ?´ì…˜
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
      console.log(`??ë¹„ë?ë²ˆí˜¸ ë§ˆì´ê·¸ë ˆ?´ì…˜ ?„ë£Œ: ${userId}`);
    } catch (error) {
      console.error(`??ë¹„ë?ë²ˆí˜¸ ë§ˆì´ê·¸ë ˆ?´ì…˜ ?¤íŒ¨: ${userId}`, error);
      throw error;
    }
  }

  /**
   * ?¬ìš©??ì¡´ì¬ ?¬ë? ?•ì¸
   */
  async userExists(userId: string): Promise<boolean> {
    try {
      // ?…ë ¥ê°?ê²€ì¦?
      this.validateUserId(userId);

      const count = await this.userRepository.count({ where: { userId } });
      return count > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * ë¹„ë?ë²ˆí˜¸ ë³€ê²?(bcrypt ?¬ìš©)
   */
  async updatePassword(userId: string, newPassword: string): Promise<boolean> {
    try {
      // ?…ë ¥ê°?ê²€ì¦?
      this.validateUserId(userId);

      if (!newPassword || typeof newPassword !== 'string') {
        throw new BadRequestException('? íš¨?˜ì? ?Šì? ë¹„ë?ë²ˆí˜¸?…ë‹ˆ??');
      }

      // ë¹„ë?ë²ˆí˜¸ ë³µì¡??ê²€ì¦?
      if (newPassword.length < 8) {
        throw new BadRequestException('ë¹„ë?ë²ˆí˜¸??ìµœì†Œ 8???´ìƒ?´ì–´???©ë‹ˆ??');
      }

      if (newPassword === userId) {
        throw new BadRequestException('ë¹„ë?ë²ˆí˜¸???¬ë²ˆê³??™ì¼?????†ìŠµ?ˆë‹¤.');
      }

      // bcryptë¥??¬ìš©??ë¹„ë?ë²ˆí˜¸ ?´ì‹±
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
      throw new BadRequestException('ë¹„ë?ë²ˆí˜¸ ë³€ê²?ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.');
    }
  }
}


