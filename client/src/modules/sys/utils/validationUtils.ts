/**
 * 필수 필드가 비어있는지 확인합니다.
 * @param value 검사할 값
 * @returns 비어있으면 true, 아니면 false
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

/**
 * 문자열 길이를 검사합니다.
 * @param value 검사할 문자열
 * @param min 최소 길이
 * @param max 최대 길이
 * @returns 유효성 검사 결과
 */
export function validateStringLength(value: string, min?: number, max?: number): boolean {
  if (isEmpty(value)) return false;
  
  const length = value.trim().length;
  
  if (min !== undefined && length < min) return false;
  if (max !== undefined && length > max) return false;
  
  return true;
}

/**
 * 이메일 형식을 검사합니다.
 * @param email 검사할 이메일
 * @returns 유효성 검사 결과
 */
export function validateEmail(email: string): boolean {
  if (isEmpty(email)) return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 숫자 형식을 검사합니다.
 * @param value 검사할 값
 * @returns 유효성 검사 결과
 */
export function validateNumber(value: any): boolean {
  if (isEmpty(value)) return false;
  
  const num = Number(value);
  return !isNaN(num) && isFinite(num);
}

/**
 * 정수 형식을 검사합니다.
 * @param value 검사할 값
 * @returns 유효성 검사 결과
 */
export function validateInteger(value: any): boolean {
  if (isEmpty(value)) return false;
  
  const num = Number(value);
  return !isNaN(num) && isFinite(num) && Number.isInteger(num);
}

/**
 * 날짜 형식을 검사합니다.
 * @param date 검사할 날짜 문자열
 * @returns 유효성 검사 결과
 */
export function validateDate(date: string): boolean {
  if (isEmpty(date)) return false;
  
  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime());
}

/**
 * 프로그램 ID 형식을 검사합니다.
 * @param pgmId 검사할 프로그램 ID
 * @returns 유효성 검사 결과
 */
export function validateProgramId(pgmId: string): boolean {
  if (isEmpty(pgmId)) return false;
  
  // 프로그램 ID는 영문자, 숫자, 언더스코어만 허용
  const pgmIdRegex = /^[A-Za-z0-9_]+$/;
  return pgmIdRegex.test(pgmId);
}

/**
 * 메뉴 ID 형식을 검사합니다.
 * @param menuId 검사할 메뉴 ID
 * @returns 유효성 검사 결과
 */
export function validateMenuId(menuId: string): boolean {
  if (isEmpty(menuId)) return false;
  
  // 메뉴 ID는 영문자, 숫자, 언더스코어만 허용
  const menuIdRegex = /^[A-Za-z0-9_]+$/;
  return menuIdRegex.test(menuId);
}

/**
 * Y/N 값인지 검사합니다.
 * @param value 검사할 값
 * @returns 유효성 검사 결과
 */
export function validateYN(value: string): boolean {
  if (isEmpty(value)) return false;
  
  return value.toUpperCase() === 'Y' || value.toUpperCase() === 'N';
}

/**
 * 폼 데이터의 유효성을 검사합니다.
 * @param data 검사할 데이터 객체
 * @param rules 검사 규칙 객체
 * @returns 검사 결과 객체
 */
export function validateFormData(data: Record<string, any>, rules: Record<string, any>): Record<string, string> {
  const errors: Record<string, string> = {};

  Object.keys(rules).forEach(field => {
    const value = data[field];
    const fieldRules = rules[field];

    // 필수 필드 검사
    if (fieldRules.required && isEmpty(value)) {
      errors[field] = `${fieldRules.label || field}은(는) 필수입니다.`;
      return;
    }

    // 값이 있는 경우에만 추가 검사
    if (!isEmpty(value)) {
      // 문자열 길이 검사
      if (fieldRules.minLength && !validateStringLength(value, fieldRules.minLength)) {
        errors[field] = `${fieldRules.label || field}은(는) 최소 ${fieldRules.minLength}자 이상이어야 합니다.`;
        return;
      }

      if (fieldRules.maxLength && !validateStringLength(value, undefined, fieldRules.maxLength)) {
        errors[field] = `${fieldRules.label || field}은(는) 최대 ${fieldRules.maxLength}자까지 입력 가능합니다.`;
        return;
      }

      // 이메일 검사
      if (fieldRules.email && !validateEmail(value)) {
        errors[field] = `올바른 이메일 형식을 입력해주세요.`;
        return;
      }

      // 숫자 검사
      if (fieldRules.number && !validateNumber(value)) {
        errors[field] = `숫자만 입력 가능합니다.`;
        return;
      }

      // 정수 검사
      if (fieldRules.integer && !validateInteger(value)) {
        errors[field] = `정수만 입력 가능합니다.`;
        return;
      }

      // 날짜 검사
      if (fieldRules.date && !validateDate(value)) {
        errors[field] = `올바른 날짜 형식을 입력해주세요.`;
        return;
      }

      // 프로그램 ID 검사
      if (fieldRules.programId && !validateProgramId(value)) {
        errors[field] = `프로그램 ID는 영문자, 숫자, 언더스코어만 사용 가능합니다.`;
        return;
      }

      // 메뉴 ID 검사
      if (fieldRules.menuId && !validateMenuId(value)) {
        errors[field] = `메뉴 ID는 영문자, 숫자, 언더스코어만 사용 가능합니다.`;
        return;
      }

      // Y/N 검사
      if (fieldRules.yn && !validateYN(value)) {
        errors[field] = `Y 또는 N만 입력 가능합니다.`;
        return;
      }

      // 커스텀 검사
      if (fieldRules.custom) {
        const customError = fieldRules.custom(value, data);
        if (customError) {
          errors[field] = customError;
          return;
        }
      }
    }
  });

  return errors;
} 