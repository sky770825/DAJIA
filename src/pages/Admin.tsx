import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Download, RefreshCw, Database, Users, ShoppingBag, FileText, Shield, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { adminAuth, supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface LeadData {
  id: string;
  name: string;
  phone: string;
  email: string;
  product_interest: string;
  usage?: string;
  quantity?: string;
  contact_preference?: string;
  note?: string;
  created_at: string;
}

interface OrderData {
  order_number: string;
  items: any;
  total: number;
  shipping: number;
  form_data: any;
  status: string;
  created_at: string;
}

interface VerificationCode {
  id: string;
  code: string;
  product_id?: string;
  product_name?: string;
  order_number?: string;
  status: string;
  verified_at?: string;
  verified_count: number;
  created_at: string;
}

const AdminPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('leads');
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [verificationCodes, setVerificationCodes] = useState<VerificationCode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [generateCount, setGenerateCount] = useState(10);
  const [generateProductName, setGenerateProductName] = useState('');
  const itemsPerPage = 10;

  // 检查登录状态
  useEffect(() => {
    if (!adminAuth.isAuthenticated()) {
      navigate('/admin/login');
    }
  }, [navigate]);

  // 加载数据
  const loadLeads = async () => {
    if (!supabase) {
      toast({
        title: 'Supabase 未配置',
        description: '请检查环境变量配置',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('PRIVATE.leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error: any) {
      console.error('加载数据失败:', error);
      toast({
        title: '加载失败',
        description: error.message || '无法连接到数据库',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadOrders = async () => {
    if (!supabase) {
      toast({
        title: 'Supabase 未配置',
        description: '请检查环境变量配置',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('PRIVATE.orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      console.error('加载订单失败:', error);
      toast({
        title: '加载失败',
        description: error.message || '无法连接到数据库',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadVerificationCodes = async () => {
    if (!supabase) {
      toast({
        title: 'Supabase 未配置',
        description: '请检查环境变量配置',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('PRIVATE.verification_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVerificationCodes(data || []);
    } catch (error: any) {
      console.error('加载验证码失败:', error);
      toast({
        title: '加载失败',
        description: error.message || '无法连接到数据库',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateVerificationCodes = async () => {
    if (!supabase) {
      toast({
        title: 'Supabase 未配置',
        description: '请检查环境变量配置',
        variant: 'destructive',
      });
      return;
    }

    if (!generateProductName.trim()) {
      toast({
        title: '請輸入商品名稱',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const codes = [];
      for (let i = 0; i < generateCount; i++) {
        const code = `DJ-${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}-${i + 1}`;
        codes.push({
          code,
          product_name: generateProductName,
          status: 'active',
          created_at: new Date().toISOString(),
        });
      }

      const { error } = await supabase
        .from('PRIVATE.verification_codes')
        .insert(codes);

      if (error) throw error;

      toast({
        title: '生成成功',
        description: `已生成 ${generateCount} 個驗證碼`,
      });

      setIsGenerateDialogOpen(false);
      setGenerateProductName('');
      setGenerateCount(10);
      loadVerificationCodes();
    } catch (error: any) {
      console.error('生成验证码失败:', error);
      toast({
        title: '生成失败',
        description: error.message || '無法生成驗證碼',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (adminAuth.isAuthenticated()) {
      if (activeTab === 'leads') {
        loadLeads();
      } else if (activeTab === 'orders') {
        loadOrders();
      } else if (activeTab === 'codes') {
        loadVerificationCodes();
      }
    }
  }, [activeTab]);

  // 切换标签页时重置分页
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const handleLogout = () => {
    adminAuth.logout();
    toast({
      title: '已登出',
      description: '您已成功登出後台管理系統',
    });
    navigate('/admin/login');
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      toast({
        title: '無資料可匯出',
        variant: 'destructive',
      });
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map((row) =>
        headers.map((header) => {
          const value = row[header];
          return typeof value === 'object' ? JSON.stringify(value) : value;
        }).join(',')
      ),
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // 分页计算
  const paginatedLeads = leads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const paginatedOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const paginatedVerificationCodes = verificationCodes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(
    (activeTab === 'leads' ? leads.length :
     activeTab === 'orders' ? orders.length :
     verificationCodes.length) / itemsPerPage
  );

  if (!adminAuth.isAuthenticated()) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Database className="h-6 w-6 text-primary" />
            <h1 className="font-serif text-xl font-bold text-foreground">
              後台管理系統
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {activeTab === 'codes' && (
              <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    生成驗證碼
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>生成驗證碼</DialogTitle>
                    <DialogDescription>
                      為商品生成新的防偽驗證碼
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="product-name">商品名稱 *</Label>
                      <Input
                        id="product-name"
                        value={generateProductName}
                        onChange={(e) => setGenerateProductName(e.target.value)}
                        placeholder="例如：媽祖金箔護身符"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="count">生成數量</Label>
                      <Input
                        id="count"
                        type="number"
                        min="1"
                        max="100"
                        value={generateCount}
                        onChange={(e) => setGenerateCount(parseInt(e.target.value) || 10)}
                        className="mt-2"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)}>
                      取消
                    </Button>
                    <Button onClick={generateVerificationCodes} disabled={isLoading}>
                      {isLoading ? '生成中...' : '生成'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            <Button variant="outline" onClick={() => exportToCSV(
              activeTab === 'leads' ? leads :
              activeTab === 'orders' ? orders :
              verificationCodes,
              activeTab === 'leads' ? 'leads' :
              activeTab === 'orders' ? 'orders' :
              'verification_codes'
            )}>
              <Download className="mr-2 h-4 w-4" />
              匯出 CSV
            </Button>
            <Button variant="outline" onClick={
              activeTab === 'leads' ? loadLeads :
              activeTab === 'orders' ? loadOrders :
              loadVerificationCodes
            }>
              <RefreshCw className="mr-2 h-4 w-4" />
              重新整理
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              登出
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-6">
        <div className="container mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="leads" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                客戶登記 ({leads.length})
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                訂單管理 ({orders.length})
              </TabsTrigger>
              <TabsTrigger value="codes" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                驗證碼管理 ({verificationCodes.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="leads" className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : paginatedLeads.length === 0 ? (
                <div className="rounded-xl border border-border bg-card p-12 text-center">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">尚無客戶登記資料</p>
                </div>
              ) : (
                <>
                  <div className="rounded-xl border border-border bg-card overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>姓名</TableHead>
                          <TableHead>電話</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>感興趣商品</TableHead>
                          <TableHead>用途</TableHead>
                          <TableHead>數量</TableHead>
                          <TableHead>登記時間</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedLeads.map((lead) => (
                          <TableRow key={lead.id}>
                            <TableCell className="font-medium">{lead.name}</TableCell>
                            <TableCell>{lead.phone}</TableCell>
                            <TableCell>{lead.email}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{lead.product_interest}</Badge>
                            </TableCell>
                            <TableCell>{lead.usage || '-'}</TableCell>
                            <TableCell>{lead.quantity || '-'}</TableCell>
                            <TableCell>
                              {new Date(lead.created_at).toLocaleString('zh-TW')}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        顯示第 {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, leads.length)} 筆，共 {leads.length} 筆
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                        >
                          上一頁
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                        >
                          下一頁
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="orders" className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : paginatedOrders.length === 0 ? (
                <div className="rounded-xl border border-border bg-card p-12 text-center">
                  <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">尚無訂單資料</p>
                </div>
              ) : (
                <>
                  <div className="rounded-xl border border-border bg-card overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>訂單編號</TableHead>
                          <TableHead>客戶姓名</TableHead>
                          <TableHead>電話</TableHead>
                          <TableHead>商品數量</TableHead>
                          <TableHead>總金額</TableHead>
                          <TableHead>狀態</TableHead>
                          <TableHead>建立時間</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedOrders.map((order) => (
                          <TableRow key={order.order_number}>
                            <TableCell className="font-mono font-medium">
                              {order.order_number}
                            </TableCell>
                            <TableCell>{order.form_data?.name || '-'}</TableCell>
                            <TableCell>{order.form_data?.phone || '-'}</TableCell>
                            <TableCell>
                              {Array.isArray(order.items) ? order.items.length : 0} 件
                            </TableCell>
                            <TableCell>NT$ {order.total.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  order.status === 'pending' ? 'default' :
                                  order.status === 'confirmed' ? 'secondary' :
                                  order.status === 'shipped' ? 'outline' : 'default'
                                }
                              >
                                {order.status === 'pending' && '處理中'}
                                {order.status === 'confirmed' && '已確認'}
                                {order.status === 'shipped' && '已出貨'}
                                {order.status === 'delivered' && '已送達'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(order.created_at).toLocaleString('zh-TW')}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        顯示第 {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, orders.length)} 筆，共 {orders.length} 筆
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                        >
                          上一頁
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                        >
                          下一頁
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="codes" className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : paginatedVerificationCodes.length === 0 ? (
                <div className="rounded-xl border border-border bg-card p-12 text-center">
                  <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">尚無驗證碼資料</p>
                </div>
              ) : (
                <>
                  <div className="rounded-xl border border-border bg-card overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>驗證碼</TableHead>
                          <TableHead>商品名稱</TableHead>
                          <TableHead>訂單編號</TableHead>
                          <TableHead>狀態</TableHead>
                          <TableHead>驗證次數</TableHead>
                          <TableHead>最後驗證時間</TableHead>
                          <TableHead>建立時間</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedVerificationCodes.map((code) => (
                          <TableRow key={code.id}>
                            <TableCell className="font-mono font-medium">
                              {code.code}
                            </TableCell>
                            <TableCell>{code.product_name || '-'}</TableCell>
                            <TableCell className="font-mono text-sm">
                              {code.order_number || '-'}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  code.status === 'active' ? 'default' :
                                  code.status === 'used' ? 'secondary' :
                                  'outline'
                                }
                              >
                                {code.status === 'active' && '有效'}
                                {code.status === 'used' && '已使用'}
                                {code.status === 'revoked' && '已撤銷'}
                              </Badge>
                            </TableCell>
                            <TableCell>{code.verified_count || 0}</TableCell>
                            <TableCell>
                              {code.verified_at
                                ? new Date(code.verified_at).toLocaleString('zh-TW')
                                : '-'}
                            </TableCell>
                            <TableCell>
                              {new Date(code.created_at).toLocaleString('zh-TW')}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        顯示第 {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, verificationCodes.length)} 筆，共 {verificationCodes.length} 筆
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                        >
                          上一頁
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                        >
                          下一頁
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
