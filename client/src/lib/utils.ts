import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * CSS ?´ë˜?¤ë“¤??ë³‘í•©?˜ëŠ” ? í‹¸ë¦¬í‹° ?¨ìˆ˜
 * @param inputs ?´ë˜??ê°’ë“¤
 * @returns ë³‘í•©???´ë˜??ë¬¸ì??
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * ? ì§œë¥??¬ë§·?…í•©?ˆë‹¤.
 * @param date ? ì§œ ê°ì²´ ?ëŠ” ë¬¸ì??
 * @param format ?¬ë§· ë¬¸ì??(ê¸°ë³¸ê°? 'YYYY-MM-DD')
 * @returns ?¬ë§·??? ì§œ ë¬¸ì??
 */
export function formatDate(date: Date | string, format: string = 'YYYY-MM-DD'): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * ?«ìë¥?ì²??¨ìœ„ë¡??¬ë§·?…í•©?ˆë‹¤.
 * @param num ?¬ë§·?…í•  ?«ì
 * @returns ?¬ë§·??ë¬¸ì??
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * ë¬¸ì?´ì„ ?ˆì „?˜ê²Œ HTMLë¡??´ìŠ¤ì¼€?´í”„?©ë‹ˆ??
 * @param str ?´ìŠ¤ì¼€?´í”„??ë¬¸ì??
 * @returns ?´ìŠ¤ì¼€?´í”„??ë¬¸ì??
 */
export function escapeHtml(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * ê°ì²´??ê¹Šì? ë³µì‚¬ë¥??˜í–‰?©ë‹ˆ??
 * @param obj ë³µì‚¬??ê°ì²´
 * @returns ë³µì‚¬??ê°ì²´
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as T;
  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}

/**
 * ?”ë°”?´ìŠ¤ ?¨ìˆ˜ë¥??ì„±?©ë‹ˆ??
 * @param func ?¤í–‰???¨ìˆ˜
 * @param delay ì§€???œê°„ (ms)
 * @returns ?”ë°”?´ìŠ¤???¨ìˆ˜
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * ?°ë¡œ?€ ?¨ìˆ˜ë¥??ì„±?©ë‹ˆ??
 * @param func ?¤í–‰???¨ìˆ˜
 * @param delay ì§€???œê°„ (ms)
 * @returns ?°ë¡œ?€???¨ìˆ˜
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

/**
 * ë¡œì»¬ ?¤í† ë¦¬ì????°ì´?°ë? ?€?¥í•©?ˆë‹¤.
 * @param key ??
 * @param value ?€?¥í•  ê°?
 */
export function setLocalStorage(key: string, value: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('ë¡œì»¬ ?¤í† ë¦¬ì? ?€???¤íŒ¨:', error);
  }
}

/**
 * ë¡œì»¬ ?¤í† ë¦¬ì??ì„œ ?°ì´?°ë? ê°€?¸ì˜µ?ˆë‹¤.
 * @param key ??
 * @param defaultValue ê¸°ë³¸ê°?
 * @returns ?€?¥ëœ ê°??ëŠ” ê¸°ë³¸ê°?
 */
export function getLocalStorage<T>(key: string, defaultValue?: T): T | null {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue || null;
  } catch (error) {
    console.error('ë¡œì»¬ ?¤í† ë¦¬ì? ?½ê¸° ?¤íŒ¨:', error);
    return defaultValue || null;
  }
}

/**
 * ë¡œì»¬ ?¤í† ë¦¬ì??ì„œ ?°ì´?°ë? ?? œ?©ë‹ˆ??
 * @param key ??
 */
export function removeLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('ë¡œì»¬ ?¤í† ë¦¬ì? ?? œ ?¤íŒ¨:', error);
  }
}

/**
 * ?¸ì…˜ ?¤í† ë¦¬ì????°ì´?°ë? ?€?¥í•©?ˆë‹¤.
 * @param key ??
 * @param value ?€?¥í•  ê°?
 */
export function setSessionStorage(key: string, value: any): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('?¸ì…˜ ?¤í† ë¦¬ì? ?€???¤íŒ¨:', error);
  }
}

/**
 * ?¸ì…˜ ?¤í† ë¦¬ì??ì„œ ?°ì´?°ë? ê°€?¸ì˜µ?ˆë‹¤.
 * @param key ??
 * @param defaultValue ê¸°ë³¸ê°?
 * @returns ?€?¥ëœ ê°??ëŠ” ê¸°ë³¸ê°?
 */
export function getSessionStorage<T>(key: string, defaultValue?: T): T | null {
  try {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue || null;
  } catch (error) {
    console.error('?¸ì…˜ ?¤í† ë¦¬ì? ?½ê¸° ?¤íŒ¨:', error);
    return defaultValue || null;
  }
}

/**
 * ?¸ì…˜ ?¤í† ë¦¬ì??ì„œ ?°ì´?°ë? ?? œ?©ë‹ˆ??
 * @param key ??
 */
export function removeSessionStorage(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error('?¸ì…˜ ?¤í† ë¦¬ì? ?? œ ?¤íŒ¨:', error);
  }
} 

