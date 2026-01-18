import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, ChevronRight, Loader2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { contactInfo } from '@/data/contact';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { products } from '@/data/products';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

const step1Schema = z.object({
  name: z.string().min(1, '請輸入姓名').max(50, '姓名過長'),
  phone: z.string().min(10, '請輸入有效手機號碼').max(15, '手機號碼過長'),
  email: z.string().email('請輸入有效 Email'),
  productInterest: z.string().min(1, '請選擇感興趣的商品'),
});

const step2Schema = z.object({
  usage: z.string().optional(),
  quantity: z.string().optional(),
  contactPreference: z.string().optional(),
  note: z.string().max(500, '備註過長').optional(),
});

const fullSchema = step1Schema.merge(step2Schema).extend({
  agreePrivacy: z.boolean().refine((val) => val === true, '請同意個資告知'),
});

type FormData = z.infer<typeof fullSchema>;

interface LeadFormProps {
  preselectedProduct?: string;
  className?: string;
}

export function LeadForm({ preselectedProduct, className }: LeadFormProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [leadId, setLeadId] = useState('');

  const form = useForm<FormData>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      productInterest: preselectedProduct || '',
      usage: '',
      quantity: '',
      contactPreference: '',
      note: '',
      agreePrivacy: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // 如果有 Supabase 配置，保存到数据库
      if (supabase) {
        const { error } = await supabase
          .from('PRIVATE.leads')
          .insert([
            {
              name: data.name,
              phone: data.phone,
              email: data.email,
              product_interest: data.productInterest,
              usage: data.usage || null,
              quantity: data.quantity || null,
              contact_preference: data.contactPreference || null,
              note: data.note || null,
            },
          ]);

        if (error) throw error;
      }

      // 同时保存到 localStorage 作为备份
      const leads = JSON.parse(localStorage.getItem('dajia-mazu-leads') || '[]');
      const generatedId = `LEAD-${Date.now().toString(36).toUpperCase()}`;
      leads.push({
        id: generatedId,
        ...data,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('dajia-mazu-leads', JSON.stringify(leads));

      setLeadId(generatedId);
      setIsSuccess(true);
    } catch (error: unknown) {
      console.error('提交失败:', error);
      const errorMessage = error instanceof Error ? error.message : '無法提交資料，請稍後再試';
      toast({
        title: '提交失敗',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStep = async () => {
    const isValid = await form.trigger(['name', 'phone', 'email', 'productInterest']);
    if (isValid) {
      setStep(2);
    }
  };

  if (isSuccess) {
    return (
      <div className={cn('rounded-2xl border border-primary/30 bg-card p-8 text-center', className)}>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
          <Check className="h-8 w-8 text-primary" />
        </div>
        <h3 className="font-serif text-xl font-semibold text-foreground">登記成功！</h3>
        <p className="mt-2 text-muted-foreground">
          您的登記編號：<span className="font-mono text-primary">{leadId}</span>
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          我們將盡快與您聯繫，請加入官方 LINE 獲取最新資訊！
        </p>
        <Button
          className="mt-6 bg-line text-white hover:bg-line/90"
          asChild
        >
          <a href={contactInfo.line.url} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="mr-2 h-4 w-4" />
            加入官方 LINE
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className={cn('rounded-2xl border border-border bg-card p-6 md:p-8', className)}>
      {/* Progress indicator */}
      <div className="mb-6 flex items-center gap-2">
        <div className={cn(
          'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium',
          step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
        )}>
          1
        </div>
        <div className={cn('h-0.5 flex-1', step >= 2 ? 'bg-primary' : 'bg-muted')} />
        <div className={cn(
          'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium',
          step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
        )}>
          2
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {step === 1 && (
            <>
              <h3 className="font-serif text-lg font-semibold text-foreground">基本資料</h3>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>姓名 *</FormLabel>
                    <FormControl>
                      <Input placeholder="請輸入您的姓名" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>手機 *</FormLabel>
                    <FormControl>
                      <Input placeholder="0912-345-678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="productInterest"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>感興趣的商品 *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="請選擇商品" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.slug}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                onClick={handleNextStep}
                className="w-full btn-gold text-primary-foreground"
              >
                下一步
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <h3 className="font-serif text-lg font-semibold text-foreground">補充資訊（選填）</h3>
              <FormField
                control={form.control}
                name="usage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>用途</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="請選擇用途" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="personal">自用</SelectItem>
                        <SelectItem value="gift">送禮</SelectItem>
                        <SelectItem value="bulk">大量採購</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>預計數量</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="請選擇數量" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">1件</SelectItem>
                        <SelectItem value="2-5">2-5件</SelectItem>
                        <SelectItem value="6-10">6-10件</SelectItem>
                        <SelectItem value="10+">10件以上</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactPreference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>希望聯絡方式</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="請選擇聯絡方式" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="phone">電話</SelectItem>
                        <SelectItem value="line">LINE</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>備註</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="有任何問題或需求請在此說明..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="agreePrivacy"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm">
                        我已閱讀並同意{' '}
                        <a href="/privacy" className="text-primary underline">
                          個資告知及隱私權政策
                        </a>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  上一步
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 btn-gold text-primary-foreground"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      送出中...
                    </>
                  ) : (
                    '送出登記'
                  )}
                </Button>
              </div>
            </>
          )}
        </form>
      </Form>
    </div>
  );
}
