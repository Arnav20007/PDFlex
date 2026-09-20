import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Cpu, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/");
    });
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        toast({ title: "Welcome back!", description: "Successfully signed in." });
        navigate("/");
      } else {
        const { error, data } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: fullName.trim() },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        if (data.session) {
          toast({ title: "Account created!", description: "Welcome to PDFlex!" });
          navigate("/");
        } else {
          toast({ title: "Verify your email", description: "Confirmation link sent." });
          setIsLogin(true);
        }
      }
    } catch (error: any) {
      toast({
        title: "Auth Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30">
      <Navbar />

      <div className="relative flex items-center justify-center p-4 pt-32 pb-20 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10 animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px] -z-10 animate-pulse-slow delay-1000" />

        <Card className="w-full max-w-md glass-card rounded-[3rem] border-white/5 overflow-hidden animate-fade-in relative z-10">
          <CardHeader className="text-center pt-12 pb-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center neon-glow">
                <Cpu className="text-white w-8 h-8" />
              </div>
            </div>
            <CardTitle className="text-4xl font-black uppercase tracking-tight italic mb-2">
              {isLogin ? (
                <>Sign <span className="text-blue-500">In</span></>
              ) : (
                <>Sign <span className="text-blue-500">Up</span></>
              )}
            </CardTitle>
            <p className="text-slate-400 font-medium">
              {isLogin ? "Welcome back to PDFlex" : "Create your account today"}
            </p>
          </CardHeader>

          <CardContent className="px-10 pb-12">
            <form onSubmit={handleAuth} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2">Full Name</Label>
                  <Input
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-14 bg-white/5 border-white/10 rounded-2xl focus:border-blue-500 focus:ring-0 transition-all px-6 text-white"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2">Email</Label>
                <Input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 bg-white/5 border-white/10 rounded-2xl focus:border-blue-500 focus:ring-0 transition-all px-6 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2">Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 bg-white/5 border-white/10 rounded-2xl focus:border-blue-500 focus:ring-0 transition-all px-6 pr-12 text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white font-black text-lg rounded-2xl neon-glow transition-all hover:scale-[1.02] active:scale-95 uppercase tracking-tighter"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (isLogin ? "Continue" : "Register")}
              </Button>
            </form>

            <div className="mt-8 pt-8 border-t border-white/5 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-slate-400 hover:text-blue-400 font-bold transition-colors text-sm uppercase tracking-widest"
              >
                {isLogin ? "New user? Create account" : "Existing user? Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;