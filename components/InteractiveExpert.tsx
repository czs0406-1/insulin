
import React, { useState, useEffect, useRef } from 'react';
import { EXPERT_KNOWLEDGE } from '../constants';
import { getGeminiResponse } from '../services/geminiService';

const InteractiveExpert: React.FC = () => {
  const [personality, setPersonality] = useState<'mentor' | 'friend'>('mentor');
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', content: string, citation?: string}[]>([
    { 
      role: 'ai', 
      content: '您好。我是数字药学导师。请注意：本系统仅供药学知识科普参考，不作为临床诊断依据。所有用药调整及剂量变更，请务必【谨遵医嘱】。您可以选择下方快捷问题，或直接向我自由提问。' 
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingStatus, setTypingStatus] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatHistory, isTyping]);

  const processResponse = async (question: string, predefinedAnswer?: string, citation?: string) => {
    if (isTyping || !question.trim()) return;
    
    setChatHistory(prev => [...prev, { role: 'user', content: question }]);
    setIsTyping(true);
    setTypingStatus('正在调取知识库...');

    if (predefinedAnswer) {
      setTimeout(() => {
        setIsTyping(false);
        const prefix = personality === 'mentor' ? "【专家解析】： " : "温馨提醒： ";
        setChatHistory(prev => [...prev, { 
          role: 'ai', 
          content: prefix + predefinedAnswer,
          citation: citation
        }]);
      }, 1000);
    } else {
      setTypingStatus('AI 专家深度思考中...');
      try {
        const response = await getGeminiResponse(question);
        setIsTyping(false);
        setChatHistory(prev => [...prev, { 
          role: 'ai', 
          content: response || "抱歉，由于算力调度问题，暂时无法生成回答。请务必咨询您的临床医师。" 
        }]);
      } catch (err) {
        setIsTyping(false);
        setChatHistory(prev => [...prev, { role: 'ai', content: "系统连接受限。如有紧急用药疑问，请咨询专业医师。" }]);
      }
    }
  };

  const handleSend = () => {
    const text = userInput;
    if (!text.trim()) return;
    setUserInput('');
    processResponse(text);
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row h-[800px] rounded-[2.5rem] overflow-hidden bg-[#0a0f25] border border-white/5 shadow-2xl">
      
      {/* 侧边栏：数字人面板 */}
      <aside className="lg:w-72 bg-[#0d122b] border-r border-white/5 flex flex-col items-center p-8">
        <div className="relative mb-8 group">
          <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-2xl group-hover:bg-cyan-500/30 transition-all"></div>
          <div className="relative w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-cyan-500/50 to-blue-500/50">
            <div className="w-full h-full rounded-full bg-[#111835] flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 24 24" className={`w-16 h-16 text-cyan-400/80 transition-all duration-700 ${isTyping ? 'scale-110' : 'scale-100'}`} fill="currentColor">
                 <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              {isTyping && <div className="absolute inset-0 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>}
            </div>
          </div>
          <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-[#0d122b] rounded-full"></div>
        </div>

        <div className="text-center mb-10">
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1">Pharmacist AI</h3>
          <p className="text-[10px] text-cyan-500/60 font-bold uppercase tracking-widest">Digital Mentor</p>
        </div>

        <nav className="w-full space-y-2 mb-10">
          <button 
            onClick={() => setPersonality('mentor')}
            className={`w-full py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-left flex items-center gap-3 ${personality === 'mentor' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-900/40' : 'text-slate-500 hover:bg-white/5'}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${personality === 'mentor' ? 'bg-white' : 'bg-slate-700'}`}></span>
            专家模式
          </button>
          <button 
            onClick={() => setPersonality('friend')}
            className={`w-full py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-left flex items-center gap-3 ${personality === 'friend' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'text-slate-500 hover:bg-white/5'}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${personality === 'friend' ? 'bg-white' : 'bg-slate-700'}`}></span>
            助手模式
          </button>
        </nav>

        <div className="mt-auto bg-amber-500/5 border border-amber-500/20 p-4 rounded-2xl">
           <div className="flex items-center gap-2 mb-2 text-amber-500">
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
             <span className="text-[9px] font-black uppercase tracking-widest">安全警示</span>
           </div>
           <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
             科普回复不具处方效力。所有治疗变更须由主治医师决定。
           </p>
        </div>
      </aside>

      {/* 主工作区 */}
      <main className="flex-1 flex flex-col bg-[#0b1029]">
        {/* 顶部警告吸顶条 */}
        <header className="px-8 py-3 bg-red-500/5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
             </span>
             <span className="text-[10px] font-black text-red-500/80 uppercase tracking-widest">
                核心准则：胰岛素使用必须严格遵医嘱
             </span>
          </div>
          <span className="text-[8px] font-bold text-slate-700 uppercase tracking-[0.3em]">AI-PHARMACY CORE v2.5.2</span>
        </header>

        {/* 聊天内容区 */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6">
          {chatHistory.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in`}>
              <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-lg ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-tr from-cyan-600 to-blue-600 text-white rounded-tr-none' 
                    : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none backdrop-blur-md'
                }`}>
                  {msg.content}
                </div>
                {msg.citation && (
                  <div className="mt-2 flex items-center gap-2 opacity-50 px-1">
                    <span className="text-[9px] font-black text-cyan-500 uppercase">Ref</span>
                    <span className="text-[9px] font-medium text-slate-500">{msg.citation}</span>
                  </div>
                )}
                {msg.role === 'ai' && i > 0 && (
                   <div className="mt-2 px-1 text-[8px] font-black text-amber-500/60 uppercase italic tracking-widest">
                     谨遵医嘱 · 非诊断建议
                   </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start animate-pulse">
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
                 <div className="flex gap-1">
                   <div className="w-1 h-1 bg-cyan-500 rounded-full animate-bounce"></div>
                   <div className="w-1 h-1 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                   <div className="w-1 h-1 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                 </div>
                 <span className="text-[10px] font-bold text-cyan-500/60 uppercase tracking-widest">{typingStatus}</span>
              </div>
            </div>
          )}
        </div>

        {/* 交互输入区 */}
        <footer className="p-8 pt-0">
          {/* 快捷推荐问题 */}
          <div className="flex gap-2 overflow-x-auto pb-6 scrollbar-hide no-scrollbar">
            {EXPERT_KNOWLEDGE.faqs.slice(0, 6).map((faq, i) => (
              <button 
                key={i}
                onClick={() => processResponse(faq.question, faq.answer, faq.citation)}
                disabled={isTyping}
                className="whitespace-nowrap px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all disabled:opacity-50"
              >
                {faq.question}
              </button>
            ))}
          </div>

          <div className="relative">
             <input 
               type="text"
               value={userInput}
               onChange={(e) => setUserInput(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSend()}
               placeholder="向数字专家提问（例如：低血糖该如何紧急处理？）"
               disabled={isTyping}
               className="w-full bg-[#111835] border border-white/10 rounded-2xl py-5 pl-8 pr-32 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 transition-all placeholder:text-slate-600 disabled:opacity-50 shadow-inner"
             />
             <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <button 
                  onClick={handleSend}
                  disabled={!userInput.trim() || isTyping}
                  className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 disabled:hover:bg-cyan-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-cyan-900/40"
                >
                  发送
                </button>
             </div>
          </div>
        </footer>
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in { animation: in 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default InteractiveExpert;
