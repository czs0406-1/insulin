
import React, { useEffect, useState, useCallback } from 'react';
import InteractiveExpert from './components/InteractiveExpert';
import HistoryTimeline from './components/HistoryTimeline';
import InsulinTypes from './components/InsulinTypes';
import InteractiveLab from './components/InteractiveLab';

const App: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-blue-500/30 font-sans">
      {/* 全局极光背景层 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/15 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/15 blur-[120px] rounded-full animate-pulse [animation-delay:2s]"></div>
        <div className="absolute top-[30%] left-[40%] w-[20%] h-[20%] bg-cyan-500/10 blur-[80px] rounded-full"></div>
      </div>

      {/* 顶部导航 */}
      <nav className="fixed top-0 left-0 right-0 z-[100] p-6">
        <div className={`max-w-6xl mx-auto rounded-3xl transition-all duration-500 px-8 py-4 flex justify-between items-center ${
          scrollY > 50 ? 'bg-slate-900/40 backdrop-blur-2xl shadow-2xl border border-white/10' : 'bg-transparent border-transparent'
        }`}>
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-[0_0_20px_rgba(59,130,246,0.5)]">I</div>
            <span className="font-black text-2xl tracking-tighter">INSULIN<span className="text-blue-500">.EDU</span></span>
          </div>
          <div className="hidden md:flex space-x-10 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
            <button onClick={() => scrollToSection('history')} className="hover:text-blue-400 transition-colors">历史</button>
            <button onClick={() => scrollToSection('types')} className="hover:text-blue-400 transition-colors">药学</button>
            <button onClick={() => scrollToSection('lab')} className="hover:text-blue-400 transition-colors">实验室</button>
            <button onClick={() => scrollToSection('expert')} className="hover:text-blue-400 transition-colors">咨询</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-60 pb-48 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-24">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-10 shadow-inner">
                Digital Human Pharmacy Project
              </div>
              <h1 className="text-7xl lg:text-9xl font-black tracking-tighter mb-12 leading-[0.85] text-white">
                生命的<br />
                <span className="gradient-text">奇迹分子</span>
              </h1>
              <p className="text-2xl text-slate-400 mb-14 max-w-2xl leading-relaxed font-medium">
                从1921年的多伦多实验室到数字孪生时代，探索这枚改变人类命运的“金钥匙”。
              </p>
              <div className="flex flex-wrap gap-8 justify-center lg:justify-start">
                <button 
                  onClick={() => scrollToSection('lab')}
                  className="group relative bg-blue-600 hover:bg-blue-500 text-white px-12 py-6 rounded-2xl font-black shadow-[0_20px_40px_rgba(59,130,246,0.3)] transition-all hover:-translate-y-2 flex items-center gap-4"
                >
                  <span className="relative z-10">探索交互实验室</span>
                  <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>
            </div>
            
            <div className="flex-1 w-full relative">
              <div className="relative group perspective-1000">
                <div className="absolute -inset-20 bg-blue-500/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="relative glass p-6 rounded-[5rem] border-white/20 shadow-[0_0_100px_rgba(0,0,0,0.6)] transform group-hover:rotate-y-6 transition-transform duration-700">
                  <img 
                    src="https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=1000" 
                    alt="Digital Medical Scan" 
                    className="rounded-[4rem] w-full h-[600px] object-cover opacity-90 brightness-110"
                  />
                  <div className="absolute top-12 -left-12 glass p-8 rounded-3xl border-blue-500/30 float shadow-2xl">
                    <div className="text-blue-400 font-black text-4xl mb-1">51</div>
                    <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Molecular Weight</div>
                  </div>
                  <div className="absolute bottom-20 -right-12 glass p-8 rounded-3xl border-purple-500/30 float shadow-2xl" style={{animationDelay: '-3s'}}>
                    <div className="text-purple-400 font-black text-4xl mb-1">100Y+</div>
                    <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Discovery Era</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section id="history" className="bg-slate-950/20">
          <HistoryTimeline />
        </section>

        <section id="types">
          <InsulinTypes />
        </section>

        {/* 新增交互实验室章节 */}
        <section id="lab" className="py-40 relative">
          <div className="max-w-6xl mx-auto px-6 mb-24 text-center">
            <span className="text-blue-500 font-black text-xs uppercase tracking-[0.5em] mb-6 block">Interactive Sandbox</span>
            <h2 className="text-5xl md:text-7xl font-black mb-10">药学交互实验室</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-xl font-medium">通过可视化模拟与知识挑战，深度解构胰岛素的药理奥秘。</p>
          </div>
          <InteractiveLab />
        </section>

        <section id="expert" className="py-48 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
          
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-28">
              <span className="text-blue-500 font-black text-xs uppercase tracking-[0.5em] mb-6 block">Intelligent Interaction</span>
              <h2 className="text-5xl md:text-7xl font-black mb-8">数字专家交互中心</h2>
              <div className="w-32 h-2.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 mx-auto rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>
            </div>
            <InteractiveExpert />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-white/5 py-24 px-6 overflow-hidden relative">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="flex items-center justify-center space-x-4 mb-12">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-xl shadow-blue-900/40">I</div>
            <span className="text-3xl font-black tracking-tighter">药学之美<span className="text-blue-500">.DIGITAL</span></span>
          </div>
          <p className="text-slate-500 text-lg max-w-3xl mx-auto leading-relaxed mb-16 font-medium">
            我们致力于打破科学与大众的围墙，通过全本地化的交互模型，让每一次药学知识的学习都成为一场华丽的数字奥德赛。
          </p>
          <div className="flex justify-center gap-12 text-[11px] font-black uppercase tracking-[0.3em] text-slate-700">
            <button onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="hover:text-white transition-colors">Top</button>
            <button onClick={() => scrollToSection('history')} className="hover:text-white transition-colors">History</button>
            <button onClick={() => scrollToSection('lab')} className="hover:text-white transition-colors">Laboratory</button>
            <button onClick={() => scrollToSection('expert')} className="hover:text-white transition-colors">Expert</button>
          </div>
          <div className="mt-16 pt-12 border-t border-white/5 text-slate-800 text-[10px] font-bold uppercase tracking-widest">
            &copy; 2024 DIGITAL PHARMACY COMMUNICATION LAB. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
