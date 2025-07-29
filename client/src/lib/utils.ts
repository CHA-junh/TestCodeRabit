import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * CSS 클래스들을 병합하는 유틸리티 함수
 * @param inputs 클래스 값들
 * @returns 병합된 클래스 문자열
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 날짜를 포맷팅합니다.
 * @param date 날짜 객체 또는 문자열
 * @param format 포맷 문자열 (기본값: 'YYYY-MM-DD')
 * @returns 포맷된 날짜 문자열
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
 * 숫자를 천 단위로 포맷팅합니다.
 * @param num 포맷팅할 숫자
 * @returns 포맷된 문자열
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * 문자열을 안전하게 HTML로 이스케이프합니다.
 * @param str 이스케이프할 문자열
 * @returns 이스케이프된 문자열
 */
export function escapeHtml(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * 객체의 깊은 복사를 수행합니다.
 * @param obj 복사할 객체
 * @returns 복사된 객체
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
 * 디바운스 함수를 생성합니다.
 * @param func 실행할 함수
 * @param delay 지연 시간 (ms)
 * @returns 디바운스된 함수
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
 * 쓰로틀 함수를 생성합니다.
 * @param func 실행할 함수
 * @param delay 지연 시간 (ms)
 * @returns 쓰로틀된 함수
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
 * 로컬 스토리지에 데이터를 저장합니다.
 * @param key 키
 * @param value 저장할 값
 */
export function setLocalStorage(key: string, value: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('로컬 스토리지 저장 실패:', error);
  }
}

/**
 * 로컬 스토리지에서 데이터를 가져옵니다.
 * @param key 키
 * @param defaultValue 기본값
 * @returns 저장된 값 또는 기본값
 */
export function getLocalStorage<T>(key: string, defaultValue?: T): T | null {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue || null;
  } catch (error) {
    console.error('로컬 스토리지 읽기 실패:', error);
    return defaultValue || null;
  }
}

/**
 * 로컬 스토리지에서 데이터를 삭제합니다.
 * @param key 키
 */
export function removeLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('로컬 스토리지 삭제 실패:', error);
  }
}

/**
 * 세션 스토리지에 데이터를 저장합니다.
 * @param key 키
 * @param value 저장할 값
 */
export function setSessionStorage(key: string, value: any): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('세션 스토리지 저장 실패:', error);
  }
}

/**
 * 세션 스토리지에서 데이터를 가져옵니다.
 * @param key 키
 * @param defaultValue 기본값
 * @returns 저장된 값 또는 기본값
 */
export function getSessionStorage<T>(key: string, defaultValue?: T): T | null {
  try {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue || null;
  } catch (error) {
    console.error('세션 스토리지 읽기 실패:', error);
    return defaultValue || null;
  }
}

/**
 * 세션 스토리지에서 데이터를 삭제합니다.
 * @param key 키
 */
export function removeSessionStorage(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error('세션 스토리지 삭제 실패:', error);
  }
} 