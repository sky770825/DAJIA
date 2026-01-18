import { supabase } from './supabase';

export interface MainCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubCategory {
  id: string;
  main_category_id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  main_category?: MainCategory;
}

/**
 * 獲取所有主目錄
 */
export const getMainCategories = async (activeOnly: boolean = true): Promise<MainCategory[]> => {
  if (!supabase) {
    throw new Error('Supabase 未配置');
  }

  let query = supabase
    .from('PRIVATE.DAJIA_main_categories')
    .select('*')
    .order('display_order', { ascending: true });

  if (activeOnly) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`查詢失敗: ${error.message}`);
  }

  return (data || []) as MainCategory[];
};

/**
 * 獲取主目錄及其子目錄
 */
export const getMainCategoryWithSubs = async (
  mainCategorySlug: string
): Promise<MainCategory & { sub_categories: SubCategory[] } | null> => {
  if (!supabase) {
    throw new Error('Supabase 未配置');
  }

  // 獲取主目錄
  const { data: mainCategory, error: mainError } = await supabase
    .from('PRIVATE.DAJIA_main_categories')
    .select('*')
    .eq('slug', mainCategorySlug)
    .eq('is_active', true)
    .single();

  if (mainError || !mainCategory) {
    return null;
  }

  // 獲取子目錄
  const { data: subCategories, error: subError } = await supabase
    .from('PRIVATE.DAJIA_sub_categories')
    .select('*')
    .eq('main_category_id', mainCategory.id)
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (subError) {
    console.error('查詢子目錄失敗:', subError);
  }

  return {
    ...(mainCategory as MainCategory),
    sub_categories: (subCategories || []) as SubCategory[],
  };
};

/**
 * 獲取所有子目錄
 */
export const getSubCategories = async (
  mainCategoryId?: string,
  activeOnly: boolean = true
): Promise<SubCategory[]> => {
  if (!supabase) {
    throw new Error('Supabase 未配置');
  }

  let query = supabase
    .from('PRIVATE.DAJIA_sub_categories')
    .select('*, main_category:DAJIA_main_categories(*)')
    .order('display_order', { ascending: true });

  if (mainCategoryId) {
    query = query.eq('main_category_id', mainCategoryId);
  }

  if (activeOnly) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`查詢失敗: ${error.message}`);
  }

  return (data || []) as SubCategory[];
};

/**
 * 創建主目錄
 */
export const createMainCategory = async (
  category: Omit<MainCategory, 'id' | 'created_at' | 'updated_at'>
): Promise<MainCategory> => {
  if (!supabase) {
    throw new Error('Supabase 未配置');
  }

  const { data, error } = await supabase
    .from('PRIVATE.DAJIA_main_categories')
    .insert([category])
    .select()
    .single();

  if (error) {
    throw new Error(`創建失敗: ${error.message}`);
  }

  return data as MainCategory;
};

/**
 * 創建子目錄
 */
export const createSubCategory = async (
  category: Omit<SubCategory, 'id' | 'created_at' | 'updated_at' | 'main_category'>
): Promise<SubCategory> => {
  if (!supabase) {
    throw new Error('Supabase 未配置');
  }

  const { data, error } = await supabase
    .from('PRIVATE.DAJIA_sub_categories')
    .insert([category])
    .select()
    .single();

  if (error) {
    throw new Error(`創建失敗: ${error.message}`);
  }

  return data as SubCategory;
};

/**
 * 更新主目錄
 */
export const updateMainCategory = async (
  id: string,
  updates: Partial<MainCategory>
): Promise<MainCategory> => {
  if (!supabase) {
    throw new Error('Supabase 未配置');
  }

  const { data, error } = await supabase
    .from('PRIVATE.DAJIA_main_categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`更新失敗: ${error.message}`);
  }

  return data as MainCategory;
};

/**
 * 更新子目錄
 */
export const updateSubCategory = async (
  id: string,
  updates: Partial<SubCategory>
): Promise<SubCategory> => {
  if (!supabase) {
    throw new Error('Supabase 未配置');
  }

  const { data, error } = await supabase
    .from('PRIVATE.DAJIA_sub_categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`更新失敗: ${error.message}`);
  }

  return data as SubCategory;
};
