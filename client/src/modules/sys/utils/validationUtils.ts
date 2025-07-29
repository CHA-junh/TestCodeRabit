/**
 * ?�수 ?�드가 비어?�는지 ?�인?�니??
 * @param value 검?�할 �?
 * @returns 비어?�으�?true, ?�니�?false
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

/**
 * 문자??길이�?검?�합?�다.
 * @param value 검?�할 문자??
 * @param min 최소 길이
 * @param max 최�? 길이
 * @returns ?�효??검??결과
 */
export function validateStringLength(value: string, min?: number, max?: number): boolean {
  if (isEmpty(value)) return false;
  
  const length = value.trim().length;
  
  if (min !== undefined && length < min) return false;
  if (max !== undefined && length > max) return false;
  
  return true;
}

/**
 * ?�메???�식??검?�합?�다.
 * @param email 검?�할 ?�메??
 * @returns ?�효??검??결과
 */
export function validateEmail(email: string): boolean {
  if (isEmpty(email)) return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * ?�자 ?�식??검?�합?�다.
 * @param value 검?�할 �?
 * @returns ?�효??검??결과
 */
export function validateNumber(value: any): boolean {
  if (isEmpty(value)) return false;
  
  const num = Number(value);
  return !isNaN(num) && isFinite(num);
}

/**
 * ?�수 ?�식??검?�합?�다.
 * @param value 검?�할 �?
 * @returns ?�효??검??결과
 */
export function validateInteger(value: any): boolean {
  if (isEmpty(value)) return false;
  
  const num = Number(value);
  return !isNaN(num) && isFinite(num) && Number.isInteger(num);
}

/**
 * ?�짜 ?�식??검?�합?�다.
 * @param date 검?�할 ?�짜 문자??
 * @returns ?�효??검??결과
 */
export function validateDate(date: string): boolean {
  if (isEmpty(date)) return false;
  
  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime());
}

/**
 * ?�로그램 ID ?�식??검?�합?�다.
 * @param pgmId 검?�할 ?�로그램 ID
 * @returns ?�효??검??결과
 */
export function validateProgramId(pgmId: string): boolean {
  if (isEmpty(pgmId)) return false;
  
  // ?�로그램 ID???�문?? ?�자, ?�더?�코?�만 ?�용
  const pgmIdRegex = /^[A-Za-z0-9_]+$/;
  return pgmIdRegex.test(pgmId);
}

/**
 * 메뉴 ID ?�식??검?�합?�다.
 * @param menuId 검?�할 메뉴 ID
 * @returns ?�효??검??결과
 */
export function validateMenuId(menuId: string): boolean {
  if (isEmpty(menuId)) return false;
  
  // 메뉴 ID???�문?? ?�자, ?�더?�코?�만 ?�용
  const menuIdRegex = /^[A-Za-z0-9_]+$/;
  return menuIdRegex.test(menuId);
}

/**
 * Y/N 값인지 검?�합?�다.
 * @param value 검?�할 �?
 * @returns ?�효??검??결과
 */
export function validateYN(value: string): boolean {
  if (isEmpty(value)) return false;
  
  return value.toUpperCase() === 'Y' || value.toUpperCase() === 'N';
}

/**
 * ???�이?�의 ?�효?�을 검?�합?�다.
 * @param data 검?�할 ?�이??객체
 * @param rules 검??규칙 객체
 * @returns 검??결과 객체
 */
export function validateFormData(data: Record<string, any>, rules: Record<string, any>): Record<string, string> {
  const errors: Record<string, string> = {};

  Object.keys(rules).forEach(field => {
    const value = data[field];
    const fieldRules = rules[field];

    // ?�수 ?�드 검??
    if (fieldRules.required && isEmpty(value)) {
      errors[field] = `${fieldRules.label || field}?�(?? ?�수?�니??`;
      return;
    }

    // 값이 ?�는 경우?�만 추�? 검??
    if (!isEmpty(value)) {
      // 문자??길이 검??
      if (fieldRules.minLength && !validateStringLength(value, fieldRules.minLength)) {
        errors[field] = `${fieldRules.label || field}?�(?? 최소 ${fieldRules.minLength}???�상?�어???�니??`;
        return;
      }

      if (fieldRules.maxLength && !validateStringLength(value, undefined, fieldRules.maxLength)) {
        errors[field] = `${fieldRules.label || field}?�(?? 최�? ${fieldRules.maxLength}?�까지 ?�력 가?�합?�다.`;
        return;
      }

      // ?�메??검??
      if (fieldRules.email && !validateEmail(value)) {
        errors[field] = `?�바�??�메???�식???�력?�주?�요.`;
        return;
      }

      // ?�자 검??
      if (fieldRules.number && !validateNumber(value)) {
        errors[field] = `?�자�??�력 가?�합?�다.`;
        return;
      }

      // ?�수 검??
      if (fieldRules.integer && !validateInteger(value)) {
        errors[field] = `?�수�??�력 가?�합?�다.`;
        return;
      }

      // ?�짜 검??
      if (fieldRules.date && !validateDate(value)) {
        errors[field] = `?�바�??�짜 ?�식???�력?�주?�요.`;
        return;
      }

      // ?�로그램 ID 검??
      if (fieldRules.programId && !validateProgramId(value)) {
        errors[field] = `?�로그램 ID???�문?? ?�자, ?�더?�코?�만 ?�용 가?�합?�다.`;
        return;
      }

      // 메뉴 ID 검??
      if (fieldRules.menuId && !validateMenuId(value)) {
        errors[field] = `메뉴 ID???�문?? ?�자, ?�더?�코?�만 ?�용 가?�합?�다.`;
        return;
      }

      // Y/N 검??
      if (fieldRules.yn && !validateYN(value)) {
        errors[field] = `Y ?�는 N�??�력 가?�합?�다.`;
        return;
      }

      // 커스?� 검??
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


