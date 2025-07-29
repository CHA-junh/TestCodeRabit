import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * CSS ?�래?�들??병합?�는 ?�틸리티 ?�수
 * @param inputs ?�래??값들
 * @returns 병합???�래??문자??
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * ?�짜�??�맷?�합?�다.
 * @param date ?�짜 객체 ?�는 문자??
 * @param format ?�맷 문자??(기본�? 'YYYY-MM-DD')
 * @returns ?�맷???�짜 문자??
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
 * ?�자�?�??�위�??�맷?�합?�다.
 * @param num ?�맷?�할 ?�자
 * @returns ?�맷??문자??
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * 문자?�을 ?�전?�게 HTML�??�스케?�프?�니??
 * @param str ?�스케?�프??문자??
 * @returns ?�스케?�프??문자??
 */
export function escapeHtml(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * 객체??깊�? 복사�??�행?�니??
 * @param obj 복사??객체
 * @returns 복사??객체
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
 * ?�바?�스 ?�수�??�성?�니??
 * @param func ?�행???�수
 * @param delay 지???�간 (ms)
 * @returns ?�바?�스???�수
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
 * ?�로?� ?�수�??�성?�니??
 * @param func ?�행???�수
 * @param delay 지???�간 (ms)
 * @returns ?�로?�???�수
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
 * 로컬 ?�토리�????�이?��? ?�?�합?�다.
 * @param key ??
 * @param value ?�?�할 �?
 */
export function setLocalStorage(key: string, value: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('로컬 ?�토리�? ?�???�패:', error);
  }
}

/**
 * 로컬 ?�토리�??�서 ?�이?��? 가?�옵?�다.
 * @param key ??
 * @param defaultValue 기본�?
 * @returns ?�?�된 �??�는 기본�?
 */
export function getLocalStorage<T>(key: string, defaultValue?: T): T | null {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue || null;
  } catch (error) {
    console.error('로컬 ?�토리�? ?�기 ?�패:', error);
    return defaultValue || null;
  }
}

/**
 * 로컬 ?�토리�??�서 ?�이?��? ??��?�니??
 * @param key ??
 */
export function removeLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('로컬 ?�토리�? ??�� ?�패:', error);
  }
}

/**
 * ?�션 ?�토리�????�이?��? ?�?�합?�다.
 * @param key ??
 * @param value ?�?�할 �?
 */
export function setSessionStorage(key: string, value: any): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('?�션 ?�토리�? ?�???�패:', error);
  }
}

/**
 * ?�션 ?�토리�??�서 ?�이?��? 가?�옵?�다.
 * @param key ??
 * @param defaultValue 기본�?
 * @returns ?�?�된 �??�는 기본�?
 */
export function getSessionStorage<T>(key: string, defaultValue?: T): T | null {
  try {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue || null;
  } catch (error) {
    console.error('?�션 ?�토리�? ?�기 ?�패:', error);
    return defaultValue || null;
  }
}

/**
 * ?�션 ?�토리�??�서 ?�이?��? ??��?�니??
 * @param key ??
 */
export function removeSessionStorage(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error('?�션 ?�토리�? ??�� ?�패:', error);
  }
} 

