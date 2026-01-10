
import React, { useState } from 'react';
import { INSULIN_HISTORY } from '../constants';

const HistoryTimeline: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleYearClick = (idx: number) => {
    setActiveIndex(idx);
  };

  return (
    <div className="py-40 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-28">
        <span className="text-purple-500 font-black text-xs uppercase tracking-[0.5em] mb-6 block">Centennial Journey</span>
        <h2 className="text-5xl md:text-7xl font-black mb-10 text-white tracking-tighter">生命的刻度</h2>
        <p className="text-slate-500 max-w-2xl mx-auto text-xl font-medium leading-relaxed">
          跨越世纪的医学奥德赛，从多伦多的实验室到数字化未来的精准医疗。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-stretch">
        {/* 左侧：垂直导航时间轴 */}
        <div className="lg:col-span-4 space-y-4">
          {INSULIN_HISTORY.map((item, idx) => (
            <div 
              key={idx} 
              onClick={() => handleYearClick(idx)}
              className={`p-8 rounded-[2rem] cursor-pointer transition-all duration-500 relative overflow-hidden group border ${
                activeIndex === idx 
                ? 'bg-blue-600 border-blue-500 shadow-[0_20px_40px_rgba(59,130,246,0.3)]' 
                : 'glass border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-6">
                  <span className={`text-3xl font-black italic tracking-tighter ${activeIndex === idx ? 'text-white' : 'text-blue-500/60'}`}>
                    {item.year}
                  </span>
                  <h4 className={`text-lg font-bold ${activeIndex === idx ? 'text-white' : 'text-slate-400'}`}>
                    {item.title}
                  </h4>
                </div>
                {activeIndex === idx && (
                   <svg className="w-6 h-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                   </svg>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 右侧：详情展示卡片（移除图片，强化排版） */}
        <div className="lg:col-span-8">
          <div className="h-full glass rounded-[4rem] p-12 lg:p-20 border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.4)] relative overflow-hidden flex flex-col justify-center min-h-[500px]">
            {/* 装饰性背景 */}
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 text-[25rem] font-black text-white/[0.02] select-none pointer-events-none italic tracking-tighter">
              {INSULIN_HISTORY[activeIndex].year}
            </div>
            <div className="absolute bottom-10 left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="relative z-10" key={activeIndex}>
              <div className="inline-flex items-center px-6 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-[0.3em] rounded-full mb-10 shadow-inner animate-in">
                Historical Milestone
              </div>
              
              <h3 className="text-5xl lg:text-7xl font-black mb-10 text-white leading-tight animate-in">
                {INSULIN_HISTORY[activeIndex].title}
              </h3>
              
              <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full mb-12 animate-in shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
              
              <p className="text-slate-300 text-xl lg:text-2xl leading-relaxed font-medium max-w-4xl animate-in delay-100">
                {INSULIN_HISTORY[activeIndex].description}
              </p>
              
              <div className="mt-20 flex gap-4 animate-in delay-200">
                 <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                 <div className="w-3 h-3 rounded-full bg-blue-500/20"></div>
                 <div className="w-3 h-3 rounded-full bg-blue-500/10"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryTimeline;
