import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  colorClass: string;
  onClick?: () => void;
}

export function ServiceCard({ icon: Icon, title, description, colorClass, onClick }: ServiceCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      onClick={onClick}
      className={`bg-card rounded-xl p-6 shadow-sm border border-border/50 hover:shadow-lg transition-all duration-300 ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${colorClass} group-hover:scale-110 transition-transform`}>
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-bold mb-2 font-display">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}
