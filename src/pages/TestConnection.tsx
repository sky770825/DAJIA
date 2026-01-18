import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, Loader2, AlertCircle, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CheckResult {
  name: string;
  status: 'checking' | 'success' | 'error' | 'warning';
  message: string;
  details?: any;
  action?: string;
}

const TestConnectionPage = () => {
  const [results, setResults] = useState<CheckResult[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const checkSetup = async () => {
    setIsChecking(true);
    const newResults: CheckResult[] = [];

    // 1. 检查 Supabase 连接
    newResults.push({
      name: 'Supabase 连接',
      status: 'checking',
      message: '正在检查...',
    });
    setResults([...newResults]);

    if (!supabase) {
      newResults[0] = {
        name: 'Supabase 连接',
        status: 'error',
        message: 'Supabase 未配置，请检查环境变量',
        action: '检查 .env.local 文件',
      };
      setResults([...newResults]);
      setIsChecking(false);
      return;
    }

    newResults[0] = {
      name: 'Supabase 连接',
      status: 'success',
      message: '连接成功',
    };
    setResults([...newResults]);

    // 2. 检查表是否存在（尝试多个可能的 schema）
    const tables = [
      { name: 'DAJIA_main_categories', display: '主目录表' },
      { name: 'DAJIA_sub_categories', display: '子目录表' },
      { name: 'DAJIA_products', display: '产品表' },
      { name: 'DAJIA_media', display: '媒体表' },
    ];

    const possibleSchemas = ['PRIVATE', 'public', 'DAJIA'];
    let foundSchema: string | null = null;

    for (const table of tables) {
      const index = newResults.length;
      newResults.push({
        name: table.display,
        status: 'checking',
        message: '正在检查...',
      });
      setResults([...newResults]);

      let tableFound = false;
      let foundPath = '';

      // 尝试不同的 schema
      for (const schema of possibleSchemas) {
        try {
          const tablePath = schema === 'public' ? table.name : `${schema}.${table.name}`;
          const { data, error } = await supabase
            .from(tablePath)
            .select('id')
            .limit(1);

          if (!error) {
            tableFound = true;
            foundPath = tablePath;
            if (!foundSchema) {
              foundSchema = schema;
            }
            break;
          }
        } catch (err) {
          // 继续尝试下一个 schema
          continue;
        }
      }

      if (tableFound) {
        newResults[index] = {
          name: table.display,
          status: 'success',
          message: `表存在且可访问 (${foundPath})`,
        };
      } else {
        newResults[index] = {
          name: table.display,
          status: 'error',
          message: '表不存在',
          action: '请执行 supabase_setup_categories.sql 创建表',
        };
      }
      setResults([...newResults]);
    }

    // 3. 如果找到 schema，检查数据
    if (foundSchema) {
      // 检查主目录数据
      const mainCatIndex = newResults.length;
      newResults.push({
        name: '主目录数据',
        status: 'checking',
        message: '正在检查...',
      });
      setResults([...newResults]);

      try {
        const tablePath = foundSchema === 'public' 
          ? 'DAJIA_main_categories' 
          : `${foundSchema}.DAJIA_main_categories`;
        
        const { data, error } = await supabase
          .from(tablePath)
          .select('*')
          .order('display_order');

        if (error) {
          newResults[mainCatIndex] = {
            name: '主目录数据',
            status: 'error',
            message: `查询失败: ${error.message}`,
            details: error,
          };
        } else {
          const count = data?.length || 0;
          newResults[mainCatIndex] = {
            name: '主目录数据',
            status: count > 0 ? 'success' : 'warning',
            message: `找到 ${count} 个主目录`,
            details: data,
          };
        }
        setResults([...newResults]);
      } catch (err: any) {
        newResults[mainCatIndex] = {
          name: '主目录数据',
          status: 'error',
          message: `查询失败: ${err.message}`,
          details: err,
        };
        setResults([...newResults]);
      }
    } else {
      newResults.push({
        name: '数据检查',
        status: 'warning',
        message: '无法检查数据，因为表不存在',
        action: '请先执行 SQL 创建表',
      });
      setResults([...newResults]);
    }

    // 4. 检查 Storage
    const storageIndex = newResults.length;
    newResults.push({
      name: 'Storage Bucket',
      status: 'checking',
      message: '正在检查...',
    });
    setResults([...newResults]);

    try {
      const { data, error } = await supabase.storage
        .from('product-images')
        .list('DAJIA', {
          limit: 1,
        });

      if (error) {
        if (error.message.includes('Bucket not found') || error.message.includes('not found')) {
          newResults[storageIndex] = {
            name: 'Storage Bucket',
            status: 'error',
            message: 'product-images bucket 不存在',
            action: '请在 Supabase Dashboard > Storage 中创建 bucket',
          };
        } else {
          newResults[storageIndex] = {
            name: 'Storage Bucket',
            status: 'warning',
            message: `Storage 错误: ${error.message}`,
            details: error,
          };
        }
      } else {
        newResults[storageIndex] = {
          name: 'Storage Bucket',
          status: 'success',
          message: 'product-images bucket 存在且可访问',
        };
      }
      setResults([...newResults]);
    } catch (err: any) {
      newResults[storageIndex] = {
        name: 'Storage Bucket',
        status: 'error',
        message: `Storage 检查失败: ${err.message}`,
        details: err,
      };
      setResults([...newResults]);
    }

    setIsChecking(false);
  };

  useEffect(() => {
    checkSetup();
  }, []);

  const getStatusIcon = (status: CheckResult['status']) => {
    switch (status) {
      case 'checking':
        return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: CheckResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500">成功</Badge>;
      case 'error':
        return <Badge variant="destructive">错误</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500">警告</Badge>;
      case 'checking':
        return <Badge variant="outline">检查中</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Supabase 设置检查</CardTitle>
          <CardDescription>
            自动检查数据库表、数据、关联关系和 Storage 设置
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.map((result, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getStatusIcon(result.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{result.name}</h3>
                          {getStatusBadge(result.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">{result.message}</p>
                        {result.action && (
                          <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                            <div className="flex items-start gap-2">
                              <FileText className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                <strong>需要操作：</strong> {result.action}
                              </p>
                            </div>
                          </div>
                        )}
                        {result.details && result.status !== 'checking' && (
                          <details className="mt-2">
                            <summary className="text-xs text-muted-foreground cursor-pointer">
                              查看详情
                            </summary>
                            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                              {JSON.stringify(result.details, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {results.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                准备开始检查...
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button onClick={checkSetup} disabled={isChecking}>
                {isChecking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    检查中...
                  </>
                ) : (
                  '重新检查'
                )}
              </Button>
            </div>

            {/* 操作指南 */}
            {results.some(r => r.status === 'error' && r.action) && (
              <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                <CardHeader>
                  <CardTitle className="text-blue-900 dark:text-blue-100">
                    需要执行的操作
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800 dark:text-blue-200">
                    <li>在 Supabase SQL Editor 中执行 <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">supabase_setup_categories.sql</code></li>
                    <li>在 Supabase Dashboard > Storage 中创建 bucket: <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">product-images</code></li>
                    <li>刷新此页面重新检查</li>
                  </ol>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestConnectionPage;
