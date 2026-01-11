
import React, { useState, useEffect, useRef } from 'react';
import { EXPERT_KNOWLEDGE } from '../constants';
import { getGeminiResponse } from '../services/geminiService';

const InteractiveExpert: React.FC = () => {
  const [personality, setPersonality] = useState<'mentor' | 'friend'>('mentor');
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', content: string, citation?: string}[]>([
    { 
      role: 'ai', 
      content: '您好！我是数字药学导师。请注意：本系统仅供药学知识科普，不作为临床诊断依据。所有用药调整，请务必【谨遵医嘱】。' 
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
        const prefix = personality === 'mentor' ? "【专家解析】\n" : "温馨提醒：\n";
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
        setChatHistory(prev => [...prev, { role: 'ai', content: "系统连接异常，请咨询医师并务必谨遵医嘱。" }]);
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
    <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row h-[750px] rounded-[2rem] overflow-hidden bg-[#030712] border border-white/10 shadow-2xl relative">
      
      {/* 侧边栏 - 精简版 */}
      <aside className="lg:w-64 bg-[#080c20] border-r border-white/5 flex flex-col p-6">
        <div className="flex flex-col items-center mb-10">
          <div className="relative mb-4">
             <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 p-0.5 shadow-[0_0_30px_rgba(37,99,235,0.2)]">
               <div className="w-full h-full rounded-full bg-[#080c20] flex items-center justify-center overflow-hidden">
                 <svg viewBox="0 0 24 24" className="w-12 h-12 text-blue-400" fill="currentColor">
                   <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                 </svg>
               </div>
             </div>
             <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-[#080c20] rounded-full"></div>
          </div>
          <h3 className="text-xs font-black text-white uppercase tracking-widest">Pharmacist AI</h3>
          <p className="text-[10px] text-blue-500/60 font-bold uppercase tracking-widest mt-1">Digital Mentor</p>
        </div>

        <div className="space-y-2 mb-8">
          <button 
            onClick={() => setPersonality('mentor')}
            className={`w-full py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all flex items-center gap-2 ${personality === 'mentor' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:bg-white/5'}`}
          >
            专家模式
          </button>
          <button 
            onClick={() => setPersonality('friend')}
            className={`w-full py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all flex items-center gap-2 ${personality === 'friend' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 hover:bg-white/5'}`}
          >
            助手模式
          </button>
        </div>

        <div className="mt-auto bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl">
           <span className="text-[9px] font-black text-amber-500 uppercase flex items-center gap-2 mb-1">
             <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
             安全提示
           </span>
           <p className="text-[9px] text-slate-500 font-bold leading-relaxed">
             科普不作诊断。任何调药请务必咨询您的主治医师。
           </p>
        </div>
      </aside>

      {/* 聊天核心区 */}
      <main className="flex-1 flex flex-col bg-[#05091a]">
        {/* 状态栏 */}
        <header className="px-8 py-3 border-b border-white/5 flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
             <span className="text-[10px] font-black text-red-500/80 uppercase tracking-widest">胰岛素使用必须严格遵医嘱</span>
          </div>
          <span className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">Encrypted Session</span>
        </header>

        {/* 消息滚动容器 */}
        <div 
          ref={scrollRef} 
          className="flex-1 overflow-y-auto px-6 py-8 space-y-6 scroll-smooth"
        >
          {chatHistory.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-3`}>
              {msg.role === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-blue-900/40 border border-blue-500/20 flex items-center justify-center flex-shrink-0 text-[10px] font-black text-blue-400">P</div>
              )}
              
              <div className={`max-w-[85%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {/* 气泡 - 增加换行和溢出处理 */}
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words shadow-lg ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
                
                {msg.citation && (
                  <div className="mt-1.5 px-1 flex items-center gap-2 opacity-40">
                    <span className="text-[9px] font-black text-blue-400 uppercase">Cite:</span>
                    <span className="text-[9px] font-medium text-slate-400 italic">{msg.citation}</span>
                  </div>
                )}

                {msg.role === 'ai' && i > 0 && (
                   <div className="mt-1 px-1 text-[8px] font-black text-amber-500/40 uppercase tracking-widest italic">
                     谨遵医嘱 · 非处方建议
                   </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/5 flex items-center justify-center flex-shrink-0 text-[10px] font-black text-slate-400">Me</div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start items-center gap-3 animate-pulse">
               <div className="w-8 h-8 rounded-full bg-blue-900/40 border border-blue-500/20 flex items-center justify-center text-[10px] font-black text-blue-400">P</div>
               <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl rounded-tl-none flex gap-1">
                 <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                 <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                 <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
               </div>
            </div>
          )}
        </div>

        {/* 交互底部 */}
        <footer className="p-6 border-t border-white/5 bg-black/10">
          {/* FAQ 快速按钮 - 现在点击会立即出现用户消息 */}
          <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
            {EXPERT_KNOWLEDGE.faqs.slice(0, 5).map((faq, i) => (
              <button 
                key={i}
                onClick={() => processResponse(faq.question, faq.answer, faq.citation)}
                disabled={isTyping}
                className="flex-shrink-0 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-slate-400 hover:text-blue-400 hover:border-blue-500/30 transition-all disabled:opacity-30"
              >
                {faq.question}
              </button>
            ))}
          </div>

          {/* 输入框 */}
          <div className="relative flex items-center">
             <input 
               type="text"
               value={userInput}
               onChange={(e) => setUserInput(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSend()}
               placeholder="向数字专家提问（如：胰岛素如何储存？）"
               disabled={isTyping}
               className="w-full bg-[#111835] border border-white/10 rounded-xl py-4 pl-6 pr-24 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600 disabled:opacity-50"
             />
             <button 
               onClick={handleSend}
               disabled={!userInput.trim() || isTyping}
               className="absolute right-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white text-[10px] font-black uppercase rounded-lg transition-all"
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
