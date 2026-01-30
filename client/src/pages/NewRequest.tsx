import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { requestService, categoryService } from '../services/api';
import { useLocation } from 'wouter';
import { Button } from '@/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import { Alert, AlertDescription } from '@/components/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select';

const NewRequest: React.FC = () => {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    location_text: '',
    priority: 'normal',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoryService.list();
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.category_id) {
        setError('يجب اختيار فئة للطلب');
        setLoading(false);
        return;
      }

      const response = await requestService.create(formData);
      setLocation(`/requests/${response.data.id}`);
    } catch (err: any) {
      setError(err.message || 'فشل في إنشاء الطلب');
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-600">يجب تسجيل الدخول أولاً</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>إنشاء طلب جديد</CardTitle>
            <CardDescription>
              قدم شكواك أو طلبك والتفاصيل الكاملة
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-6 bg-red-50 border-red-200">
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="category">فئة الطلب *</Label>
                <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="اختر فئة الطلب" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="title">عنوان الطلب *</Label>
                <Input
                  id="title"
                  placeholder="ملخص الطلب أو الشكوى"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="mt-2"
                  required
                  minLength={5}
                />
              </div>

              <div>
                <Label htmlFor="description">وصف تفصيلي *</Label>
                <textarea
                  id="description"
                  placeholder="اشرح المشكلة بالتفصيل..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={20}
                  rows={6}
                />
              </div>

              <div>
                <Label htmlFor="location">الموقع (اختياري)</Label>
                <Input
                  id="location"
                  placeholder="حدد الموقع المتعلق بالطلب"
                  value={formData.location_text}
                  onChange={(e) =>
                    setFormData({ ...formData, location_text: e.target.value })
                  }
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="priority">الأولوية</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">منخفضة</SelectItem>
                    <SelectItem value="normal">عادية</SelectItem>
                    <SelectItem value="high">عالية</SelectItem>
                    <SelectItem value="urgent">عاجلة</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'جاري الإنشاء...' : 'إنشاء الطلب'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setLocation('/')}
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewRequest;
