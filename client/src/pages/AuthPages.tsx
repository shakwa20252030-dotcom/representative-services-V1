import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'wouter';
import { Button } from '@/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import { Alert, AlertDescription } from '@/components/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select';

const SignIn: React.FC = () => {
  const { signIn } = useAuth();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(formData.email, formData.password);
      setLocation('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <CardHeader className="space-y-2">
          <CardTitle className="text-white text-2xl">تسجيل الدخول</CardTitle>
          <CardDescription>ادخل بيانات حسابك للمتابعة</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4 bg-red-500/10 border-red-500">
              <AlertDescription className="text-red-500">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-white">البريد الإلكتروني</Label>
              <Input
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="mt-1 bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>

            <div>
              <Label className="text-white">كلمة المرور</Label>
              <Input
                type="password"
                placeholder="أدخل كلمة المرور"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="mt-1 bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'جاري التسجيل...' : 'تسجيل الدخول'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-slate-400">
            ليس لديك حساب؟{' '}
            <button
              onClick={() => setLocation('/signup')}
              className="text-blue-500 hover:text-blue-400 font-medium"
            >
              إنشاء حساب جديد
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const SignUp: React.FC = () => {
  const { signUp } = useAuth();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    role: 'citizen',
    national_id: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signUp(formData);
      setLocation('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <CardHeader className="space-y-2">
          <CardTitle className="text-white text-2xl">إنشاء حساب جديد</CardTitle>
          <CardDescription>ادخل بيانات حسابك الشخصية</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4 bg-red-500/10 border-red-500">
              <AlertDescription className="text-red-500">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label className="text-white text-sm">الاسم الكامل</Label>
              <Input
                placeholder="أدخل اسمك الكامل"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                className="mt-1 bg-slate-700 border-slate-600 text-white text-sm"
                required
              />
            </div>

            <div>
              <Label className="text-white text-sm">البريد الإلكتروني</Label>
              <Input
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="mt-1 bg-slate-700 border-slate-600 text-white text-sm"
                required
              />
            </div>

            <div>
              <Label className="text-white text-sm">كلمة المرور</Label>
              <Input
                type="password"
                placeholder="أدخل كلمة مرور قوية"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="mt-1 bg-slate-700 border-slate-600 text-white text-sm"
                required
              />
            </div>

            <div>
              <Label className="text-white text-sm">رقم الهاتف</Label>
              <Input
                placeholder="أدخل رقم هاتفك"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="mt-1 bg-slate-700 border-slate-600 text-white text-sm"
              />
            </div>

            <div>
              <Label className="text-white text-sm">الرقم القومي</Label>
              <Input
                placeholder="أدخل الرقم القومي (اختياري)"
                value={formData.national_id}
                onChange={(e) =>
                  setFormData({ ...formData, national_id: e.target.value })
                }
                className="mt-1 bg-slate-700 border-slate-600 text-white text-sm"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'جاري الإنشاء...' : 'إنشاء حساب'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-slate-400">
            لديك حساب بالفعل؟{' '}
            <button
              onClick={() => setLocation('/signin')}
              className="text-blue-500 hover:text-blue-400 font-medium"
            >
              تسجيل الدخول
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { SignIn, SignUp };
