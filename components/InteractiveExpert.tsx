
import React, { useState, useEffect, useRef } from 'react';
import { EXPERT_KNOWLEDGE } from '../constants';

const InteractiveExpert: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('storage');
  const [personality, setPersonality] = useState<'mentor' | 'friend'>('mentor');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', content: string, citation?: string}[]>([
    { 
      role: 'ai', 
      content: '您好。我是数字药学导师。我已为您加载了最新的胰岛素临床知识库。请注意：本系统仅供药学知识科普参考，不作为临床诊断依据。所有用药调整请务必【谨遵医嘱】。' 
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingStatus, setTypingStatus] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping]);

  const handleAsk = (question: string, answer: string, citation?: string) => {
    if (isTyping) return;
    
    setChatHistory(prev => [...prev, { role: 'user', content: question }]);
    setIsTyping(true);

    const statuses = ['正在检索离线知识库...', '正在模拟临床路径...', '正在生成专家建议...'];
    let statusIdx = 0;
    
    const statusInterval = setInterval(() => {
      setTypingStatus(statuses[statusIdx]);
      statusIdx++;
      if (statusIdx >= statuses.length) clearInterval(statusInterval);
    }, 400);

    setTimeout(() => {
      setIsTyping(false);
      setTypingStatus('');
      
      const prefix = personality === 'mentor' 
        ? "【专家意见】： " 
        : "嗨，这个你需要注意哦： ";
      
      setChatHistory(prev => [...prev, { 
        role: 'ai', 
        content: prefix + answer,
        citation: citation
      }]);
    }, 1500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto glass rounded-[3.5rem] border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col lg:flex-row h-[850px]">
      
      {/* 极客侧边栏：数字身份 */}
      <div className="lg:w-[350px] bg-slate-900/80 border-r border-white/10 p-10 flex flex-col relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-transparent opacity-50"></div>
        
        {/* 数字人视觉区域 */}
        <div className="relative w-48 h-48 mx-auto mb-10 group mt-10">
          <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="relative w-full h-full border-2 border-blue-500/30 rounded-full flex items-center justify-center p-2 group-hover:border-blue-400/60 transition-colors">
            <div className="w-full h-full bg-slate-800 rounded-full flex items-center justify-center overflow-hidden relative shadow-inner">
               <svg viewBox="0 0 24 24" className={`w-28 h-28 text-blue-500/80 transition-all duration-700 ${isTyping ? 'scale-110 opacity-100 rotate-12' : 'scale-100 opacity-60'}`} fill="currentColor">
                 <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
               </svg>
               <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent h-1/4 w-full animate-[scan_4s_linear_infinite]"></div>
            </div>
          </div>
          <div className="absolute bottom-2 right-4 w-5 h-5 bg-green-500 rounded-full border-4 border-slate-900 shadow-[0_0_15px_rgba(34,197,94,0.6)]"></div>
        </div>

        <div className="text-center mb-10">
          <h3 className="text-xl font-black text-white mb-2 tracking-tighter uppercase">Pharmacist AI Core</h3>
          <p className="text-[10px] text-slate-500 font-bold tracking-[0.4em] uppercase">Security Level: 04</p>
        </div>

        {/* 性格模式切换 */}
        <div className="bg-black/40 p-1 rounded-2xl border border-white/5 flex mb-10">
           <button 
            onClick={() => setPersonality('mentor')}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${personality === 'mentor' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:text-slate-400'}`}
           >
             资深导师
           </button>
           <button 
            onClick={() => setPersonality('friend')}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${personality === 'friend' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-600 hover:text-slate-400'}`}
           >
             暖心助手
           </button>
        </div>

        {/* 侧边免责提示 */}
        <div className="mt-auto p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
          <div className="flex items-center gap-2 mb-2 text-amber-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-[10px] font-black uppercase tracking-widest">Medical Disclaimer</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
            本模型仅提供通用药学参考。病情差异大，任何治疗变更请务必咨询您的主治医师。
          </p>
        </div>
      </div>

      {/* 主对话区 */}
      <div className="flex-1 flex flex-col bg-[#03081a] relative">
        
        {/* 顶部分类导航 */}
        <div className="flex overflow-x-auto p-6 gap-3 border-b border-white/5 scrollbar-hide">
           {EXPERT_KNOWLEDGE.categories.map(cat => (
             <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-3 rounded-2xl whitespace-nowrap text-xs font-black transition-all flex items-center gap-2 border ${
                activeCategory === cat.id 
                ? 'bg-blue-600/10 border-blue-500/50 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.1)]' 
                : 'bg-white/5 border-transparent text-slate-500 hover:bg-white/10 hover:text-slate-300'
              }`}
             >
               <span>{cat.icon}</span>
               <span className="tracking-widest uppercase">{cat.name}</span>
             </button>
           ))}
        </div>

        {/* 对话提醒 Bar */}
        <div className="bg-blue-500/5 px-10 py-3 border-b border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
             <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">安全提醒：请勿擅自更改给药剂量</span>
           </div>
           <span className="text-[10px] font-black text-blue-400/60 uppercase">遵医嘱执行</span>
        </div>

        {/* 消息流 */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8">
          {chatHistory.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in`}>
              <div className={`max-w-[85%] group ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-6 rounded-3xl text-base leading-relaxed font-medium shadow-2xl ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'glass border-white/10 text-slate-200 rounded-tl-none backdrop-blur-3xl'
                }`}>
                  {msg.content}
                </div>
                {msg.citation && (
                   <div className="mt-3 px-4 py-1 text-[10px] font-black text-slate-600 uppercase tracking-widest animate-in flex justify-between items-center w-full">
                     <span>REF: {msg.citation}</span>
                     {msg.role === 'ai' && <span className="text-amber-500/60 font-bold">⚠️ 建议咨询医师</span>}
                   </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start animate-pulse">
              <div className="glass border-white/10 p-5 rounded-3xl rounded-tl-none flex flex-col gap-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
                <span className="text-[10px] font-black text-blue-400/60 uppercase tracking-widest">{typingStatus}</span>
              </div>
            </div>
          )}
        </div>

        {/* 提问快捷区 */}
        <div className="p-10 border-t border-white/10 bg-slate-900/30">
          <div className="flex items-center gap-4 mb-6">
             <div className="w-1.5 h-6 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
             <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">
                {EXPERT_KNOWLEDGE.categories.find(c => c.id === activeCategory)?.name} - 深度解析
             </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EXPERT_KNOWLEDGE.faqs.filter(f => f.cat === activeCategory).map((faq, idx) => (
              <button 
                key={idx}
                onClick={() => handleAsk(faq.question, faq.answer, faq.citation)}
                disabled={isTyping}
                className="group p-5 rounded-2xl bg-white/[0.03] border border-white/5 text-left transition-all hover:bg-blue-600/20 hover:border-blue-500/30 disabled:opacity-50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-400 group-hover:text-blue-300">{faq.question}</span>
                  <svg className="w-4 h-4 text-slate-700 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(400%); opacity: 0; }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default InteractiveExpert;
