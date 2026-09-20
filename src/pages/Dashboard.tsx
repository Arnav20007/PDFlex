import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import AdModal from "@/components/AdModal";
import { FileText, Upload, PlayCircle, Download, Clock, BarChart3, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";

interface Conversion {
  id: string;
  original_filename: string;
  input_format: string;
  output_format: string;
  status: string;
  created_at: string;
  converted_file_url?: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [loading, setLoading] = useState(true);
  const [dailyConversions, setDailyConversions] = useState(0);
  const [showAdModal, setShowAdModal] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const dailyLimit = 5;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      loadUserData(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      loadUserData(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadUserData = async (userId: string) => {
    try {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("daily_conversions_count, daily_conversions_reset_at")
        .eq("id", userId)
        .single();

      if (profileData) {
        const resetTime = new Date(profileData.daily_conversions_reset_at);
        const now = new Date();
        const hoursSinceReset = (now.getTime() - resetTime.getTime()) / (1000 * 60 * 60);

        if (hoursSinceReset >= 24) {
          await supabase
            .from("profiles")
            .update({
              daily_conversions_count: 0,
              daily_conversions_reset_at: now.toISOString()
            })
            .eq("id", userId);
          setDailyConversions(0);
        } else {
          setDailyConversions(profileData.daily_conversions_count || 0);
        }
      }

      const { data: conversionsData } = await supabase
        .from("conversions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10);

      setConversions(conversionsData || []);
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdComplete = async () => {
    setShowAdModal(false);
    if (user) {
      await supabase
        .from("profiles")
        .update({
          daily_conversions_count: 0,
          daily_conversions_reset_at: new Date().toISOString()
        })
        .eq("id", user.id);

      await supabase.from("ad_views").insert({
        user_id: user.id,
        ad_type: "rewarded"
      });

      setDailyConversions(0);
      toast({
        title: "Limits Reset",
        description: "Your daily conversion limit has been reset.",
      });
    }
  };

  const handleDownload = async (conversion: Conversion) => {
    if (!conversion.converted_file_url) return;
    try {
      const { data, error } = await supabase.storage
        .from('conversions')
        .download(conversion.converted_file_url);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${conversion.original_filename.split('.')[0]}_converted.${conversion.output_format.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      toast({ title: "Download failed", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-blue-500 font-black tracking-widest uppercase text-xs">Loading Dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30">
      <Navbar />

      <AdModal
        open={showAdModal}
        onClose={() => setShowAdModal(false)}
        onAdComplete={handleAdComplete}
        adType="rewarded"
        rewardMessage="Reset your daily limit by watching an ad."
      />

      <main className="pt-32 pb-20 px-4 flex-grow">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 animate-fade-in text-left">
            <h1 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter italic">
              User <span className="text-blue-500">Dashboard</span>
            </h1>
            <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-2xl">
              Manage your conversions and monitor your daily usage.
              Connected as <span className="text-white font-bold">{user?.email}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-fade-in delay-100">
            <Card className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6 text-slate-500">
                  <BarChart3 size={18} />
                  <span className="text-xs font-black uppercase tracking-widest">Daily Usage</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-black italic tracking-tighter">{dailyConversions}</span>
                  <span className="text-slate-500 font-black tracking-widest uppercase text-xs pb-2">/ {dailyLimit} Limits</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full mt-6 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 neon-glow transition-all duration-1000"
                    style={{ width: `${(dailyConversions / dailyLimit) * 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6 text-slate-500">
                  <Clock size={18} />
                  <span className="text-xs font-black uppercase tracking-widest">Total Processing</span>
                </div>
                <div className="text-5xl font-black italic tracking-tighter">{conversions.length}</div>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-6">All-time conversions</p>
              </CardContent>
            </Card>

            <Card className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden bg-blue-600/5 border-blue-600/10">
              <CardContent className="p-8 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-6 text-blue-500">
                    <Shield size={18} />
                    <span className="text-xs font-black uppercase tracking-widest">Security Status</span>
                  </div>
                  <div className="text-3xl font-black tracking-tighter uppercase italic text-white flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    Encrypted
                  </div>
                </div>
                {dailyConversions >= dailyLimit ? (
                  <Button
                    onClick={() => setShowAdModal(true)}
                    className="mt-6 h-14 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl neon-glow uppercase tracking-widest text-xs"
                  >
                    <PlayCircle size={18} className="mr-2" />
                    Recharge Limits
                  </Button>
                ) : (
                  <Button
                    onClick={() => navigate("/#upload-section")}
                    className="mt-6 h-14 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl border border-white/10 uppercase tracking-widest text-xs"
                  >
                    <Upload size={18} className="mr-2" />
                    New Conversion
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="glass-card rounded-[3rem] border-white/5 overflow-hidden animate-fade-in delay-200">
            <CardHeader className="p-8 border-b border-white/5">
              <CardTitle className="text-2xl font-black uppercase tracking-tighter italic">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {conversions.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-600">
                    <FileText size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No documents found</h3>
                  <p className="text-slate-500 font-medium">Start your first conversion to see it here.</p>
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/#upload-section")}
                    className="mt-8 text-blue-500 font-black uppercase tracking-widest text-xs"
                  >
                    Go to workspace
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="pb-6 text-xs font-black text-slate-500 uppercase tracking-widest">Document</th>
                        <th className="pb-6 text-xs font-black text-slate-500 uppercase tracking-widest">Type</th>
                        <th className="pb-6 text-xs font-black text-slate-500 uppercase tracking-widest">Status</th>
                        <th className="pb-6 text-xs font-black text-slate-500 uppercase tracking-widest">Date</th>
                        <th className="pb-6 text-right text-xs font-black text-slate-500 uppercase tracking-widest">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {conversions.map((conv) => (
                        <tr key={conv.id} className="group transition-colors hover:bg-white/5">
                          <td className="py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500">
                                <FileText size={18} />
                              </div>
                              <span className="font-bold text-slate-200 truncate max-w-[200px]">{conv.original_filename}</span>
                            </div>
                          </td>
                          <td className="py-6">
                            <Badge variant="outline" className="h-6 px-3 border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400">
                              {conv.input_format} → {conv.output_format}
                            </Badge>
                          </td>
                          <td className="py-6">
                            <div className="flex items-center gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full ${conv.status === 'completed' ? 'bg-blue-500' : 'bg-amber-500'} ${conv.status === 'completed' ? 'neon-glow' : ''}`} />
                              <span className="font-black italic uppercase tracking-widest text-[10px] text-white underline decoration-blue-500/30 underline-offset-4">{conv.status}</span>
                            </div>
                          </td>
                          <td className="py-6 text-sm text-slate-500 font-medium">
                            {new Date(conv.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-6 text-right">
                            {conv.status === 'completed' && conv.converted_file_url && (
                              <Button
                                onClick={() => handleDownload(conv)}
                                className="h-10 w-10 p-0 bg-white/5 hover:bg-blue-600 text-slate-400 hover:text-white border border-white/10 rounded-xl transition-all"
                              >
                                <Download size={16} />
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;