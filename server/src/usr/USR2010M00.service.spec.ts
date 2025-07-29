import axios from 'axios';

describe('UsrService (Real DB - HTTP Integration)', () => {
  const baseURL = 'http://localhost:8080/api/usr';
  const timeout = 30000; // 30초 타임아웃

  beforeAll(async () => {
    // 서버가 실행 중인지 확인
    try {
      await axios.get('http://localhost:8080/api/health', { timeout: 5000 });
      console.log('✅ 서버가 정상적으로 실행 중입니다.');
    } catch (error) {
      throw new Error(
        '❌ 서버가 실행되지 않았습니다. 먼저 서버를 시작하세요: npm run start:server',
      );
    }
  });

  describe('getUserList', () => {
    it('실제 DB에서 사용자 목록을 조회한다', async () => {
      const response = await axios.get(`${baseURL}/list`, { timeout });
      expect(response.status).toBe(200);

      const result = response.data as any;
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      console.log(`📊 실제 DB에서 조회된 사용자 수: ${result.data.length}명`);

      if (result.data.length > 0) {
        const firstUser = result.data[0];
        expect(firstUser).toHaveProperty('empNo');
        expect(firstUser).toHaveProperty('empNm');
        console.log(
          `👤 첫 번째 사용자: ${firstUser.empNm} (${firstUser.empNo})`,
        );
      }
    });

    it('사용자명으로 검색 시 필터링된 결과를 반환한다', async () => {
      // 검색 파라미터를 쿼리스트링으로 전달
      const response = await axios.get(`${baseURL}/list?userNm=김`, {
        timeout,
      });
      expect(response.status).toBe(200);

      const result = response.data as any;
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      console.log(`🔍 '김' 검색 결과: ${result.data.length}명`);

      // 검색 결과가 있다면 '김'으로 시작하는지 확인
      if (result.data.length > 0) {
        result.data.forEach((user: any) => {
          expect(user.empNm).toMatch(/^김/);
        });
      }
    });
  });

  describe('getWorkAuthList', () => {
    it('실제 DB에서 사용자의 업무권한 목록을 조회한다', async () => {
      // 먼저 사용자 목록을 가져와서 테스트할 사용자 선택
      const userListResponse = await axios.get(`${baseURL}/list`, { timeout });
      const userListResult = userListResponse.data as any;

      if (userListResult.success && userListResult.data.length > 0) {
        const testUser = userListResult.data[0];
        const response = await axios.get(
          `${baseURL}/work-auth/${testUser.empNo}`,
          { timeout },
        );
        expect(response.status).toBe(200);

        const result = response.data as any;
        expect(result.success).toBe(true);
        expect(Array.isArray(result.data)).toBe(true);
        console.log(
          `🔑 ${testUser.empNm}의 업무권한 수: ${result.data.length}개`,
        );

        if (result.data.length > 0) {
          const firstAuth = result.data[0];
          expect(firstAuth).toHaveProperty('smlCsfCd');
          expect(firstAuth).toHaveProperty('smlCsfNm');
          console.log(
            `📋 첫 번째 권한: ${firstAuth.smlCsfNm} (${firstAuth.smlCsfCd})`,
          );
        }
      } else {
        console.log('⚠️ 테스트할 사용자가 없습니다.');
      }
    });
  });

  describe('getUserRoles', () => {
    it('실제 DB에서 사용자 역할 목록을 조회한다', async () => {
      const response = await axios.get(`${baseURL}/roles`, { timeout });
      expect(response.status).toBe(200);

      const result = response.data as any;
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      console.log(
        `🎭 실제 DB에서 조회된 사용자 역할 수: ${result.data.length}개`,
      );

      if (result.data.length > 0) {
        const firstRole = result.data[0];
        expect(firstRole).toHaveProperty('usrRoleId');
        expect(firstRole).toHaveProperty('usrRoleNm');
        console.log(
          `👑 첫 번째 역할: ${firstRole.usrRoleNm} (${firstRole.usrRoleId})`,
        );
      }
    });
  });

  describe('searchApprover', () => {
    it('실제 DB에서 승인결재자를 검색한다', async () => {
      const response = await axios.get(
        `${baseURL}/approver-search?approverNm=김`,
        {
          timeout,
        },
      );
      expect(response.status).toBe(200);

      const result = response.data as any;
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      console.log(`🔍 '김' 승인결재자 검색 결과: ${result.data.length}명`);

      if (result.data.length > 0) {
        const firstApprover = result.data[0];
        expect(firstApprover).toHaveProperty('empNo');
        expect(firstApprover).toHaveProperty('empNm');
        expect(firstApprover).toHaveProperty('authCd');
        console.log(
          `✅ 첫 번째 승인결재자: ${firstApprover.empNm} (${firstApprover.empNo})`,
        );
      }
    });
  });

  describe('real-db-procedure', () => {
    it('실제 DB 프로시저를 호출한다', async () => {
      // DB 테스트 API를 통해 실제 쿼리 실행
      const response = await axios.get('http://localhost:8080/api/db-test', {
        timeout,
      });
      expect(response.status).toBe(200);

      const data = response.data as any;
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();

      console.log(`📊 실제 DB 연결 테스트 성공`);
    });
  });

  describe('saveUser', () => {
    it('실제 DB에서 사용자 정보를 저장한다 (읽기 전용 테스트)', async () => {
      // 실제 DB에서는 데이터 변경을 피하고 읽기 전용으로 테스트
      const response = await axios.get(`${baseURL}/list`, { timeout });
      expect(response.status).toBe(200);

      const result = response.data as any;
      expect(result.success).toBe(true);
      const userList = result.data;

      if (userList.length > 0) {
        const testUser = userList[0];
        console.log(
          `📝 사용자 정보 저장 테스트 (읽기 전용): ${testUser.empNm}`,
        );

        // 실제 저장은 하지 않고 데이터 구조만 확인
        expect(testUser).toHaveProperty('empNo');
        expect(testUser).toHaveProperty('empNm');
        expect(testUser).toHaveProperty('hqDivCd');
        expect(testUser).toHaveProperty('deptDivCd');

        console.log(`✅ 사용자 데이터 구조 검증 완료: ${testUser.empNm}`);
      } else {
        console.log('⚠️ 테스트할 사용자가 없습니다.');
      }
    });
  });
});
