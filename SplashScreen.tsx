import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import mpImage from "../assets/FB_IMG_1759927010195_1767452714698.jpg";

export function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onFinish, 500); // Wait for exit animation
    }, 1500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background text-right"
          dir="rtl"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center space-y-8"
          >
            <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto">
              <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse scale-110"></div>
              <img
                src={mpImage}
                alt="دكتور عوض أبو النجا"
                className="relative z-10 w-full h-full object-cover rounded-full border-4 border-primary shadow-2xl"
              />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-2xl md:text-4xl font-bold font-display text-primary px-4">
                أهلاً بكم في الموقع الإلكتروني للنائب عوض أبو النجا
              </h1>
              <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
