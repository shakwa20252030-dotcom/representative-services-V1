import { useState, useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';

export function InstallPWA() {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    const triggerHandler = (e: any) => {
      if (promptInstall) {
        promptInstall.prompt();
        promptInstall.userChoice.then((choiceResult: any) => {
          if (choiceResult.outcome === 'accepted') {
            setIsVisible(false);
          }
        });
      } else {
        // Fallback for when the prompt is not yet available but user clicked
        console.log('Install prompt not yet captured');
      }
    };
    window.addEventListener('pwa-install-trigger', triggerHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('pwa-install-trigger', triggerHandler);
    };
  }, [promptInstall]);

  const onClick = (e: any) => {
    e.preventDefault();
    if (!promptInstall) return;
    promptInstall.prompt();
    promptInstall.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setIsVisible(false);
      } else {
        console.log('User dismissed the install prompt');
      }
    });
  };

  if (!supportsPWA || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[100] md:left-auto md:w-96 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-card border border-border rounded-xl p-4 shadow-2xl flex items-center gap-4">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Download className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-sm">تثبيت التطبيق</h4>
          <p className="text-xs text-muted-foreground">ثبت تطبيق بوابة الخدمات للوصول السريع</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={onClick} size="sm" className="font-bold">
            تثبيت
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsVisible(false)} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
