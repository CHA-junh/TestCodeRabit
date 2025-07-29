/**
 * ?„ìˆ˜ ?„ë“œê°€ ë¹„ì–´?ˆëŠ”ì§€ ?•ì¸?©ë‹ˆ??
 * @param value ê²€?¬í•  ê°?
 * @returns ë¹„ì–´?ˆìœ¼ë©?true, ?„ë‹ˆë©?false
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

/**
 * ë¬¸ì??ê¸¸ì´ë¥?ê²€?¬í•©?ˆë‹¤.
 * @param value ê²€?¬í•  ë¬¸ì??
 * @param min ìµœì†Œ ê¸¸ì´
 * @param max ìµœë? ê¸¸ì´
 * @returns ? íš¨??ê²€??ê²°ê³¼
 */
export function validateStringLength(value: string, min?: number, max?: number): boolean {
  if (isEmpty(value)) return false;
  
  const length = value.trim().length;
  
  if (min !== undefined && length < min) return false;
  if (max !== undefined && length > max) return false;
  
  return true;
}

/**
 * ?´ë©”???•ì‹??ê²€?¬í•©?ˆë‹¤.
 * @param email ê²€?¬í•  ?´ë©”??
 * @returns ? íš¨??ê²€??ê²°ê³¼
 */
export function validateEmail(email: string): boolean {
  if (isEmpty(email)) return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * ?«ì ?•ì‹??ê²€?¬í•©?ˆë‹¤.
 * @param value ê²€?¬í•  ê°?
 * @returns ? íš¨??ê²€??ê²°ê³¼
 */
export function validateNumber(value: any): boolean {
  if (isEmpty(value)) return false;
  
  const num = Number(value);
  return !isNaN(num) && isFinite(num);
}

/**
 * ?•ìˆ˜ ?•ì‹??ê²€?¬í•©?ˆë‹¤.
 * @param value ê²€?¬í•  ê°?
 * @returns ? íš¨??ê²€??ê²°ê³¼
 */
export function validateInteger(value: any): boolean {
  if (isEmpty(value)) return false;
  
  const num = Number(value);
  return !isNaN(num) && isFinite(num) && Number.isInteger(num);
}

/**
 * ? ì§œ ?•ì‹??ê²€?¬í•©?ˆë‹¤.
 * @param date ê²€?¬í•  ? ì§œ ë¬¸ì??
 * @returns ? íš¨??ê²€??ê²°ê³¼
 */
export function validateDate(date: string): boolean {
  if (isEmpty(date)) return false;
  
  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime());
}

/**
 * ?„ë¡œê·¸ë¨ ID ?•ì‹??ê²€?¬í•©?ˆë‹¤.
 * @param pgmId ê²€?¬í•  ?„ë¡œê·¸ë¨ ID
 * @returns ? íš¨??ê²€??ê²°ê³¼
 */
export function validateProgramId(pgmId: string): boolean {
  if (isEmpty(pgmId)) return false;
  
  // ?„ë¡œê·¸ë¨ ID???ë¬¸?? ?«ì, ?¸ë”?¤ì½”?´ë§Œ ?ˆìš©
  const pgmIdRegex = /^[A-Za-z0-9_]+$/;
  return pgmIdRegex.test(pgmId);
}

/**
 * ë©”ë‰´ ID ?•ì‹??ê²€?¬í•©?ˆë‹¤.
 * @param menuId ê²€?¬í•  ë©”ë‰´ ID
 * @returns ? íš¨??ê²€??ê²°ê³¼
 */
export function validateMenuId(menuId: string): boolean {
  if (isEmpty(menuId)) return false;
  
  // ë©”ë‰´ ID???ë¬¸?? ?«ì, ?¸ë”?¤ì½”?´ë§Œ ?ˆìš©
  const menuIdRegex = /^[A-Za-z0-9_]+$/;
  return menuIdRegex.test(menuId);
}

/**
 * Y/N ê°’ì¸ì§€ ê²€?¬í•©?ˆë‹¤.
 * @param value ê²€?¬í•  ê°?
 * @returns ? íš¨??ê²€??ê²°ê³¼
 */
