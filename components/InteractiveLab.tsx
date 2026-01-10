
import React, { useState, useEffect } from 'react';
import { QUIZ_QUESTIONS } from '../constants';

const InteractiveLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sim' | 'quiz'>('sim');
  
  // 模拟器状态
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [glucoseCount, setGlucoseCount] = useState(12);

  // 测验状态
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleInject = () => {
    setIsUnlocked(true);
    setTimeout(() => {
      setGlucoseCount(prev => Math.max(0, prev - 4));
    }, 1000);
    setTimeout(() => {
      setIsUnlocked(false);
    }, 4000);
  };

  const handleAnswer = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    if (idx === QUIZ_QUESTIONS[currentQuestion].correct) {
      setScore(prev => prev + 1);
    }
    setTimeout(() => {
      if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto glass rounded-[4rem] border-white/10 overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
      {/* 选项卡切换 */}
      <div className="flex border-b border-white/5 bg-white/[0.02]">
        <button 
          onClick={() => setActiveTab('sim')}
          className={`flex-1 py-8 font-black text-xs uppercase tracking-[0.3em] transition-all ${activeTab === 'sim' ? 'text-blue-400 bg-blue-500/10' : 'text-slate-500 hover:text-slate-300'}`}
        >
          机制实验室 / Mechanism Sim
        </button>
        <button 
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 py-8 font-black text-xs uppercase tracking-[0.3em] transition-all ${activeTab === 'quiz' ? 'text-purple-400 bg-purple-500/10' : 'text-slate-500 hover:text-slate-300'}`}
        >
          知识闯关 / Knowledge Quiz
        </button>
      </div>

      <div className="p-10 lg:p-20 min-h-[500px] flex flex-col justify-center">
        {activeTab === 'sim' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h3 className="text-4xl font-black text-white">药理机制可视化</h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                胰岛素就像一把精心设计的<span className="text-blue-400 font-bold">钥匙</span>，它必须先结合在细胞表面的受体（锁）上，才能开启葡萄糖进入细胞的通道。
              </p>
              <button 
                onClick={handleInject}
                disabled={isUnlocked}
                className={`px-10 py-5 rounded-2xl font-black transition-all flex items-center gap-4 ${isUnlocked ? 'bg-slate-800 text-slate-500' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-900/40 hover:-translate-y-1'}`}
              >
                {isUnlocked ? '正在转运葡萄糖...' : '点击注入胰岛素'}
                {!isUnlocked && <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>}
              </button>
              <div className="pt-6 flex gap-10">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-600 uppercase font-bold tracking-widest mb-1">血中葡萄糖</span>
                  <span className="text-4xl font-black text-yellow-500">{glucoseCount} <span className="text-sm font-normal text-slate-700">units</span></span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-600 uppercase font-bold tracking-widest mb-1">细胞状态</span>
                  <span className={`text-4xl font-black transition-colors ${isUnlocked ? 'text-green-500' : 'text-blue-500'}`}>{isUnlocked ? 'OPEN' : 'LOCKED'}</span>
                </div>
              </div>
            </div>

            <div className="relative h-[400px] bg-black/40 rounded-[3rem] border border-white/5 overflow-hidden">
               {/* 细胞壁示意 */}
               <div className={`absolute bottom-0 left-0 right-0 h-24 transition-colors duration-1000 ${isUnlocked ? 'bg-green-500/20' : 'bg-blue-500/20'} border-t-4 ${isUnlocked ? 'border-green-500' : 'border-blue-500'} flex justify-center`}>
                  <div className={`w-32 h-6 -translate-y-1/2 rounded-full transition-all duration-1000 ${isUnlocked ? 'bg-green-400 shadow-[0_0_30px_rgba(74,222,128,0.6)] scale-x-150' : 'bg-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.6)]'}`}></div>
                  <span className="absolute -bottom-8 text-[10px] font-black text-slate-600 tracking-[0.4em]">CELL MEMBRANE</span>
               </div>

               {/* 动态葡萄糖粒子 */}
               {[...Array(glucoseCount)].map((_, i) => (
                 <div 
                  key={i}
                  className={`absolute w-4 h-4 bg-yellow-400 rounded-sm shadow-[0_0_15px_rgba(250,204,21,0.5)] transition-all duration-[2000ms] ${isUnlocked && i % 3 === 0 ? 'translate-y-[400px] opacity-0' : ''}`}
                  style={{
                    left: `${(i * 15) % 90 + 5}%`,
                    top: `${(i * 23) % 40 + 10}%`,
                    animation: `float ${3 + i % 2}s ease-in-out infinite`
                  }}
                 ></div>
               ))}

               {/* 胰岛素分子（钥匙） */}
               {isUnlocked && (
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce">
                    <div className="w-12 h-12 bg-cyan-400 rounded-full shadow-[0_0_40px_rgba(34,211,238,0.8)] flex items-center justify-center">
                       <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                       </svg>
                    </div>
                 </div>
               )}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto w-full">
            {!showResult ? (
              <div key={currentQuestion} className="space-y-12 animate-in">
                <div className="flex justify-between items-end">
                  <span className="text-purple-500 font-black text-xs tracking-widest">QUESTION 0{currentQuestion + 1} / 03</span>
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <div key={i} className={`w-8 h-1 rounded-full ${i <= currentQuestion ? 'bg-purple-500' : 'bg-white/10'}`}></div>
                    ))}
                  </div>
                </div>
                <h3 className="text-4xl font-black text-white leading-tight">
                  {QUIZ_QUESTIONS[currentQuestion].question}
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {QUIZ_QUESTIONS[currentQuestion].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      className={`p-6 rounded-2xl border text-left font-bold transition-all ${
                        selectedOption === null 
                          ? 'glass border-white/5 hover:bg-white/10 hover:border-purple-500/50' 
                          : selectedOption === idx 
                            ? idx === QUIZ_QUESTIONS[currentQuestion].correct 
                              ? 'bg-green-500/20 border-green-500 text-green-400' 
                              : 'bg-red-500/20 border-red-500 text-red-400'
                            : idx === QUIZ_QUESTIONS[currentQuestion].correct 
                              ? 'bg-green-500/20 border-green-500 text-green-400'
                              : 'glass border-white/5 opacity-40'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{opt}</span>
                        {selectedOption === idx && (
                          <span>{idx === QUIZ_QUESTIONS[currentQuestion].correct ? '✓ 正确' : '✕ 错误'}</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                {selectedOption !== null && (
                  <p className="p-6 bg-purple-500/5 rounded-2xl border border-purple-500/10 text-slate-400 text-sm leading-relaxed italic animate-in">
                    解析：{QUIZ_QUESTIONS[currentQuestion].explanation}
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center space-y-10 animate-in">
                <div className="w-32 h-32 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-full mx-auto flex items-center justify-center shadow-2xl">
                   <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                   </svg>
                </div>
                <div>
                  <h3 className="text-5xl font-black text-white mb-4">挑战完成!</h3>
                  <p className="text-slate-500 text-xl">您的得分: <span className="text-purple-400 font-black">{score} / {QUIZ_QUESTIONS.length}</span></p>
                </div>
                <div className="p-8 glass rounded-3xl border-white/10 max-w-md mx-auto">
                   <p className="text-slate-400 font-medium">
                     {score === 3 ? "卓越！您已经具备了资深药学传播者的知识储备。" : "不错！药学知识需要日积月累，继续加油。"}
                   </p>
                </div>
                <button 
                  onClick={resetQuiz}
                  className="px-10 py-5 bg-white text-black rounded-2xl font-black hover:bg-purple-100 transition-all shadow-xl"
                >
                  再次挑战
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveLab;
