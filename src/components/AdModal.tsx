import { Button } from "@/components/ui/button";
import { X, Zap, Loader2 } from "lucide-react";

interface AdModalProps {
  open: boolean;
  onClose: () => void;
  onAdComplete: () => void;
  adType: string;
  rewardMessage: string;
}

const AdModal = ({ open, onClose, onAdComplete, rewardMessage }: AdModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-[#020617]/95 backdrop-blur-2xl flex items-center justify-center z-[200] animate-in fade-in duration-500">
      <div className="glass-card rounded-[3rem] p-10 max-w-md w-full mx-4 relative border-white/10 text-center">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="w-20 h-20 bg-blue-600/20 rounded-3xl flex items-center justify-center mx-auto mb-8 neon-glow">
          <Zap className="w-10 h-10 text-blue-500 fill-current" />
        </div>

        <h3 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase">Daily <span className="text-blue-500">Limit</span></h3>
        <p className="text-slate-400 font-medium mb-10 leading-relaxed">
          {rewardMessage || "Watch a short ad to recharge your daily conversion limits."}
        </p>

        <div className="flex flex-col gap-4">
          <Button
            onClick={onAdComplete}
            className="h-16 bg-blue-600 hover:bg-blue-500 text-white font-black text-xl rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all hover:scale-105 active:scale-95 group"
          >
            <Loader2 className="mr-2 w-6 h-6 animate-spin group-hover:hidden" />
            WATCH & REDEEM
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-slate-500 hover:text-white font-bold"
          >
            Cancel
          </Button>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-center gap-2 opacity-50">
          <Zap className="w-3 h-3 text-blue-500" />
          <span className="text-[10px] font-black tracking-[0.2em] uppercase">Secure Connection</span>
        </div>
      </div>
    </div>
  );
};

export default AdModal;