export function validateYN(value: string): boolean {
  if (isEmpty(value)) return false;
  
  return value.toUpperCase() === 'Y' || value.toUpperCase() === 'N';
}

/**
 * ???°ì´?°ì˜ ? íš¨?±ì„ ê²€?¬í•©?ˆë‹¤.
 * @param data ê²€?¬í•  ?°ì´??ê°ì²´
 * @param rules ê²€??ê·œì¹™ ê°ì²´
 * @returns ê²€??ê²°ê³¼ ê°ì²´
 */
export function validateFormData(data: Record<string, any>, rules: Record<string, any>): Record<string, string> {
  const errors: Record<string, string> = {};

  Object.keys(rules).forEach(field => {
    const value = data[field];
    const fieldRules = rules[field];

    // ?„ìˆ˜ ?„ë“œ ê²€??
    if (fieldRules.required && isEmpty(value)) {
      errors[field] = `${fieldRules.label || field}?€(?? ?„ìˆ˜?…ë‹ˆ??`;
      return;
    }

    // ê°’ì´ ?ˆëŠ” ê²½ìš°?ë§Œ ì¶”ê? ê²€??
    if (!isEmpty(value)) {
      // ë¬¸ì??ê¸¸ì´ ê²€??
      if (fieldRules.minLength && !validateStringLength(value, fieldRules.minLength)) {
        errors[field] = `${fieldRules.label || field}?€(?? ìµœì†Œ ${fieldRules.minLength}???´ìƒ?´ì–´???©ë‹ˆ??`;
        return;
      }

      if (fieldRules.maxLength && !validateStringLength(value, undefined, fieldRules.maxLength)) {
        errors[field] = `${fieldRules.label || field}?€(?? ìµœë? ${fieldRules.maxLength}?ê¹Œì§€ ?…ë ¥ ê°€?¥í•©?ˆë‹¤.`;
        return;
      }

      // ?´ë©”??ê²€??
      if (fieldRules.email && !validateEmail(value)) {
        errors[field] = `?¬ë°”ë¥??´ë©”???•ì‹???…ë ¥?´ì£¼?¸ìš”.`;
        return;
      }

      // ?«ì ê²€??
      if (fieldRules.number && !validateNumber(value)) {
        errors[field] = `?«ìë§??…ë ¥ ê°€?¥í•©?ˆë‹¤.`;
        return;
      }

      // ?•ìˆ˜ ê²€??
      if (fieldRules.integer && !validateInteger(value)) {
        errors[field] = `?•ìˆ˜ë§??…ë ¥ ê°€?¥í•©?ˆë‹¤.`;
        return;
      }

      // ? ì§œ ê²€??
      if (fieldRules.date && !validateDate(value)) {
        errors[field] = `?¬ë°”ë¥?? ì§œ ?•ì‹???…ë ¥?´ì£¼?¸ìš”.`;
        return;
      }

      // ?„ë¡œê·¸ë¨ ID ê²€??
      if (fieldRules.programId && !validateProgramId(value)) {
        errors[field] = `?„ë¡œê·¸ë¨ ID???ë¬¸?? ?«ì, ?¸ë”?¤ì½”?´ë§Œ ?¬ìš© ê°€?¥í•©?ˆë‹¤.`;
        return;
      }

      // ë©”ë‰´ ID ê²€??
      if (fieldRules.menuId && !validateMenuId(value)) {
        errors[field] = `ë©”ë‰´ ID???ë¬¸?? ?«ì, ?¸ë”?¤ì½”?´ë§Œ ?¬ìš© ê°€?¥í•©?ˆë‹¤.`;
        return;
      }

      // Y/N ê²€??
      if (fieldRules.yn && !validateYN(value)) {
        errors[field] = `Y ?ëŠ” Në§??…ë ¥ ê°€?¥í•©?ˆë‹¤.`;
        return;
      }

      // ì»¤ìŠ¤?€ ê²€??
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


