import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Info } from "lucide-react";

const About = () => {
    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30">
            <Navbar />

            <main className="pt-32 pb-20">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 neon-glow">
                            <Info size={32} />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">About <span className="text-blue-500">PDFlex</span></h1>
                            <div className="w-24 h-1 bg-blue-600/30 rounded-full mt-2" />
                        </div>
                    </div>

                    <div className="glass-card p-10 md:p-16 rounded-[3rem] border-white/5 space-y-8 text-left">
                        <p className="text-slate-300 text-xl font-medium leading-relaxed">
                            PDFlex is a free online document processing platform designed to help users convert, merge, and optimize PDF files quickly and securely.
                        </p>

                        <p className="text-slate-400 text-lg leading-relaxed">
                            Our mission is to provide fast, simple, and privacy-focused document tools accessible to everyone. We believe that professional-grade document handling shouldn't require complex software or expensive subscriptions.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                            <div className="space-y-4">
                                <h3 className="text-white font-black uppercase tracking-widest text-sm">Our Focus</h3>
                                <p className="text-slate-400 text-sm">We focus on ease of use and speed. Every tool on our platform is optimized to deliver results in the shortest time possible without sacrificing quality.</p>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-white font-black uppercase tracking-widest text-sm">Your Privacy</h3>
                                <p className="text-slate-400 text-sm">Privacy is at the core of PDFlex. We do not store your documents permanently. All files are automatically deleted after processing is complete.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default About;
