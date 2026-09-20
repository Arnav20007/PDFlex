import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Mail, MessageCircle } from "lucide-react";

const Contact = () => {
    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30">
            <Navbar />

            <main className="pt-32 pb-20">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 neon-glow">
                            <MessageCircle size={32} />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">Contact <span className="text-blue-500">Us</span></h1>
                            <div className="w-24 h-1 bg-blue-600/30 rounded-full mt-2" />
                        </div>
                    </div>

                    <div className="glass-card p-10 md:p-16 rounded-[3rem] border-white/5 text-center">
                        <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">Have questions or feedback?</h2>
                        <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto">
                            We are constantly working to improve PDFlex. If you encounter any issues or have suggestions for new tools, please reach out to us.
                        </p>

                        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 flex flex-col items-center group hover:border-blue-500/30 transition-all duration-500">
                            <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                                <Mail size={24} />
                            </div>
                            <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">Email Support</h3>
                            <a href="mailto:support@pdflex.site" className="text-2xl font-black text-blue-500 hover:text-blue-400 transition-colors italic">
                                support@pdflex.site
                            </a>
                        </div>

                        <p className="mt-12 text-slate-500 text-xs font-black uppercase tracking-widest">
                            Our support team typically responds within 24-48 hours.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;
