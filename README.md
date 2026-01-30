# منصة الحقوق المدنية

منصة متطورة لتقديم وتتبع الشكاوى والطلبات من المواطنين مع نظام إدارة شامل للموظفين والنواب.

## البنية المعمارية

```
project/
├── client/                 # تطبيق React Frontend
│   └── src/
│       ├── pages/         # الصفحات الرئيسية
│       ├── components/    # مكونات React UI
│       ├── contexts/      # Context API للحالة العامة
│       ├── services/      # الخدمات (API, Supabase)
│       └── assets/        # الصور والملفات الثابتة
├── server/                # Express Backend
│   ├── routes/           # API Routes
│   ├── middleware/       # Middleware (Auth, Validation)
│   ├── services/         # خدمات الأعمال
│   ├── db.ts            # اتصال Supabase
│   └── index.ts         # نقطة دخول الخادم
├── shared/               # الكود المشترك
│   ├── schema.ts        # Zod schemas للتحقق
│   └── routes.ts        # تعريفات API routes
├── supabase/
│   └── functions/       # Edge Functions
│       ├── send_notifications/
│       └── handle_request_updates/
└── script/
    └── build.ts         # سكريبت البناء
```

## الميزات الرئيسية

### 1. نظام المصادقة والتخويل
- ✅ تسجيل دخول/تسجيل جديد آمن باستخدام Supabase Auth
- ✅ JWT-based authentication
- ✅ ثلاث مستويات من الأدوار: مواطن، موظف، نائب، ومسؤول
- ✅ Row Level Security (RLS) على جميع الجداول

### 2. إدارة الطلبات والشكاوى
- ✅ إنشاء طلبات جديدة مع تفاصيل كاملة
- ✅ تحميل المرفقات (صور، وثائق)
- ✅ تتبع حالة الطلب في الوقت الفعلي
- ✅ تصنيفات مرنة للطلبات
- ✅ تقييم وتقديم ملاحظات بعد الحل

### 3. لوحة التحكم والإحصائيات
- ✅ لوحة تحكم للإدارة مع إحصائيات فورية
- ✅ تقارير الأداء والإنتاجية
- ✅ تصفية وبحث متقدم
- ✅ تحليلات البيانات

### 4. نظام التكليفات والمهام
- ✅ تكليف الطلبات للموظفين
- ✅ إدارة أولويات المهام
- ✅ تتبع حالة تنفيذ المهام
- ✅ ملاحظات وتعليقات

### 5. نظام الإشعارات
- ✅ إشعارات فورية للتحديثات
- ✅ Edge Functions للمعالجة غير المتزامنة
- ✅ إشعارات البريد الإلكتروني (مجهزة)
- ✅ تحديثات تلقائية عند تغيير الحالة

### 6. الأمان والحماية
- ✅ تشفير البيانات في قاعدة البيانات
- ✅ حماية CSRF و XSS
- ✅ تحقق من الأذونات على جميع الطلبات
- ✅ سجل الأنشطة والتغييرات
- ✅ معايير GDPR

## قاعدة البيانات

### الجداول الرئيسية

#### users
- معلومات المستخدم الأساسية
- الأدوار والصلاحيات
- بيانات الملف الشخصي

#### requests
- الطلبات والشكاوى
- الحالة والأولوية
- المرفقات والملاحظات
- التقييمات والردود

#### categories
- تصنيفات الخدمات
- الرموز والألوان
- الأوصاف

#### assignments
- تكليف الطلبات للموظفين
- حالة التنفيذ
- الأولويات والمواعيد

#### notifications
- الإشعارات للمستخدمين
- حالة القراءة
- الارتباطات والملاحظات

#### request_history
- سجل تطورات الطلب
- التغييرات والملاحظات
- معلومات من قام بالتغيير

## API Endpoints

### المصادقة
```
POST   /api/auth/signup           - إنشاء حساب جديد
POST   /api/auth/signin           - تسجيل الدخول
POST   /api/auth/signout          - تسجيل الخروج
GET    /api/auth/me               - الحصول على بيانات المستخدم الحالي
PUT    /api/auth/profile          - تحديث الملف الشخصي
POST   /api/auth/refresh          - تحديث الـ token
```

