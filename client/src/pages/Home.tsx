import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'wouter';
import { Button } from '@/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { ArrowRight, FileText, Users, TrendingUp, Bell } from 'lucide-react';

const Home: React.FC = () => {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  if (user?.role === 'admin' || user?.role === 'deputy') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              لوحة التحكم الإدارية
            </h1>
            <p className="text-slate-400">إدارة الطلبات والشكاوى من المواطنين</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="bg-slate-800 border-slate-700 hover:border-blue-500 transition-colors">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  جميع الطلبات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white mb-2">247</p>
                <p className="text-sm text-slate-400">+12 اليوم</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700 hover:border-green-500 transition-colors">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  الحل بنجاح
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white mb-2">156</p>
                <p className="text-sm text-slate-400">63% نسبة الإنجاز</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700 hover:border-yellow-500 transition-colors">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-yellow-500" />
                  قيد المتابعة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white mb-2">53</p>
                <p className="text-sm text-slate-400">21% من الإجمالي</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700 hover:border-purple-500 transition-colors">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-500" />
                  الموظفون النشطون
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white mb-2">18</p>
                <p className="text-sm text-slate-400">7 أونلاين الآن</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">آخر الطلبات</CardTitle>
                  <CardDescription>أحدث 10 طلبات مستلمة</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors cursor-pointer"
                      >
                        <div className="flex-1">
                          <p className="text-white font-medium">طلب رقم {247 - i}</p>
                          <p className="text-sm text-slate-400">من أحمد محمد</p>
                        </div>
                        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                          قيد المراجعة
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">إجراءات سريعة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    onClick={() => setLocation('/requests')}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    عرض جميع الطلبات
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    onClick={() => setLocation('/assignments')}
                    variant="outline"
                    className="w-full border-slate-600 text-white hover:bg-slate-700"
                  >
                    إدارة التكليفات
                  </Button>
                  <Button
                    onClick={() => setLocation('/users')}
                    variant="outline"
                    className="w-full border-slate-600 text-white hover:bg-slate-700"
                  >
                    إدارة الموظفين
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            مرحباً بك في منصة الحقوق المدنية
          </h1>
          <p className="text-slate-600 text-lg">
            قدم شكواك أو طلبك، وتابع تطوره خطوة بخطوة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-all hover:border-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                قدم طلب جديد
              </CardTitle>
              <CardDescription>أرسل شكواك أو طلبك بسهولة</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setLocation('/new-request')}
                className="w-full"
              >
                ابدأ الآن
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all hover:border-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                تتبع طلباتك
              </CardTitle>
              <CardDescription>شاهد تطور طلباتك</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setLocation('/requests')}
                variant="outline"
                className="w-full"
              >
                عرض الطلبات
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all hover:border-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-yellow-600" />
                الإشعارات
              </CardTitle>
              <CardDescription>تحديثات طلباتك</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setLocation('/notifications')}
                variant="outline"
                className="w-full"
              >
                عرض الإشعارات
              </Button>
            </CardContent>
          </Card>
        </div>

        {!user && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>لم تقم بتسجيل الدخول؟</CardTitle>
                <CardDescription>
                  سجل الدخول أو أنشئ حساباً جديداً للبدء
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Button
                  onClick={() => setLocation('/signin')}
                  className="flex-1"
                >
                  تسجيل الدخول
                </Button>
                <Button
                  onClick={() => setLocation('/signup')}
                  variant="outline"
                  className="flex-1"
                >
                  إنشاء حساب جديد
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
