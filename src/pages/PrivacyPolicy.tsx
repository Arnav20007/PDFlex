import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FileText } from "lucide-react";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30">
            <Navbar />

            <main className="pt-32 pb-20">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="flex items-center gap-4 mb-12 text-left">
                        <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 neon-glow">
                            <FileText size={32} />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">Privacy <span className="text-blue-500">Policy</span></h1>
                            <div className="w-24 h-1 bg-blue-600/30 rounded-full mt-2" />
                        </div>
                    </div>

                    <div className="glass-card p-10 md:p-16 rounded-[3rem] border-white/5 space-y-8 text-left text-slate-400">
                        <section>
                            <h2 className="text-white font-black uppercase tracking-widest text-lg mb-4">1. Introduction</h2>
                            <p>Welcome to PDFlex. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we handle your data when you use our website.</p>
                        </section>

                        <section>
                            <h2 className="text-white font-black uppercase tracking-widest text-lg mb-4">2. Document Privacy</h2>
                            <p>PDFlex is a privacy-first platform. We do not store your documents permanently. Any file uploaded for conversion is processed in a secure environment and is automatically deleted from our servers within 60 minutes of completion.</p>
                        </section>

                        <section>
                            <h2 className="text-white font-black uppercase tracking-widest text-lg mb-4">3. Information We Collect</h2>
                            <p>We do not require user accounts for basic tool usage. We may collect minimal non-personal information such as browser type and usage statistics to improve our services. We do not sell or share any user data with third parties.</p>
                        </section>

                        <section>
                            <h2 className="text-white font-black uppercase tracking-widest text-lg mb-4">4. Cookies</h2>
                            <p>We use essential cookies to manage your daily tool usage limits. You can control cookie settings through your browser, but some features may not function correctly if cookies are disabled.</p>
                        </section>

                        <section>
                            <h2 className="text-white font-black uppercase tracking-widest text-lg mb-4">5. Contact</h2>
                            <p>If you have any questions about this Privacy Policy, please contact us at support@pdflex.site.</p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