### الطلبات
```
GET    /api/requests              - قائمة الطلبات
POST   /api/requests              - إنشاء طلب جديد
GET    /api/requests/:id          - الحصول على تفاصيل الطلب
PUT    /api/requests/:id          - تحديث الطلب
DELETE /api/requests/:id          - حذف الطلب
GET    /api/requests/:id/history  - سجل تطورات الطلب
```

### التصنيفات
```
GET    /api/categories            - قائمة التصنيفات
POST   /api/categories            - إنشاء تصنيف جديد
```

### الإشعارات
```
GET    /api/notifications         - قائمة الإشعارات
POST   /api/notifications/:id/read - تحديد الإشعار كمقروء
```

### المهام
```
GET    /api/assignments           - قائمة المهام
POST   /api/assignments           - تكليف جديد
PUT    /api/assignments/:id       - تحديث المهمة
```

## الدوال الحدودية (Edge Functions)

### send_notifications
معالجة وإرسال الإشعارات للمستخدمين
- البريد الإلكتروني التلقائي
- إشعارات في التطبيق
- تسجيل الإشعارات

### handle_request_updates
معالجة تحديثات حالة الطلب
- إرسال إشعارات التحديث
- حفظ السجل التاريخي
- تنبيهات المستخدم

## التشغيل المحلي

### المتطلبات
- Node.js 18+
- npm أو yarn
- حساب Supabase

### خطوات التثبيت

```bash
# 1. استنساخ المشروع
git clone <repo>
cd project

# 2. تثبيت المكتبات
npm install

# 3. إعداد المتغيرات البيئية
cp .env.example .env
# ثم قم بتحرير .env وأضف بيانات Supabase

# 4. تشغيل سيرفر التطوير
npm run dev

# 5. بناء للإنتاج
npm run build

# 6. تشغيل الإنتاج
npm start
```

### ملفات البيئة

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# API
VITE_API_URL=http://localhost:5000

# البريد الإلكتروني (اختياري)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password
```

## معايير التطوير

### اتفاقيات الكود
- استخدام TypeScript للأمان
- اتباع معايير ESLint
- استخدام Prettier لتنسيق الكود
- اختبارات شاملة قبل الـ push

### البنية المشروع
- مكون واحد = ملف واحد
- فصل المنطق والعرض
- استخدام React hooks
- Context API للحالة العامة

### قواعد الأمان
- التحقق من المدخلات دائماً
- عدم حفظ البيانات الحساسة في localStorage
- استخدام HTTPS فقط في الإنتاج
- حماية RLS على جميع العمليات

## الهندسة المعمارية

### Frontend (React + Vite)
- **State Management**: Context API + useReducer
- **API Client**: Custom fetch wrapper
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI

### Backend (Express + Supabase)
- **Authentication**: Supabase Auth + JWT
- **Database**: PostgreSQL (Supabase)
- **Validation**: Zod
- **Real-time**: WebSockets (للمستقبل)

### Edge Functions (Deno)
- معالجة الإشعارات
- مهام الخلفية
- Webhooks

## الأداء والتحسينات

- ✅ Code splitting تلقائي
- ✅ Image optimization
- ✅ Lazy loading للمكونات
- ✅ Caching الاستجابات
- ✅ Database indexes
- ✅ Query optimization

## المستقبليات المخطط لها

- [ ] نظام الدفع الإلكتروني
- [ ] Chatbot ذكي باستخدام AI
- [ ] تطبيق الموبايل الأصلي
- [ ] تكامل مع WhatsApp و Telegram
- [ ] تقارير تلقائية يومية/أسبوعية
- [ ] نظام التقييم والتقيح
- [ ] لوحة تحكم متقدمة بالرسوم البيانية

## الدعم والمساهمة

- تقرير المشاكل: GitHub Issues
- المساهمة: Pull Requests
- السؤال: Discussions

## الترخيص

MIT License - انظر LICENSE للتفاصيل

---

**تم تطوير المشروع بواسطة فريق تطوير شامل**
آخر تحديث: 2026-01-30
