/**
 * 删除对象中的字符串首尾空格
 * @param obj 要处理的对象
 * @returns 处理后的对象
 */
export default function trim(obj: any) {
  if (typeof obj === 'string') {
    return obj.trim();
  }
  if (typeof obj === 'object' && obj !== null) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        obj[key] = trim(obj[key]);
      }
    }
  }
  return obj;
}
