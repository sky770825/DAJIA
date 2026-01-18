// 测试 Supabase 连接和设置
// 运行: npx tsx test_supabase_connection.ts

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// 加载环境变量
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ 环境变量未配置');
  console.log('请检查 .env.local 文件');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSetup() {
  console.log('🔍 开始检查 Supabase 设置...\n');

  // 1. 检查表是否存在
  console.log('1. 检查表是否存在:');
  const tables = [
    'DAJIA_main_categories',
    'DAJIA_sub_categories',
    'DAJIA_products',
    'DAJIA_media',
  ];

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(`PRIVATE.${table}`)
        .select('id')
        .limit(1);

      if (error) {
        if (error.message.includes('does not exist')) {
          console.log(`   ❌ ${table} - 表不存在`);
        } else {
          console.log(`   ⚠️  ${table} - 错误: ${error.message}`);
        }
      } else {
        console.log(`   ✅ ${table} - 表存在`);
      }
    } catch (err: any) {
      console.log(`   ❌ ${table} - 连接失败: ${err.message}`);
    }
  }

  // 2. 检查主目录数据
  console.log('\n2. 检查主目录数据:');
  try {
    const { data, error } = await supabase
      .from('PRIVATE.DAJIA_main_categories')
      .select('*')
      .order('display_order');

    if (error) {
      console.log(`   ❌ 查询失败: ${error.message}`);
    } else {
      console.log(`   ✅ 找到 ${data?.length || 0} 个主目录`);
      if (data && data.length > 0) {
        data.forEach((cat: any) => {
          console.log(`      - ${cat.name} (${cat.slug})`);
        });
      }
    }
  } catch (err: any) {
    console.log(`   ❌ 查询失败: ${err.message}`);
  }

  // 3. 检查子目录数据
  console.log('\n3. 检查子目录数据:');
  try {
    const { data, error } = await supabase
      .from('PRIVATE.DAJIA_sub_categories')
      .select('*, main_category:DAJIA_main_categories(name)')
      .order('display_order');

    if (error) {
      console.log(`   ❌ 查询失败: ${error.message}`);
    } else {
      console.log(`   ✅ 找到 ${data?.length || 0} 个子目录`);
      if (data && data.length > 0) {
        data.forEach((cat: any) => {
          const mainName = cat.main_category?.name || '未知';
          console.log(`      - ${cat.name} (${cat.slug}) - 属于: ${mainName}`);
        });
      }
    }
  } catch (err: any) {
    console.log(`   ❌ 查询失败: ${err.message}`);
  }

  // 4. 检查产品表
  console.log('\n4. 检查产品表:');
  try {
    const { data, error } = await supabase
      .from('PRIVATE.DAJIA_products')
      .select('id, name')
      .limit(5);

    if (error) {
      console.log(`   ⚠️  查询失败: ${error.message}`);
    } else {
      console.log(`   ✅ 产品表可访问，当前有 ${data?.length || 0} 个产品`);
    }
  } catch (err: any) {
    console.log(`   ❌ 查询失败: ${err.message}`);
  }

  // 5. 检查媒体表
  console.log('\n5. 检查媒体表:');
  try {
    const { data, error } = await supabase
      .from('PRIVATE.DAJIA_media')
      .select('id, file_name')
      .limit(5);

    if (error) {
      console.log(`   ⚠️  查询失败: ${error.message}`);
    } else {
      console.log(`   ✅ 媒体表可访问，当前有 ${data?.length || 0} 个媒体文件`);
    }
  } catch (err: any) {
    console.log(`   ❌ 查询失败: ${err.message}`);
  }

  // 6. 检查 Storage
  console.log('\n6. 检查 Storage:');
  try {
    const { data, error } = await supabase.storage
      .from('product-images')
      .list('DAJIA', {
        limit: 1,
      });

    if (error) {
      if (error.message.includes('Bucket not found')) {
        console.log('   ❌ product-images bucket 不存在');
        console.log('   请到 Supabase Dashboard > Storage 创建 bucket');
      } else {
        console.log(`   ⚠️  Storage 错误: ${error.message}`);
      }
    } else {
      console.log('   ✅ product-images bucket 存在且可访问');
    }
  } catch (err: any) {
    console.log(`   ❌ Storage 检查失败: ${err.message}`);
  }

  // 7. 测试关联查询
  console.log('\n7. 测试关联查询:');
  try {
    const { data, error } = await supabase
      .from('PRIVATE.DAJIA_main_categories')
      .select(`
        *,
        sub_categories:DAJIA_sub_categories(*)
      `)
      .limit(1);

    if (error) {
      console.log(`   ⚠️  关联查询失败: ${error.message}`);
    } else {
      console.log('   ✅ 关联查询成功');
      if (data && data.length > 0) {
        const main = data[0];
        console.log(`      主目录: ${main.name}`);
        console.log(`      子目录数量: ${main.sub_categories?.length || 0}`);
      }
    }
  } catch (err: any) {
    console.log(`   ❌ 关联查询失败: ${err.message}`);
  }

  console.log('\n✅ 检查完成！');
}

checkSetup().catch(console.error);
