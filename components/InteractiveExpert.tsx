
import React, { useState, useEffect, useRef } from 'react';
import { EXPERT_KNOWLEDGE } from '../constants';
import { getGeminiResponse } from '../services/geminiService';

const InteractiveExpert: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('storage');
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
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping]);

  const processResponse = async (question: string, predefinedAnswer?: string, citation?: string) => {
    if (isTyping) return;
    
    setChatHistory(prev => [...prev, { role: 'user', content: question }]);
    setIsTyping(true);
    setTypingStatus('正在检索知识库...');

    if (predefinedAnswer) {
      // 本地 FAQ 逻辑
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
      // 真实 AI 逻辑
      setTypingStatus('AI 专家正在深度思考...');
      const response = await getGeminiResponse(question);
      setIsTyping(false);
      setChatHistory(prev => [...prev, { 
        role: 'ai', 
        content: response || "抱歉，服务暂时不可用。建议您咨询临床医师获取专业指导。" 
      }]);
    }
  };

  const handleSend = () => {
    if (!userInput.trim()) return;
    processResponse(userInput);
    setUserInput('');
  };

  return (
    <div className="w-full max-w-7xl mx-auto glass rounded-[3.5rem] border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col lg:flex-row h-[880px]">
      
      {/* 极客侧边栏：数字身份与安全声明 */}
      <div className="lg:w-[320px] bg-slate-900/80 border-r border-white/10 p-8 flex flex-col relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-transparent opacity-50"></div>
        
        {/* 数字人视觉区域 */}
        <div className="relative w-40 h-40 mx-auto mb-8 group mt-6">
          <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="relative w-full h-full border-2 border-blue-500/20 rounded-full flex items-center justify-center p-2">
            <div className="w-full h-full bg-slate-800 rounded-full flex items-center justify-center overflow-hidden relative shadow-inner">
               <svg viewBox="0 0 24 24" className={`w-24 h-24 text-blue-500/70 transition-all duration-700 ${isTyping ? 'scale-110 opacity-100' : 'scale-100 opacity-40'}`} fill="currentColor">
                 <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
               </svg>
               <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent h-full w-full animate-[scan_4s_linear_infinite]"></div>
            </div>
          </div>
          <div className="absolute bottom-2 right-4 w-4 h-4 bg-green-500 rounded-full border-4 border-slate-900 shadow-[0_0_10px_rgba(34,197,94,0.6)]"></div>
        </div>

        <div className="text-center mb-8">
          <h3 className="text-lg font-black text-white mb-1 tracking-tighter uppercase">Pharmacist AI Core</h3>
          <p className="text-[9px] text-slate-600 font-bold tracking-[0.4em] uppercase">Security Verified</p>
        </div>

        {/* 交互模式切换 */}
        <div className="bg-black/40 p-1 rounded-2xl border border-white/5 flex mb-8">
           <button 
            onClick={() => setPersonality('mentor')}
            className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${personality === 'mentor' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:text-slate-400'}`}
           >
             专家模式
           </button>
           <button 
            onClick={() => setPersonality('friend')}
            className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${personality === 'friend' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 hover:text-slate-400'}`}
           >
             助手模式
           </button>
        </div>

        {/* 侧边风险警告卡片 (代替之前的监控面板) */}
        <div className="mt-auto p-5 bg-amber-500/10 border border-amber-500/30 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-20">
            <svg className="w-12 h-12 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3 text-amber-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <span className="text-[10px] font-black uppercase tracking-widest">药学安全提醒</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-bold">
              AI 专家回复仅供科普。临床治疗具有极强个体差异，<span className="text-amber-500 uppercase">严禁自行调药或停药</span>，请咨询您的主治医师。
            </p>
          </div>
        </div>
      </div>

      {/* 主对话区 */}
      <div className="flex-1 flex flex-col bg-[#03081a] relative">
        
        {/* 顶部安全红线 Bar (常驻提醒) */}
        <div className="bg-red-500/10 px-8 py-4 border-b border-red-500/20 flex items-center justify-between">
           <div className="flex items-center gap-4">
             <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping absolute inset-0"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-red-600 relative shadow-[0_0_10px_rgba(220,38,38,0.8)]"></div>
             </div>
             <span className="text-xs font-black text-red-400 tracking-[0.1em] uppercase">
                安全准则：胰岛素属于高风险药物，请严格遵循医师医嘱使用
             </span>
           </div>
           <div className="flex items-center gap-2">
             <span className="px-3 py-1 bg-red-500/20 text-red-500 border border-red-500/30 text-[9px] font-black rounded-lg uppercase tracking-widest">遵医嘱</span>
           </div>
        </div>

        {/* 消息流 */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6">
          {chatHistory.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in`}>
              <div className={`max-w-[85%] group ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-5 rounded-3xl text-sm leading-relaxed font-medium shadow-xl relative ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'glass border-white/10 text-slate-300 rounded-tl-none backdrop-blur-3xl'
                }`}>
                  {msg.content}
                  
                  {/* AI 回复后的安全免责标识 */}
                  {msg.role === 'ai' && idx !== 0 && (
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between opacity-60">
                      <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                        <span className="text-[9px] font-bold text-slate-500 tracking-widest uppercase italic">科普内容不作为处方建议</span>
                      </div>
                      <span className="text-[9px] text-amber-500/80 font-black">谨遵医嘱</span>
                    </div>
                  )}
                </div>
                {msg.citation && (
                   <div className="mt-2 px-3 py-1 text-[9px] font-black text-slate-600 uppercase tracking-widest flex justify-between items-center w-full animate-in">
                     <span>{msg.citation}</span>
                     {msg.role === 'ai' && <span className="text-amber-600/80 font-black flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        咨询医师后再操作
                     </span>}
                   </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start animate-pulse">
              <div className="glass border-white/10 p-4 rounded-2xl rounded-tl-none">
                <div className="flex items-center gap-3">
                  <div className="flex space-x-1.5">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                  <span className="text-[9px] font-black text-blue-400/60 uppercase tracking-widest">{typingStatus}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 输入区与快捷问答 */}
        <div className="p-8 border-t border-white/5 bg-slate-900/30">
          {/* 快捷问答分类 */}
          <div className="flex overflow-x-auto gap-3 mb-6 scrollbar-hide pb-2">
            {EXPERT_KNOWLEDGE.faqs.slice(0, 6).map((faq, i) => (
              <button 
                key={i}
                onClick={() => processResponse(faq.question, faq.answer, faq.citation)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-slate-400 hover:bg-blue-600/20 hover:text-blue-400 transition-all whitespace-nowrap flex items-center gap-2"
              >
                <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                {faq.question}
              </button>
            ))}
          </div>

          {/* 交互输入框 */}
          <div className="relative group">
            <input 
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="向 AI 数字药学专家提问（如：如何预防低血糖？）"
              className="w-full bg-black/50 border border-white/10 rounded-2xl py-5 pl-8 pr-36 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-inner"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button 
                onClick={() => alert('语音交互功能初始化中，请稍后...')}
                className="p-3 text-slate-600 hover:text-blue-400 transition-colors"
                title="语音输入"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
              </button>
              <button 
                onClick={handleSend}
                disabled={!userInput.trim() || isTyping}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:hover:bg-blue-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]"
              >
                发送
              </button>
            </div>
          </div>
          
          {/* 底部微型提醒 */}
          <div className="mt-4 flex justify-center">
            <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em] flex items-center gap-2">
              <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
              All clinical decisions must be supervised by medical professionals
              <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 0.3; }
          100% { transform: translateY(400%); opacity: 0; }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default InteractiveExpert;
