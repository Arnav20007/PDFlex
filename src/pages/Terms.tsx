import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Scale } from "lucide-react";

const Terms = () => {
    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30">
            <Navbar />

            <main className="pt-32 pb-20">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="flex items-center gap-4 mb-12 text-left">
                        <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 neon-glow">
                            <Scale size={32} />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">Terms of <span className="text-blue-500">Service</span></h1>
                            <div className="w-24 h-1 bg-blue-600/30 rounded-full mt-2" />
                        </div>
                    </div>

                    <div className="glass-card p-10 md:p-16 rounded-[3rem] border-white/5 space-y-8 text-left text-slate-400">
                        <section>
                            <h2 className="text-white font-black uppercase tracking-widest text-lg mb-4">1. Acceptance of Terms</h2>
                            <p>By accessing or using PDFlex, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
                        </section>

                        <section>
                            <h2 className="text-white font-black uppercase tracking-widest text-lg mb-4">2. Use of Service</h2>
                            <p>You may use PDFlex for lawful purposes only. You are responsible for all documents you upload and must ensure you have the right to process them. You may not use our service for any illegal or unauthorized purpose.</p>
                        </section>

                        <section>
                            <h2 className="text-white font-black uppercase tracking-widest text-lg mb-4">3. Intellectual Property</h2>
                            <p>PDFlex and its original content, features, and functionality are the exclusive property of PDFlex. Users retain all rights to the documents they upload and process.</p>
                        </section>

                        <section>
                            <h2 className="text-white font-black uppercase tracking-widest text-lg mb-4">4. Limitation of Liability</h2>
                            <p>PDFlex provided "as is" without warranty of any kind. We shall not be liable for any direct, indirect, or consequential damages resulting from the use or inability to use our services.</p>
                        </section>

                        <section>
                            <h2 className="text-white font-black uppercase tracking-widest text-lg mb-4">5. Disclaimer</h2>
                            <p>We do not guarantee that the service will be uninterrupted or error-free. We reserve the right to modify or discontinue the service at any time without notice.</p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Terms;
