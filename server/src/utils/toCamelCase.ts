/**
 * snake_case, UPPER_CASE, PascalCase 등 모든 객체 key를 camelCase로 변환 (재귀 지원)
 */
export function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const camelKey = key
        .toLowerCase()
        .replace(/([-_][a-z])/g, (group) =>
          group.toUpperCase().replace('-', '').replace('_', ''),
        );
      acc[camelKey] = toCamelCase(value);
      return acc;
    }, {} as any);
  }
  return obj;
}
