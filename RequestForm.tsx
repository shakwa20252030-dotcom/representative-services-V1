import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertRequestSchema, type CreateRequestInput } from "@shared/schema";
import { useCreateRequest } from "@/hooks/use-requests";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Send, Image as ImageIcon, Check, MapPin, Navigation } from "lucide-react";
import { useUpload } from "@/hooks/use-upload";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

export function RequestForm({ initialCategory }: { initialCategory?: string }) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createRequest = useCreateRequest();
  const { uploadFile, isUploading } = useUpload();
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const { user } = useAuth();

  const form = useForm<CreateRequestInput>({
    resolver: zodResolver(insertRequestSchema),
    defaultValues: {
      citizenName: user?.name || "",
      nationalId: user?.nationalId || "",
      occupation: user?.occupation || "",
      phone: user?.phone || "",
      type: "service",
      category: initialCategory || "hospital",
      description: "",
      address: user?.address || "",
      location: "",
      villageCouncil: user?.villageCouncil || "المدينة وتوابعها",
      email: user?.email || "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (initialCategory) {
      form.setValue("category", initialCategory);
    }
  }, [initialCategory, form.setValue]);

  useEffect(() => {
    if (user) {
      form.setValue("citizenName", user.name || "");
      form.setValue("nationalId", user.nationalId || "");
      form.setValue("occupation", user.occupation || "");
      form.setValue("phone", user.phone || "");
      form.setValue("email", user.email || "");
      form.setValue("address", user.address || "");
      if (user.villageCouncil) {
        form.setValue("villageCouncil", user.villageCouncil);
      }
    } else {
      form.setValue("citizenName", "");
      form.setValue("nationalId", "");
      form.setValue("occupation", "");
      form.setValue("phone", "");
      form.setValue("email", "");
      form.setValue("address", "");
      form.setValue("villageCouncil", "المدينة وتوابعها");
    }
  }, [user, form.setValue]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "غير مدعوم",
        description: "متصفحك لا يدعم تحديد الموقع",
        variant: "destructive",
      });
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        form.setValue("location", `${latitude},${longitude}`);
        setIsGettingLocation(false);
        toast({
          title: "تم تحديد الموقع",
          description: "تم التقاط إحداثيات موقعك بنجاح",
        });
      },
      (error) => {
        setIsGettingLocation(false);
        toast({
          title: "خطأ",
          description: "تعذر الحصول على موقعك. تأكد من تفعيل الـ GPS",
          variant: "destructive",
        });
      }
    );
  };

  const requestType = form.watch("type");

  useEffect(() => {
    if (requestType !== "service" && form.getValues("category") === "job") {
      form.setValue("category", "hospital");
    }
    if (requestType === "proposal") {
      form.setValue("address", "");
      form.setValue("location", "");
    }
  }, [requestType, form.setValue, form.getValues]);

  const descriptionLabel = 
    requestType === "proposal" ? "تفاصيل المقترح" :
    requestType === "complaint" ? "تفاصيل الشكوى" :
    "تفاصيل الخدمة";

  const descriptionPlaceholder = 
    requestType === "proposal" ? "اشرح مقترحك لتطوير الدائرة بالتفصيل..." :
    requestType === "complaint" ? "اشرح مشكلتك بالتفصيل..." :
    "اشرح طلبك بالتفصيل...";

  const uploadLabel = requestType === "service" ? "إرفاق مستندات إن وجد (اختياري)" : "إرفاق صورة للمشكلة (اختياري)";

  const onSubmit = (data: CreateRequestInput) => {
    createRequest.mutate(data, {
      onSuccess: (response) => {
        toast({
          title: "تم إرسال طلبك بنجاح",
          description: `رقم المتابعة الخاص بك هو: ${response.trackingNumber}`,
        });
        setLocation(`/success/${response.trackingNumber}`);
      },
      onError: (error) => {
        toast({
          title: "خطأ في الإرسال",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const response = await uploadFile(file);
        if (response) {
          newImages.push(response.objectPath);
        }
      }
      if (newImages.length > 0) {
        const allImages = [...uploadedImages, ...newImages];
        setUploadedImages(allImages);
        form.setValue("imageUrl", allImages.join(","));
        toast({
          title: "تم رفع الصور",
          description: `تم إرفاق ${newImages.length} صورة بطلبك بنجاح.`,
        });
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    form.setValue("imageUrl", newImages.join(","));
  };

  return (
    <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
      <div className="bg-primary/5 p-6 border-b border-border">
        <h3 className="text-2xl font-bold text-primary font-display">تقديم طلب جديد</h3>
        <p className="text-muted-foreground mt-1">املأ النموذج أدناه لتقديم شكوى أو طلب خدمة</p>
      </div>
      
      <div className="p-6 md:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Info Fields - Hidden when logged in */}
            {!user && (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="citizenName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الاسم بالكامل</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل اسمك الثلاثي" {...field} className="bg-background" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nationalId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الرقم القومي</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="أدخل الـ 14 رقم" 
                            {...field} 
                            className="bg-background" 
                            maxLength={14}
                            pattern="[0-9]*"
                            inputMode="numeric"
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9]/g, '');
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="occupation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الفئة</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                          <FormControl>
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder="اختر الفئة" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="طالب">طالب</SelectItem>
                            <SelectItem value="خريج">خريج</SelectItem>
                            <SelectItem value="موظف">موظف</SelectItem>
                            <SelectItem value="رب أسرة">رب أسرة</SelectItem>
                            <SelectItem value="صاحب مشروع">صاحب مشروع</SelectItem>
                            <SelectItem value="أخرى">أخرى</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>رقم الهاتف</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="01xxxxxxxxx" 
                            {...field} 
                            className="bg-background" 
                            onKeyDown={(e) => {
                              if (!/[0-9]|Backspace|Tab|ArrowLeft|ArrowRight|Delete/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            onChange={(e) => {
                              let value = e.target.value;
                              if (value && !value.startsWith("+20")) {
                                const cleaned = value.replace(/^\+?2?0?/, "");
                                value = "+20" + cleaned;
                              }
                              field.onChange(value);
                            }}
                          />
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
                        <FormLabel>البريد الإلكتروني (يفضل)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="example@gmail.com" 
                            {...field} 
                            value={field.value || ""}
                            className="bg-background" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            {/* Show user info summary when logged in */}
            {user && (
              <div className="bg-accent/30 rounded-xl p-4 border border-accent">
                <p className="text-sm text-muted-foreground mb-3">سيتم استخدام بياناتك المحفوظة:</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b border-accent/50 pb-2">
                    <span className="text-muted-foreground">الاسم:</span>
                    <span className="font-bold">{user.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-accent/50 pb-2">
                    <span className="text-muted-foreground">الهاتف:</span>
                    <span className="font-bold" dir="ltr">{user.phone}</span>
                  </div>
                  <div className="flex justify-between border-b border-accent/50 pb-2">
                    <span className="text-muted-foreground">البريد:</span>
                    <span className="font-bold" dir="ltr">{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">المجلس:</span>
                    <span className="font-bold">{user.villageCouncil}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع الطلب</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="اختر نوع الطلب" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="service">طلب خدمة</SelectItem>
                        <SelectItem value="complaint">شكوى</SelectItem>
                        <SelectItem value="proposal">اقتراح لتطوير الدائرة</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الفئة</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="اختر الفئة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="hospital">صحة ومستشفيات</SelectItem>
                        {requestType === "service" && (
                          <SelectItem value="job">فرص عمل</SelectItem>
                        )}
                        <SelectItem value="road">طرق ومواصلات</SelectItem>
                        <SelectItem value="school">تعليم ومدارس</SelectItem>
                        <SelectItem value="sewage">صرف صحي ومياه</SelectItem>
                        <SelectItem value="electricity">كهرباء وطاقة</SelectItem>
                        <SelectItem value="housing">إسكان وتعمير</SelectItem>
                        <SelectItem value="security">أمن وخدمات</SelectItem>
                        <SelectItem value="social">تكافل اجتماعي</SelectItem>
                        <SelectItem value="council">مجلس المدينة</SelectItem>
                        <SelectItem value="other">أخرى</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Village Council - Only show when not logged in */}
            {!user && (
              <FormField
                control={form.control}
                name="villageCouncil"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المجلس القروي</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger className="bg-background h-12">
                          <SelectValue placeholder="اختر المجلس القروي" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="المدينة وتوابعها">المدينة وتوابعها</SelectItem>
                        <SelectItem value="مجلس قروى الجزاير وجمصة">مجلس قروى الجزاير وجمصة</SelectItem>
                        <SelectItem value="مجلس قروى بلقاس خامس">مجلس قروى بلقاس خامس</SelectItem>
                        <SelectItem value="مجلس قروى الشوامى">مجلس قروى الشوامى</SelectItem>
                        <SelectItem value="مجلس قروى الستامونى">مجلس قروى الستامونى</SelectItem>
                        <SelectItem value="مجلس قروى المعصرة">مجلس قروى المعصرة</SelectItem>
                        <SelectItem value="مجلس قروى بسنديلة والزهراء">مجلس قروى بسنديلة والزهراء</SelectItem>
                        <SelectItem value="مجلس قروى الحفير وقلابشو">مجلس قروى الحفير وقلابشو</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{descriptionLabel}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={descriptionPlaceholder}
                      className="min-h-[120px] bg-background resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {requestType !== "proposal" && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>العنوان بالتفصيل</FormLabel>
                      <div className="space-y-3">
                        <FormControl>
                          <Input 
                            placeholder="مثلاً: شارع البحر، أمام صيدلية الأمل" 
                            {...field} 
                            value={field.value || ""}
                            className="bg-background h-12" 
                          />
                        </FormControl>
                        
                        <div className="flex flex-col gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleGetLocation}
                            disabled={isGettingLocation}
                            title="تحديد موقعي الحالي (GPS)"
                            className="w-full flex items-center justify-center gap-2 h-12 bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary font-bold transition-all"
                          >
                            {isGettingLocation ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Navigation className="h-4 w-4" />
                            )}
                            <span>تحديد موقعي تلقائياً (GPS)</span>
                          </Button>
                          <p className="text-xs text-muted-foreground text-center">
                            اضغط على الزر أعلاه لتحديد مكانك بدقة عبر الخريطة (GPS) بدلاً من كتابة العنوان يدوياً
                          </p>
                        </div>
                      </div>
                      {form.getValues("location") && (
                        <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          تم تحديد الموقع الجغرافي (GPS)
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <FormItem>
              <FormLabel>{uploadLabel} (يمكنك إضافة أكثر من صورة)</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type="file" 
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="bg-background cursor-pointer"
                    data-testid="input-images"
                  />
                  <div className="absolute right-3 top-2.5 pointer-events-none">
                    {isUploading ? (
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    ) : uploadedImages.length > 0 ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </FormControl>
              {uploadedImages.length > 0 && (
                <div className="mt-2 space-y-2">
                  <p className="text-xs text-green-600">تم إرفاق {uploadedImages.length} صورة</p>
                  <div className="flex flex-wrap gap-2">
                    {uploadedImages.map((img, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={img} 
                          alt={`صورة ${index + 1}`} 
                          className="w-16 h-16 object-cover rounded-lg border border-border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -left-2 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                          data-testid={`button-remove-image-${index}`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <FormMessage />
            </FormItem>

            <Button 
              type="submit" 
              className="w-full py-6 text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
              disabled={createRequest.isPending || isUploading}
            >
              {createRequest.isPending ? (
                <>
                  <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Send className="ml-2 h-5 w-5" />
                  إرسال الطلب
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
