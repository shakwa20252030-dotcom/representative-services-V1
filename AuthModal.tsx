import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Lock, User, Phone, IdCard } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    nationalId: "",
    occupation: "",
    villageCouncil: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast({ title: "تم تسجيل الدخول بنجاح", description: "مرحباً بك" });
      } else {
        // Validate all required fields for registration
        if (!formData.name || !formData.phone || !formData.nationalId || !formData.occupation || !formData.villageCouncil) {
          toast({ title: "خطأ", description: "جميع البيانات مطلوبة", variant: "destructive" });
          setIsLoading(false);
          return;
        }
        await register({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
          nationalId: formData.nationalId,
          occupation: formData.occupation,
          villageCouncil: formData.villageCouncil,
        });
        toast({ title: "تم إنشاء الحساب بنجاح", description: "مرحباً بك" });
      }
      onOpenChange(false);
      setFormData({ email: "", password: "", name: "", phone: "", nationalId: "", occupation: "", villageCouncil: "" });
    } catch (error: any) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const villageOptions = [
    "المدينة وتوابعها",
    "مجلس قروى الجزاير وجمصة",
    "مجلس قروى بلقاس خامس",
    "مجلس قروى الشوامى",
    "مجلس قروى الستامونى",
    "مجلس قروى المعصرة",
    "مجلس قروى بسنديلة والزهراء",
    "مجلس قروى الحفير وقلابشو",
  ];

  const occupationOptions = [
    { value: "طالب", label: "طالب" },
    { value: "خريج", label: "خريج" },
    { value: "موظف", label: "موظف" },
    { value: "رب أسرة", label: "رب أسرة" },
    { value: "صاحب مشروع", label: "صاحب مشروع" },
    { value: "أخرى", label: "أخرى" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-display">
            {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                الاسم بالكامل
              </Label>
              <Input
                id="name"
                data-testid="input-register-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="أدخل اسمك الثلاثي"
                required={!isLogin}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              البريد الإلكتروني
            </Label>
            <Input
              id="email"
              type="email"
              data-testid="input-auth-email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="example@gmail.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              كلمة المرور
            </Label>
            <Input
              id="password"
              type="password"
              data-testid="input-auth-password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {!isLogin && (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  رقم الهاتف
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  data-testid="input-register-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="01xxxxxxxxx"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationalId" className="flex items-center gap-2">
                  <IdCard className="w-4 h-4" />
                  الرقم القومي
                </Label>
                <Input
                  id="nationalId"
                  data-testid="input-register-nationalId"
                  value={formData.nationalId}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setFormData({ ...formData, nationalId: value });
                  }}
                  placeholder="14 رقم"
                  maxLength={14}
                  pattern="[0-9]*"
                  inputMode="numeric"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>الصفة <span className="text-destructive">*</span></Label>
                <Select
                  value={formData.occupation}
                  onValueChange={(value) => setFormData({ ...formData, occupation: value })}
                  required
                >
                  <SelectTrigger data-testid="select-register-occupation">
                    <SelectValue placeholder="اختر صفتك" />
                  </SelectTrigger>
                  <SelectContent>
                    {occupationOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>المجلس القروي <span className="text-destructive">*</span></Label>
                <Select
                  value={formData.villageCouncil}
                  onValueChange={(value) => setFormData({ ...formData, villageCouncil: value })}
                  required
                >
                  <SelectTrigger data-testid="select-register-village">
                    <SelectValue placeholder="اختر المجلس القروي" />
                  </SelectTrigger>
                  <SelectContent>
                    {villageOptions.map((village) => (
                      <SelectItem key={village} value={village}>
                        {village}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
            data-testid="button-auth-submit"
          >
            {isLoading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
            {isLogin ? "تسجيل الدخول" : "إنشاء حساب"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            {isLogin ? (
              <>
                ليس لديك حساب؟{" "}
                <button
                  type="button"
                  className="text-primary hover:underline font-medium"
                  onClick={() => setIsLogin(false)}
                  data-testid="button-switch-to-register"
                >
                  سجل الآن
                </button>
              </>
            ) : (
              <>
                لديك حساب بالفعل؟{" "}
                <button
                  type="button"
                  className="text-primary hover:underline font-medium"
                  onClick={() => setIsLogin(true)}
                  data-testid="button-switch-to-login"
                >
                  تسجيل الدخول
                </button>
              </>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
