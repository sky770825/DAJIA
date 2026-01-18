import { supabase } from './supabase';

/**
 * 自動檢測表所在的 schema
 */
export const detectTableSchema = async (tableName: string): Promise<string | null> => {
  if (!supabase) return null;

  // 嘗試的 schema 順序
  const schemas = ['PRIVATE', 'public', 'DAJIA'];

  for (const schema of schemas) {
    try {
      const tablePath = schema === 'public' ? tableName : `${schema}.${tableName}`;
      const { error } = await supabase
        .from(tablePath)
        .select('id')
        .limit(1);

      if (!error) {
        return schema;
      }
    } catch (err) {
      // 繼續嘗試下一個 schema
      continue;
    }
  }

  return null;
};

/**
 * 獲取正確的表路徑
 */
export const getTablePath = (tableName: string, schema?: string): string => {
  if (schema && schema !== 'public') {
    return `${schema}.${tableName}`;
  }
  return tableName;
};
