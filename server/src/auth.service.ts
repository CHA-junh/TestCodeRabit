import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';

@Injectable()
export class AuthService {
  private readonly GW_URL =
    'https://gw.buttle.co.kr/sms/emp.common.do?command=ajaxLogin';

  async login(empNo: string, password: string) {
    try {
      const formData = new URLSearchParams();
      formData.append('command', 'login');
      formData.append('lang', 'kor');
      formData.append('emp_no', empNo);
      formData.append('passwd', password);

      const response = await fetch(this.GW_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (!response.ok) {
        return {
          success: false,
          message: `GW ?∏Ï¶ù ?§Ìå®: ${response.status}`,
        };
      }

      const data = (await response.json()) as any;

      if (data.jsonMessage?.result === 'success') {
        return {
          success: true,
          message: '?∏Ï¶ù ?±Í≥µ',
          user: {
            empNo,
            name: data.jsonMessage.name || '',
            department: data.jsonMessage.department || '',
            position: data.jsonMessage.position || '',
          },
        };
      } else {
        return {
          success: false,
          message: data.jsonMessage?.message || '?∏Ï¶ù ?§Ìå®',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'GW ?∏Ï¶ù Ï§??§Î•ò Î∞úÏÉù',
        error: error instanceof Error ? error.message : error,
      };
    }
  }
}


