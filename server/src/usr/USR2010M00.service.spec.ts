import axios from 'axios';

describe('UsrService (Real DB - HTTP Integration)', () => {
  const baseURL = 'http://localhost:8080/api/usr';
  const timeout = 30000; // 30ì´??€?„ì•„??

  beforeAll(async () => {
    // ?œë²„ê°€ ?¤í–‰ ì¤‘ì¸ì§€ ?•ì¸
    try {
      await axios.get('http://localhost:8080/api/health', { timeout: 5000 });
      console.log('???œë²„ê°€ ?•ìƒ?ìœ¼ë¡??¤í–‰ ì¤‘ì…?ˆë‹¤.');
    } catch (error) {
      throw new Error(
        '???œë²„ê°€ ?¤í–‰?˜ì? ?Šì•˜?µë‹ˆ?? ë¨¼ì? ?œë²„ë¥??œì‘?˜ì„¸?? npm run start:server',
      );
    }
  });

  describe('getUserList', () => {
    it('?¤ì œ DB?ì„œ ?¬ìš©??ëª©ë¡??ì¡°íšŒ?œë‹¤', async () => {
      const response = await axios.get(`${baseURL}/list`, { timeout });
      expect(response.status).toBe(200);

      const result = response.data as any;
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      console.log(`?“Š ?¤ì œ DB?ì„œ ì¡°íšŒ???¬ìš©???? ${result.data.length}ëª?);

      if (result.data.length > 0) {
        const firstUser = result.data[0];
        expect(firstUser).toHaveProperty('empNo');
        expect(firstUser).toHaveProperty('empNm');
        console.log(
          `?‘¤ ì²?ë²ˆì§¸ ?¬ìš©?? ${firstUser.empNm} (${firstUser.empNo})`,
        );
      }
    });

    it('?¬ìš©?ëª…?¼ë¡œ ê²€?????„í„°ë§ëœ ê²°ê³¼ë¥?ë°˜í™˜?œë‹¤', async () => {
      // ê²€???Œë¼ë¯¸í„°ë¥?ì¿¼ë¦¬?¤íŠ¸ë§ìœ¼ë¡??„ë‹¬
      const response = await axios.get(`${baseURL}/list?userNm=ê¹€`, {
        timeout,
      });
      expect(response.status).toBe(200);

      const result = response.data as any;
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      console.log(`?” 'ê¹€' ê²€??ê²°ê³¼: ${result.data.length}ëª?);

      // ê²€??ê²°ê³¼ê°€ ?ˆë‹¤ë©?'ê¹€'?¼ë¡œ ?œì‘?˜ëŠ”ì§€ ?•ì¸
      if (result.data.length > 0) {
        result.data.forEach((user: any) => {
          expect(user.empNm).toMatch(/^ê¹€/);
        });
      }
    });
  });

  describe('getWorkAuthList', () => {
    it('?¤ì œ DB?ì„œ ?¬ìš©?ì˜ ?…ë¬´ê¶Œí•œ ëª©ë¡??ì¡°íšŒ?œë‹¤', async () => {
      // ë¨¼ì? ?¬ìš©??ëª©ë¡??ê°€?¸ì????ŒìŠ¤?¸í•  ?¬ìš©??? íƒ
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
          `?”‘ ${testUser.empNm}???…ë¬´ê¶Œí•œ ?? ${result.data.length}ê°?,
        );

        if (result.data.length > 0) {
          const firstAuth = result.data[0];
          expect(firstAuth).toHaveProperty('smlCsfCd');
          expect(firstAuth).toHaveProperty('smlCsfNm');
          console.log(
            `?“‹ ì²?ë²ˆì§¸ ê¶Œí•œ: ${firstAuth.smlCsfNm} (${firstAuth.smlCsfCd})`,
          );
        }
      } else {
        console.log('? ï¸ ?ŒìŠ¤?¸í•  ?¬ìš©?ê? ?†ìŠµ?ˆë‹¤.');
      }
    });
  });

  describe('getUserRoles', () => {
    it('?¤ì œ DB?ì„œ ?¬ìš©????•  ëª©ë¡??ì¡°íšŒ?œë‹¤', async () => {
      const response = await axios.get(`${baseURL}/roles`, { timeout });
      expect(response.status).toBe(200);

      const result = response.data as any;
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      console.log(
        `?­ ?¤ì œ DB?ì„œ ì¡°íšŒ???¬ìš©????•  ?? ${result.data.length}ê°?,
      );

      if (result.data.length > 0) {
        const firstRole = result.data[0];
        expect(firstRole).toHaveProperty('usrRoleId');
        expect(firstRole).toHaveProperty('usrRoleNm');
        console.log(
          `?‘‘ ì²?ë²ˆì§¸ ??• : ${firstRole.usrRoleNm} (${firstRole.usrRoleId})`,
        );
      }
    });
  });

  describe('searchApprover', () => {
    it('?¤ì œ DB?ì„œ ?¹ì¸ê²°ì¬?ë? ê²€?‰í•œ??, async () => {
      const response = await axios.get(
        `${baseURL}/approver-search?approverNm=ê¹€`,
        {
          timeout,
        },
      );
      expect(response.status).toBe(200);

      const result = response.data as any;
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      console.log(`?” 'ê¹€' ?¹ì¸ê²°ì¬??ê²€??ê²°ê³¼: ${result.data.length}ëª?);

      if (result.data.length > 0) {
        const firstApprover = result.data[0];
        expect(firstApprover).toHaveProperty('empNo');
        expect(firstApprover).toHaveProperty('empNm');
        expect(firstApprover).toHaveProperty('authCd');
        console.log(
          `??ì²?ë²ˆì§¸ ?¹ì¸ê²°ì¬?? ${firstApprover.empNm} (${firstApprover.empNo})`,
        );
      }
    });
  });

  describe('real-db-procedure', () => {
    it('?¤ì œ DB ?„ë¡œ?œì?ë¥??¸ì¶œ?œë‹¤', async () => {
      // DB ?ŒìŠ¤??APIë¥??µí•´ ?¤ì œ ì¿¼ë¦¬ ?¤í–‰
      const response = await axios.get('http://localhost:8080/api/db-test', {
        timeout,
      });
      expect(response.status).toBe(200);

      const data = response.data as any;
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();

      console.log(`?“Š ?¤ì œ DB ?°ê²° ?ŒìŠ¤???±ê³µ`);
    });
  });

  describe('saveUser', () => {
    it('?¤ì œ DB?ì„œ ?¬ìš©???•ë³´ë¥??€?¥í•œ??(?½ê¸° ?„ìš© ?ŒìŠ¤??', async () => {
      // ?¤ì œ DB?ì„œ???°ì´??ë³€ê²½ì„ ?¼í•˜ê³??½ê¸° ?„ìš©?¼ë¡œ ?ŒìŠ¤??
      const response = await axios.get(`${baseURL}/list`, { timeout });
      expect(response.status).toBe(200);

      const result = response.data as any;
      expect(result.success).toBe(true);
      const userList = result.data;

      if (userList.length > 0) {
        const testUser = userList[0];
        console.log(
          `?“ ?¬ìš©???•ë³´ ?€???ŒìŠ¤??(?½ê¸° ?„ìš©): ${testUser.empNm}`,
        );

        // ?¤ì œ ?€?¥ì? ?˜ì? ?Šê³  ?°ì´??êµ¬ì¡°ë§??•ì¸
        expect(testUser).toHaveProperty('empNo');
        expect(testUser).toHaveProperty('empNm');
        expect(testUser).toHaveProperty('hqDivCd');
        expect(testUser).toHaveProperty('deptDivCd');

        console.log(`???¬ìš©???°ì´??êµ¬ì¡° ê²€ì¦??„ë£Œ: ${testUser.empNm}`);
      } else {
        console.log('? ï¸ ?ŒìŠ¤?¸í•  ?¬ìš©?ê? ?†ìŠµ?ˆë‹¤.');
      }
    });
  });
});


