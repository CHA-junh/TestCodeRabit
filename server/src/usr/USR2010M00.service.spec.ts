import axios from 'axios';

describe('UsrService (Real DB - HTTP Integration)', () => {
  const baseURL = 'http://localhost:8080/api/usr';
  const timeout = 30000; // 30์ด???์??

  beforeAll(async () => {
    // ?๋ฒ๊ฐ ?คํ ์ค์ธ์ง ?์ธ
    try {
      await axios.get('http://localhost:8080/api/health', { timeout: 5000 });
      console.log('???๋ฒ๊ฐ ?์?์ผ๋ก??คํ ์ค์?๋ค.');
    } catch (error) {
      throw new Error(
        '???๋ฒ๊ฐ ?คํ?์? ?์?ต๋?? ๋จผ์? ?๋ฒ๋ฅ??์?์ธ?? npm run start:server',
      );
    }
  });

  describe('getUserList', () => {
    it('?ค์  DB?์ ?ฌ์ฉ??๋ชฉ๋ก??์กฐํ?๋ค', async () => {
      const response = await axios.get(`${baseURL}/list`, { timeout });
      expect(response.status).toBe(200);

      const result = response.data as any;
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      console.log(`? ?ค์  DB?์ ์กฐํ???ฌ์ฉ???? ${result.data.length}๋ช?);

      if (result.data.length > 0) {
        const firstUser = result.data[0];
        expect(firstUser).toHaveProperty('empNo');
        expect(firstUser).toHaveProperty('empNm');
        console.log(
          `?ค ์ฒ?๋ฒ์งธ ?ฌ์ฉ?? ${firstUser.empNm} (${firstUser.empNo})`,
        );
      }
    });

    it('?ฌ์ฉ?๋ช?ผ๋ก ๊ฒ?????ํฐ๋ง๋ ๊ฒฐ๊ณผ๋ฅ?๋ฐํ?๋ค', async () => {
      // ๊ฒ???๋ผ๋ฏธํฐ๋ฅ?์ฟผ๋ฆฌ?คํธ๋ง์ผ๋ก??๋ฌ
      const response = await axios.get(`${baseURL}/list?userNm=๊น`, {
        timeout,
      });
      expect(response.status).toBe(200);

      const result = response.data as any;
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      console.log(`? '๊น' ๊ฒ??๊ฒฐ๊ณผ: ${result.data.length}๋ช?);

      // ๊ฒ??๊ฒฐ๊ณผ๊ฐ ?๋ค๋ฉ?'๊น'?ผ๋ก ?์?๋์ง ?์ธ
      if (result.data.length > 0) {
        result.data.forEach((user: any) => {
          expect(user.empNm).toMatch(/^๊น/);
        });
      }
    });
  });

  describe('getWorkAuthList', () => {
    it('?ค์  DB?์ ?ฌ์ฉ?์ ?๋ฌด๊ถํ ๋ชฉ๋ก??์กฐํ?๋ค', async () => {
      // ๋จผ์? ?ฌ์ฉ??๋ชฉ๋ก??๊ฐ?ธ์????์ค?ธํ  ?ฌ์ฉ??? ํ
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
          `? ${testUser.empNm}???๋ฌด๊ถํ ?? ${result.data.length}๊ฐ?,
        );

        if (result.data.length > 0) {
          const firstAuth = result.data[0];
          expect(firstAuth).toHaveProperty('smlCsfCd');
          expect(firstAuth).toHaveProperty('smlCsfNm');
          console.log(
            `? ์ฒ?๋ฒ์งธ ๊ถํ: ${firstAuth.smlCsfNm} (${firstAuth.smlCsfCd})`,
          );
        }
      } else {
        console.log('? ๏ธ ?์ค?ธํ  ?ฌ์ฉ?๊? ?์ต?๋ค.');
      }
    });
  });

  describe('getUserRoles', () => {
    it('?ค์  DB?์ ?ฌ์ฉ????  ๋ชฉ๋ก??์กฐํ?๋ค', async () => {
      const response = await axios.get(`${baseURL}/roles`, { timeout });
      expect(response.status).toBe(200);

      const result = response.data as any;
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      console.log(
        `?ญ ?ค์  DB?์ ์กฐํ???ฌ์ฉ????  ?? ${result.data.length}๊ฐ?,
      );

      if (result.data.length > 0) {
        const firstRole = result.data[0];
        expect(firstRole).toHaveProperty('usrRoleId');
        expect(firstRole).toHaveProperty('usrRoleNm');
        console.log(
          `? ์ฒ?๋ฒ์งธ ?? : ${firstRole.usrRoleNm} (${firstRole.usrRoleId})`,
        );
      }
    });
  });

  describe('searchApprover', () => {
    it('?ค์  DB?์ ?น์ธ๊ฒฐ์ฌ?๋? ๊ฒ?ํ??, async () => {
      const response = await axios.get(
        `${baseURL}/approver-search?approverNm=๊น`,
        {
          timeout,
        },
      );
      expect(response.status).toBe(200);

      const result = response.data as any;
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      console.log(`? '๊น' ?น์ธ๊ฒฐ์ฌ??๊ฒ??๊ฒฐ๊ณผ: ${result.data.length}๋ช?);

      if (result.data.length > 0) {
        const firstApprover = result.data[0];
        expect(firstApprover).toHaveProperty('empNo');
        expect(firstApprover).toHaveProperty('empNm');
        expect(firstApprover).toHaveProperty('authCd');
        console.log(
          `??์ฒ?๋ฒ์งธ ?น์ธ๊ฒฐ์ฌ?? ${firstApprover.empNm} (${firstApprover.empNo})`,
        );
      }
    });
  });

  describe('real-db-procedure', () => {
    it('?ค์  DB ?๋ก?์?๋ฅ??ธ์ถ?๋ค', async () => {
      // DB ?์ค??API๋ฅ??ตํด ?ค์  ์ฟผ๋ฆฌ ?คํ
      const response = await axios.get('http://localhost:8080/api/db-test', {
        timeout,
      });
      expect(response.status).toBe(200);

      const data = response.data as any;
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();

      console.log(`? ?ค์  DB ?ฐ๊ฒฐ ?์ค???ฑ๊ณต`);
    });
  });

  describe('saveUser', () => {
    it('?ค์  DB?์ ?ฌ์ฉ???๋ณด๋ฅ???ฅํ??(?ฝ๊ธฐ ?์ฉ ?์ค??', async () => {
      // ?ค์  DB?์???ฐ์ด??๋ณ๊ฒฝ์ ?ผํ๊ณ??ฝ๊ธฐ ?์ฉ?ผ๋ก ?์ค??
      const response = await axios.get(`${baseURL}/list`, { timeout });
      expect(response.status).toBe(200);

      const result = response.data as any;
      expect(result.success).toBe(true);
      const userList = result.data;

      if (userList.length > 0) {
        const testUser = userList[0];
        console.log(
          `? ?ฌ์ฉ???๋ณด ????์ค??(?ฝ๊ธฐ ?์ฉ): ${testUser.empNm}`,
        );

        // ?ค์  ??ฅ์? ?์? ?๊ณ  ?ฐ์ด??๊ตฌ์กฐ๋ง??์ธ
        expect(testUser).toHaveProperty('empNo');
        expect(testUser).toHaveProperty('empNm');
        expect(testUser).toHaveProperty('hqDivCd');
        expect(testUser).toHaveProperty('deptDivCd');

        console.log(`???ฌ์ฉ???ฐ์ด??๊ตฌ์กฐ ๊ฒ์ฆ??๋ฃ: ${testUser.empNm}`);
      } else {
        console.log('? ๏ธ ?์ค?ธํ  ?ฌ์ฉ?๊? ?์ต?๋ค.');
      }
    });
  });
});


