
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
        <span className="text-blue-500 font-black text-xl uppercase tracking-[0.5em] mb-8 block">Centennial Journey</span>
        <h2 className="text-5xl md:text-6xl font-black mb-10 text-slate-900 tracking-tighter">生命的刻度</h2>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
          跨越世纪的医学奥德赛，从多伦多的实验室到数字化未来的精准医疗。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-stretch">
        {/* 左侧：垂直导航时间轴 */}
        <div className="lg:col-span-4 space-y-4">
          {INSULIN_HISTORY.map((item, idx) => (
            <div 
              key={idx} 
              onClick={() => handleYearClick(idx)}
              className={`p-6 rounded-3xl cursor-pointer transition-all duration-300 relative border ${
                activeIndex === idx 
                ? 'bg-blue-600 border-blue-600 shadow-xl' 
                : 'bg-white border-slate-100 hover:border-blue-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-6">
                  <span className={`text-2xl font-black italic tracking-tighter ${activeIndex === idx ? 'text-white' : 'text-blue-500'}`}>
                    {item.year}
                  </span>
                  <h4 className={`text-base font-bold ${activeIndex === idx ? 'text-white' : 'text-slate-700'}`}>
                    {item.title}
                  </h4>
                </div>
                {activeIndex === idx && (
                   <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                   </svg>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 右侧：详情展示卡片 */}
        <div className="lg:col-span-8">
          <div className="h-full bg-white rounded-[3rem] p-12 lg:p-16 border border-slate-100 shadow-xl relative overflow-hidden flex flex-col justify-center min-h-[500px]">
            {/* 装饰性背景 */}
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 text-[20rem] font-black text-slate-50/80 select-none pointer-events-none italic tracking-tighter">
              {INSULIN_HISTORY[activeIndex].year}
            </div>
            
            <div className="relative z-10" key={activeIndex}>
              <div className="inline-flex items-center px-6 py-2 bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-10 shadow-sm">
                Historical Milestone
              </div>
              
              <h3 className="text-4xl lg:text-6xl font-black mb-10 text-slate-900 leading-tight">
                {INSULIN_HISTORY[activeIndex].title}
              </h3>
              
              <div className="w-20 h-1.5 bg-blue-500 rounded-full mb-12 shadow-sm"></div>
              
              <p className="text-slate-600 text-xl lg:text-2xl leading-relaxed font-medium max-w-3xl">
                {INSULIN_HISTORY[activeIndex].description}
              </p>
              
              <div className="mt-16 flex gap-3">
                 <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-blue-200"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-blue-100"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryTimeline;
