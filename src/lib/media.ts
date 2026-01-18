import { supabase } from './supabase';

export interface MediaUploadOptions {
  file: File;
  folder: string;
  mainCategoryId?: string;
  subCategoryId?: string;
  productId?: string;
  usageType: 'main_category' | 'sub_category' | 'product' | 'general';
  altText?: string;
  caption?: string;
}

export interface MediaRecord {
  id: string;
  file_name: string;
  file_path: string;
  file_url: string;
  file_type: string;
  file_size: number;
  width?: number;
  height?: number;
  alt_text?: string;
  caption?: string;
  main_category_id?: string;
  sub_category_id?: string;
  product_id?: string;
  usage_type: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

/**
 * 上傳圖片到 Supabase Storage
 */
export const uploadImageToStorage = async (
  file: File,
  folder: string = 'general'
): Promise<{ path: string; url: string }> => {
  if (!supabase) {
    throw new Error('Supabase 未配置');
  }

  // 生成唯一檔案名稱
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const fileExt = file.name.split('.').pop();
  const fileName = `${timestamp}-${randomStr}.${fileExt}`;
  const filePath = `DAJIA/${folder}/${fileName}`;

  // 上傳到 Storage（需要先創建 bucket: product-images）
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('上傳失敗:', error);
    throw new Error(`圖片上傳失敗: ${error.message}`);
  }

  // 獲取公開 URL
  const { data: urlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);

  return {
    path: filePath,
    url: urlData.publicUrl,
  };
};

/**
 * 獲取圖片尺寸
 */
const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.width,
        height: img.height,
      });
    };
    
    img.onerror = reject;
    img.src = url;
  });
};

/**
 * 保存圖片記錄到數據庫
 */
export const saveMediaRecord = async (options: MediaUploadOptions): Promise<MediaRecord> => {
  if (!supabase) {
    throw new Error('Supabase 未配置');
  }

  try {
    // 上傳圖片
    const { path, url } = await uploadImageToStorage(options.file, options.folder);

    // 獲取圖片尺寸
    let width: number | undefined;
    let height: number | undefined;
    if (options.file.type.startsWith('image/')) {
      try {
        const dimensions = await getImageDimensions(options.file);
        width = dimensions.width;
        height = dimensions.height;
      } catch (error) {
        console.warn('無法獲取圖片尺寸:', error);
      }
    }

    // 保存到數據庫
    const mediaData = {
      file_name: options.file.name,
      file_path: path,
      file_url: url,
      file_type: options.file.type,
      file_size: options.file.size,
      width,
      height,
      alt_text: options.altText || null,
      caption: options.caption || null,
      main_category_id: options.mainCategoryId || null,
      sub_category_id: options.subCategoryId || null,
      product_id: options.productId || null,
      usage_type: options.usageType,
      display_order: 0,
    };

    const { data, error } = await supabase
      .from('PRIVATE.DAJIA_media')
      .insert([mediaData])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as MediaRecord;
  } catch (error: any) {
    console.error('保存媒體記錄失敗:', error);
    throw new Error(`保存失敗: ${error.message}`);
  }
};

/**
 * 批量上傳圖片
 */
export const uploadMultipleImages = async (
  files: File[],
  options: Omit<MediaUploadOptions, 'file'>
): Promise<MediaRecord[]> => {
  const results: MediaRecord[] = [];

  for (let i = 0; i < files.length; i++) {
    try {
      const record = await saveMediaRecord({
        ...options,
        file: files[i],
      });
      results.push(record);
    } catch (error) {
      console.error(`上傳第 ${i + 1} 張圖片失敗:`, error);
      // 繼續上傳其他圖片
    }
  }

  return results;
};

/**
 * 查詢媒體記錄
 */
export const getMediaRecords = async (filters?: {
  mainCategoryId?: string;
  subCategoryId?: string;
  productId?: string;
  usageType?: string;
}): Promise<MediaRecord[]> => {
  if (!supabase) {
    throw new Error('Supabase 未配置');
  }

  let query = supabase
    .from('PRIVATE.DAJIA_media')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (filters?.mainCategoryId) {
    query = query.eq('main_category_id', filters.mainCategoryId);
  }

  if (filters?.subCategoryId) {
    query = query.eq('sub_category_id', filters.subCategoryId);
  }

  if (filters?.productId) {
    query = query.eq('product_id', filters.productId);
  }

  if (filters?.usageType) {
    query = query.eq('usage_type', filters.usageType);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`查詢失敗: ${error.message}`);
  }

  return (data || []) as MediaRecord[];
};

/**
 * 刪除媒體記錄和文件
 */
export const deleteMedia = async (mediaId: string): Promise<void> => {
  if (!supabase) {
    throw new Error('Supabase 未配置');
  }

  // 先獲取媒體記錄
  const { data: media, error: fetchError } = await supabase
    .from('PRIVATE.DAJIA_media')
    .select('file_path')
    .eq('id', mediaId)
    .single();

  if (fetchError || !media) {
    throw new Error('找不到媒體記錄');
  }

  // 刪除 Storage 中的文件
  const { error: storageError } = await supabase.storage
    .from('product-images')
    .remove([media.file_path]);

  if (storageError) {
    console.warn('刪除 Storage 文件失敗:', storageError);
    // 繼續刪除數據庫記錄
  }

  // 刪除數據庫記錄
  const { error: deleteError } = await supabase
    .from('PRIVATE.DAJIA_media')
    .delete()
    .eq('id', mediaId);

  if (deleteError) {
    throw new Error(`刪除失敗: ${deleteError.message}`);
  }
};
