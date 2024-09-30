export async function getOrCache(data: Record<string|number, any>, key: string|number, fn: any, fnParams: any) {
  if (data.hasOwnProperty(key)) {
    return data[key];
  }
  return data[key] = await fn(...fnParams);
}
