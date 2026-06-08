/**
 * flattenActions helper to bind class-based actions to the store
 */
export const flattenActions = <T>(actions: unknown[]): T => {
  const result: Record<string, unknown> = {};
  for (const action of actions) {
    if (!action) continue;
    const proto = Object.getPrototypeOf(action);
    const keys = [
      ...Object.getOwnPropertyNames(action),
      ...Object.getOwnPropertyNames(proto).filter((k) => k !== 'constructor'),
    ];

    for (const key of keys) {
      const value = (action as Record<string, unknown>)[key];
      if (typeof value === 'function') {
        result[key] = value.bind(action);
      } else if (key !== 'set' && key !== 'get') {
        result[key] = value;
      }
    }
  }
  return result as T;
};
