import { Facebook, Twitter, Mail, Phone, MapPin, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export function Footer() {
  const { user, logout } = useAuth();
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="text-xl font-bold font-display mb-6 text-primary-foreground">النائب عوض أبو النجا</h3>
            <p className="text-slate-400 mb-6 leading-relaxed">
              نسعى دائماً لخدمتكم وتلبية احتياجاتكم. صوتكم مسموع وطلباتكم أوامر. معاً نبني مستقبلاً أفضل لدائرتنا ووطننا الحبيب.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/share/1C659RpFcs/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold font-display mb-6 text-primary-foreground">تواصل معنا</h3>
            <ul className="space-y-4 text-slate-400">
              <li className="flex items-start gap-3">
                <div className="flex flex-col gap-3">
                  <a href="tel:+201000313471" className="flex items-center gap-2 hover:text-primary transition-colors font-bold" dir="ltr">
                    <Phone className="w-4 h-4 text-primary" />
                    +20 10 00313471
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <span>awad.abuelnaga@cbe.org.eg</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=31.213407,31.364934" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors leading-relaxed"
                >
                  عنوان المكتب الرئيسى بمدينة بلقاس
                  <br />
                  <span className="text-xs text-slate-500">(موقع المكتب على الخريطة)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} جميع الحقوق محفوظة لمكتب النائب د. عوض أبو النجا</p>
          <a 
            href="/team" 
            className="mt-4 inline-block text-slate-600 hover:text-primary transition-colors text-xs"
            data-testid="link-team-login"
          >
            دخول فريق العمل
          </a>
        </div>
      </div>
    </footer>
  );
}
