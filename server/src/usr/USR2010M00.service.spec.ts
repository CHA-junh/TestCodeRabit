import axios from 'axios';

describe('UsrService (Real DB - HTTP Integration)', () => {
  const baseURL = 'http://localhost:8080/api/usr';
  const timeout = 30000; // 30�??�?�아??

  beforeAll(async () => {
    // ?�버가 ?�행 중인지 ?�인
    try {
      await axios.get('http://localhost:8080/api/health', { timeout: 5000 });
      console.log('???�버가 ?�상?�으�??�행 중입?�다.');
    } catch (error) {
      throw new Error(
        '???�버가 ?�행?��? ?�았?�니?? 먼�? ?�버�??�작?�세?? npm run start:server',
      );
    }
  });

  describe('getUserList', () => {
    it('?�제 DB?�서 ?�용??목록??조회?�다', async () => {
      const response = await axios.get(`${baseURL}/list`, { timeout });
      expect(response.status).toBe(200);

      const result = response.data as any;
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      console.log(`?�� ?�제 DB?�서 조회???�용???? ${result.data.length}�?);

      if (result.data.length > 0) {
        const firstUser = result.data[0];
        expect(firstUser).toHaveProperty('empNo');
        expect(firstUser).toHaveProperty('empNm');
        console.log(
          `?�� �?번째 ?�용?? ${firstUser.empNm} (${firstUser.empNo})`,
        );
      }
    });

    it('?�용?�명?�로 검?????�터링된 결과�?반환?�다', async () => {
      // 검???�라미터�?쿼리?�트링으�??�달
      const response = await axios.get(`${baseURL}/list?userNm=김`, {
        timeout,
      });
      expect(response.status).toBe(200);

      const result = response.data as any;
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      console.log(`?�� '김' 검??결과: ${result.data.length}�?);

      // 검??결과가 ?�다�?'김'?�로 ?�작?�는지 ?�인
      if (result.data.length > 0) {
        result.data.forEach((user: any) => {
          expect(user.empNm).toMatch(/^김/);
        });
      }
    });
  });

  describe('getWorkAuthList', () => {
    it('?�제 DB?�서 ?�용?�의 ?�무권한 목록??조회?�다', async () => {
      // 먼�? ?�용??목록??가?��????�스?�할 ?�용???�택
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
          `?�� ${testUser.empNm}???�무권한 ?? ${result.data.length}�?,
        );

        if (result.data.length > 0) {
          const firstAuth = result.data[0];
          expect(firstAuth).toHaveProperty('smlCsfCd');
          expect(firstAuth).toHaveProperty('smlCsfNm');
          console.log(
            `?�� �?번째 권한: ${firstAuth.smlCsfNm} (${firstAuth.smlCsfCd})`,
          );
        }
      } else {
        console.log('?�️ ?�스?�할 ?�용?��? ?�습?�다.');
      }
    });
  });

  describe('getUserRoles', () => {
    it('?�제 DB?�서 ?�용????�� 목록??조회?�다', async () => {
      const response = await axios.get(`${baseURL}/roles`, { timeout });
      expect(response.status).toBe(200);

      const result = response.data as any;
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      console.log(
        `?�� ?�제 DB?�서 조회???�용????�� ?? ${result.data.length}�?,
      );

      if (result.data.length > 0) {
        const firstRole = result.data[0];
        expect(firstRole).toHaveProperty('usrRoleId');
        expect(firstRole).toHaveProperty('usrRoleNm');
        console.log(
          `?�� �?번째 ??��: ${firstRole.usrRoleNm} (${firstRole.usrRoleId})`,
        );
      }
    });
  });

  describe('searchApprover', () => {
    it('?�제 DB?�서 ?�인결재?��? 검?�한??, async () => {
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
      console.log(`?�� '김' ?�인결재??검??결과: ${result.data.length}�?);

      if (result.data.length > 0) {
        const firstApprover = result.data[0];
        expect(firstApprover).toHaveProperty('empNo');
        expect(firstApprover).toHaveProperty('empNm');
        expect(firstApprover).toHaveProperty('authCd');
        console.log(
          `??�?번째 ?�인결재?? ${firstApprover.empNm} (${firstApprover.empNo})`,
        );
      }
    });
  });

  describe('real-db-procedure', () => {
    it('?�제 DB ?�로?��?�??�출?�다', async () => {
      // DB ?�스??API�??�해 ?�제 쿼리 ?�행
      const response = await axios.get('http://localhost:8080/api/db-test', {
        timeout,
      });
      expect(response.status).toBe(200);

      const data = response.data as any;
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();

      console.log(`?�� ?�제 DB ?�결 ?�스???�공`);
    });
  });

  describe('saveUser', () => {
    it('?�제 DB?�서 ?�용???�보�??�?�한??(?�기 ?�용 ?�스??', async () => {
      // ?�제 DB?�서???�이??변경을 ?�하�??�기 ?�용?�로 ?�스??
      const response = await axios.get(`${baseURL}/list`, { timeout });
      expect(response.status).toBe(200);

      const result = response.data as any;
      expect(result.success).toBe(true);
      const userList = result.data;

      if (userList.length > 0) {
        const testUser = userList[0];
        console.log(
          `?�� ?�용???�보 ?�???�스??(?�기 ?�용): ${testUser.empNm}`,
        );

        // ?�제 ?�?��? ?��? ?�고 ?�이??구조�??�인
        expect(testUser).toHaveProperty('empNo');
        expect(testUser).toHaveProperty('empNm');
        expect(testUser).toHaveProperty('hqDivCd');
        expect(testUser).toHaveProperty('deptDivCd');

        console.log(`???�용???�이??구조 검�??�료: ${testUser.empNm}`);
      } else {
        console.log('?�️ ?�스?�할 ?�용?��? ?�습?�다.');
      }
    });
  });
});


