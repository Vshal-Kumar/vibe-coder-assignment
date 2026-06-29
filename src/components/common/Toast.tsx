import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useToastStore } from "@/store/useToastStore";

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border text-sm font-medium ${
              toast.type === "success"
                ? "bg-slate-900/90 border-emerald-500/40 text-emerald-200 shadow-emerald-950/40"
                : toast.type === "error"
                ? "bg-slate-900/90 border-rose-500/40 text-rose-200 shadow-rose-950/40"
                : "bg-slate-900/90 border-purple-500/40 text-purple-200 shadow-purple-950/40"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === "success" && <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />}
              {toast.type === "error" && <AlertCircle size={18} className="text-rose-400 shrink-0" />}
              {toast.type === "info" && <Info size={18} className="text-purple-400 shrink-0" />}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors ml-2"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
