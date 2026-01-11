import React, { useState, useEffect, useRef } from 'react';
import { EXPERT_KNOWLEDGE } from '../constants';
import { getGeminiResponse } from '../services/geminiService';

const InteractiveExpert: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', content: string, citation?: string}[]>([
    { 
      role: 'ai', 
      content: '您好！我是数字药学导师。请注意：本系统仅供药学知识科普，不作为临床诊断依据。所有用药调整，请务必【谨遵医嘱】。' 
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
    setChatHistory(prev => [...prev, { role: 'user', content: question }]);
    setIsTyping(true);
    
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
        setChatHistory(prev => [...prev, { role: 'ai', content: "系统连接异常，请咨询医师并务必谨遵医嘱。" }]);
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
    <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row h-[800px] rounded-[3rem] overflow-hidden bg-white border border-slate-100 shadow-2xl relative">
      
      {/* 侧边栏 */}
      <aside className="lg:w-80 bg-slate-50 border-r border-slate-100 flex flex-col p-8">
        <div className="flex flex-col items-center mb-12">
          <div className="relative mb-6">
             <div className="w-24 h-24 rounded-full bg-blue-100 p-1">
               <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                 <svg viewBox="0 0 24 24" className="w-12 h-12 text-blue-500" fill="currentColor">
                   <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                 </svg>
               </div>
             </div>
             <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest">Pharmacist AI</h3>
          <p className="text-xs text-blue-600 font-bold uppercase tracking-widest mt-1">Digital Expert</p>
        </div>

        <div className="mt-auto bg-amber-50 border border-amber-100 p-6 rounded-2xl">
           <span className="text-sm font-black text-amber-600 uppercase flex items-center gap-2 mb-2">
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
             安全提示
           </span>
           <p className="text-xs text-slate-500 font-bold leading-relaxed">
             科普内容仅供参考。任何调药请务必咨询您的主治医师。
           </p>
        </div>
      </aside>

      {/* 聊天区 */}
      <main className="flex-1 flex flex-col bg-white">
        <header className="px-10 py-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/30 shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
             <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">严禁自行调药</span>
          </div>
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Digital Communication Lab</span>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-10 py-10 space-y-8 scroll-smooth">
          {chatHistory.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-3`}>
              {msg.role === 'ai' && (
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 text-sm font-black text-blue-500 shadow-sm">P</div>
              )}
              <div className={`max-w-[80%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-6 py-4 rounded-3xl text-lg leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-slate-100 text-slate-700 border border-slate-200 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
                {msg.citation && (
                  <div className="mt-2 text-[10px] font-bold text-slate-400 italic">Source: {msg.citation}</div>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 text-sm font-black text-slate-400">Me</div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-sm font-black text-blue-500">P</div>
               <div className="bg-slate-100 border border-slate-200 px-6 py-3 rounded-2xl rounded-tl-none flex gap-1">
                 <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                 <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
               </div>
            </div>
          )}
        </div>

        <footer className="px-10 py-8 border-t border-slate-100 bg-slate-50/30">
          <div className="flex flex-wrap gap-3 mb-6 max-h-32 overflow-y-auto no-scrollbar">
            {EXPERT_KNOWLEDGE.faqs.slice(0, 5).map((faq, i) => (
              <button 
                key={i}
                onClick={() => processResponse(faq.question, faq.answer, faq.citation)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm"
              >
                {faq.question}
              </button>
            ))}
          </div>
          <div className="relative flex items-center">
             <input 
               type="text"
               value={userInput}
               onChange={(e) => setUserInput(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSend()}
               placeholder="向数字专家提问（如：胰岛素如何储存？）"
               className="w-full bg-white border border-slate-200 rounded-2xl py-5 pl-8 pr-32 text-lg text-slate-800 focus:outline-none focus:border-blue-500 transition-all shadow-sm"
             />
             <button 
               onClick={handleSend}
               disabled={!userInput.trim() || isTyping}
               className="absolute right-3 px-8 py-3 bg-slate-900 hover:bg-black text-white text-sm font-black uppercase rounded-xl transition-all shadow-md active:scale-95"
             >
               发送
             </button>
          </div>
        </footer>
      </main>
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
};

export default InteractiveExpert;