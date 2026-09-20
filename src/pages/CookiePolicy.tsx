import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Cookie } from "lucide-react";

const CookiePolicy = () => {
    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30">
            <Navbar />

            <main className="pt-32 pb-20">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="flex items-center gap-4 mb-12 text-left">
                        <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 neon-glow">
                            <Cookie size={32} />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">Cookie <span className="text-blue-500">Policy</span></h1>
                            <div className="w-24 h-1 bg-blue-600/30 rounded-full mt-2" />
                        </div>
                    </div>

                    <div className="glass-card p-10 md:p-16 rounded-[3rem] border-white/5 space-y-8 text-left text-slate-400">
                        <section>
                            <h2 className="text-white font-black uppercase tracking-widest text-lg mb-4">1. What are Cookies?</h2>
                            <p>Cookies are small text files stored on your device when you visit a website. They help the website function correctly and provide a better user experience.</p>
                        </section>

                        <section>
                            <h2 className="text-white font-black uppercase tracking-widest text-lg mb-4">2. How We Use Cookies</h2>
                            <p>PDFlex uses cookies only for essential functionality, such as tracking your daily free tool usage limits and maintaining your session security during processing.</p>
                        </section>

                        <section>
                            <h2 className="text-white font-black uppercase tracking-widest text-lg mb-4">3. Third-Party Cookies</h2>
                            <p>We may use third-party tools like Google AdSense which may set cookies to serve personalized advertisements based on your browsing history. You can manage your ad preferences through Google's settings.</p>
                        </section>

                        <section>
                            <h2 className="text-white font-black uppercase tracking-widest text-lg mb-4">4. Managing Cookies</h2>
                            <p>You can choose to disable cookies through your browser settings. However, please note that disabling cookies may affect your ability to use certain features on our platform.</p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CookiePolicy;
