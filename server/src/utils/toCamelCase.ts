/**
 * snake_case, UPPER_CASE, PascalCase ??ëª¨ë“  ê°ì²´ keyë¥?camelCaseë¡?ë³€??(?¬ê? ì§€??
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


