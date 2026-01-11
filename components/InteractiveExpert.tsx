
import React, { useState, useEffect, useRef } from 'react';
import { EXPERT_KNOWLEDGE } from '../constants';
import { getGeminiResponse } from '../services/geminiService';

const InteractiveExpert: React.FC = () => {
  const [personality] = useState<'mentor'>('mentor');
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', content: string, citation?: string}[]>([
    { 
      role: 'ai', 
      content: '您好！我是数字药学导师。请注意：本系统仅供药学知识科普，不作为临床诊断依据。所有用药调整，请务必【谨尊医嘱】。' 
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 消息自动吸底
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

  const processResponse = async (question: string, predefinedAnswer?: string, citation?: string) => {
    if (isTyping || !question.trim()) return;
    
    // 1. 立即展示用户发送的消息
    setChatHistory(prev => [...prev, { role: 'user', content: question }]);
    setIsTyping(true);
    
    // 模拟网络延迟或处理时间，增强真实感
    const delay = predefinedAnswer ? 800 : 0;

    if (predefinedAnswer) {
      setTimeout(() => {
        setIsTyping(false);
        const prefix = "【专家解析】\n";
        setChatHistory(prev => [...prev, { 
          role: 'ai', 
          content: prefix + predefinedAnswer,
          citation: citation
        }]);
      }, delay);
    } else {
      try {
        const response = await getGeminiResponse(question);
        setIsTyping(false);
        setChatHistory(prev => [...prev, { 
          role: 'ai', 
          content: response || "抱歉，暂时无法回答该问题。建议您咨询医师获取指导。" 
        }]);
      } catch (err) {
        setIsTyping(false);
        setChatHistory(prev => [...prev, { role: 'ai', content: "系统连接异常，请咨询医师并务必谨尊医嘱。" }]);
      }
    }
  };

  const handleSend = () => {
    const text = userInput;
    if (!text.trim()) return;
    setUserInput(''); // 清空输入框
    processResponse(text);
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row h-[850px] rounded-[3rem] overflow-hidden bg-[#030712] border border-white/10 shadow-2xl relative">
      
      {/* 侧边栏 */}
      <aside className="lg:w-80 bg-[#080c20] border-r border-white/5 flex flex-col p-8">
        <div className="flex flex-col items-center mb-12">
          <div className="relative mb-6">
             <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 p-0.5 shadow-[0_0_40px_rgba(37,99,235,0.2)]">
               <div className="w-full h-full rounded-full bg-[#080c20] flex items-center justify-center overflow-hidden">
                 <svg viewBox="0 0 24 24" className="w-14 h-14 text-blue-400" fill="currentColor">
                   <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                 </svg>
               </div>
             </div>
             <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-2 border-[#080c20] rounded-full"></div>
          </div>
          <h3 className="text-2xl font-black text-white uppercase tracking-widest">Pharmacist AI</h3>
          <p className="text-lg text-blue-500/60 font-bold uppercase tracking-widest mt-2">Digital Expert</p>
        </div>

        <div className="mt-auto bg-amber-500/5 border border-amber-500/20 p-8 rounded-2xl">
           <span className="text-xl font-black text-amber-500 uppercase flex items-center gap-3 mb-3">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
             安全提示
           </span>
           <p className="text-lg text-slate-400 font-bold leading-relaxed">
             科普内容仅供参考。任何调药请务必咨询您的主治医师。
           </p>
        </div>
      </aside>

      {/* 聊天核心区 */}
      <main className="flex-1 flex flex-col bg-[#05091a] relative">
        {/* 状态栏 */}
        <header className="px-10 py-6 border-b border-white/5 flex items-center justify-between bg-black/20 shrink-0">
          <div className="flex items-center gap-4">
             <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)] animate-pulse"></div>
             <span className="text-lg font-black text-red-500/90 uppercase tracking-[0.2em]">胰岛素使用必须严格遵医嘱</span>
          </div>
          <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Encrypted Session</span>
        </header>

        {/* 消息滚动容器 */}
        <div 
          ref={scrollRef} 
          className="flex-1 overflow-y-auto px-10 py-10 pb-16 space-y-8 scroll-smooth"
        >
          {chatHistory.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-4`}>
              {msg.role === 'ai' && (
                <div className="w-12 h-12 rounded-full bg-blue-900/40 border border-blue-500/20 flex items-center justify-center flex-shrink-0 text-base font-black text-blue-400">P</div>
              )}
              
              <div className={`max-w-[85%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-8 py-5 rounded-[2rem] text-xl leading-relaxed whitespace-pre-wrap break-words shadow-xl ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
                
                {msg.citation && (
                  <div className="mt-2 px-2 flex items-center gap-3 opacity-60">
                    <span className="text-sm font-black text-blue-400 uppercase tracking-widest">Cite:</span>
                    <span className="text-sm font-bold text-slate-400 italic">{msg.citation}</span>
                  </div>
                )}

                {msg.role === 'ai' && i > 0 && (
                   <div className="mt-2 px-2 text-sm font-black text-amber-500/50 uppercase tracking-[0.3em] italic">
                     谨尊医嘱 · 非处方建议
                   </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-12 h-12 rounded-full bg-slate-800 border border-white/5 flex items-center justify-center flex-shrink-0 text-base font-black text-slate-400">Me</div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start items-center gap-4 animate-pulse">
               <div className="w-12 h-12 rounded-full bg-blue-900/40 border border-blue-500/20 flex items-center justify-center text-base font-black text-blue-400">P</div>
               <div className="bg-white/5 border border-white/10 px-8 py-4 rounded-[2rem] rounded-tl-none flex gap-1.5">
                 <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce"></div>
                 <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                 <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
               </div>
            </div>
          )}
        </div>

        {/* 交互底部 - 深度优化布局结构 */}
        <footer className="px-10 py-10 border-t border-white/5 bg-[#080c20]/80 backdrop-blur-md shrink-0">
          {/* FAQ 按钮容器 - 字号微调为 text-xl font-black 以防止过大重叠 */}
          <div className="flex flex-wrap gap-6 mb-10 h-auto max-h-[350px] overflow-y-auto no-scrollbar pb-4">
            {EXPERT_KNOWLEDGE.faqs.slice(0, 5).map((faq, i) => (
              <button 
                key={i}
                onClick={() => processResponse(faq.question, faq.answer, faq.citation)}
                disabled={isTyping}
                className="px-8 py-5 rounded-2xl bg-white/5 border border-white/10 text-xl font-black text-slate-200 hover:text-white hover:border-blue-500/50 hover:bg-blue-600/20 transition-all disabled:opacity-30 shadow-lg leading-relaxed text-left"
              >
                {faq.question}
              </button>
            ))}
          </div>

          {/* 输入框区域 - 保持 text-xl 以适配输入体验 */}
          <div className="relative flex items-center">
             <input 
               type="text"
               value={userInput}
               onChange={(e) => setUserInput(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSend()}
               placeholder="向数字专家提问（如：胰岛素如何储存？）"
               disabled={isTyping}
               className="w-full bg-[#111835] border border-white/10 rounded-3xl py-7 pl-10 pr-44 text-xl text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600 disabled:opacity-50 shadow-inner"
             />
             <button 
               onClick={handleSend}
               disabled={!userInput.trim() || isTyping}
               className="absolute right-4 px-12 py-5 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-xl font-black uppercase rounded-2xl transition-all shadow-xl active:scale-95"
             >
               发送
             </button>
          </div>
        </footer>
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default InteractiveExpert;
