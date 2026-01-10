
import React from 'react';
import { INSULIN_TYPES } from '../constants';

const InsulinTypes: React.FC = () => {
  return (
    <div className="py-40 bg-[#010413] text-white overflow-hidden relative">
      {/* 动态网格背景 */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-32">
          <span className="text-cyan-500 font-black text-xs uppercase tracking-[0.5em] mb-6 block">Pharmacological Map</span>
          <h2 className="text-5xl md:text-7xl font-black mb-10 tracking-tight">药学家族图谱</h2>
          <p className="text-slate-500 max-w-3xl mx-auto text-xl font-medium leading-relaxed">
            不同的药动学特征，交织成精准治疗的华丽乐章。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {INSULIN_TYPES.map((type) => (
            <div 
              key={type.id} 
              className="group relative glass border-white/5 p-12 rounded-[3.5rem] hover:bg-white/[0.08] transition-all duration-700 hover:-translate-y-6 hover:shadow-[0_40px_80px_rgba(0,0,0,0.5)]"
            >
              <div className={`absolute -top-10 left-12 w-24 h-24 rounded-[2rem] ${type.color} shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex items-center justify-center transition-transform group-hover:rotate-12 group-hover:scale-110`}>
                <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>

              <h3 className="text-3xl font-black mb-10 mt-12 group-hover:text-blue-400 transition-colors">{type.name}</h3>
              
              <div className="space-y-8 mb-10 bg-black/40 p-8 rounded-3xl border border-white/5 shadow-inner">
                <div className="flex flex-col">
                  <span className="text-slate-600 text-[10px] uppercase font-black tracking-widest mb-2">Onset Time</span>
                  <span className="text-2xl font-black text-blue-400 tracking-tighter">{type.onset}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-600 text-[10px] uppercase font-black tracking-widest mb-2">Peak Period</span>
                  <span className="text-2xl font-black text-purple-400 tracking-tighter">{type.peak}</span>
                </div>
              </div>

              <p className="text-slate-400 leading-relaxed font-medium group-hover:text-slate-200 transition-colors">
                {type.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-32 p-1.5 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-[3rem] shadow-2xl">
          <div className="bg-[#020617] rounded-[2.8rem] p-12 flex flex-col md:flex-row items-center gap-12">
            <div className="w-24 h-24 bg-blue-600/10 rounded-3xl flex items-center justify-center flex-shrink-0 animate-pulse border border-blue-500/20 shadow-inner">
              <svg className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-3xl font-black mb-4 tracking-tighter">药师温馨提示</h4>
              <p className="text-slate-400 text-lg leading-loose max-w-4xl font-medium">
                胰岛素的分类之美，源于对人体生理机能的深度模拟。请铭记：正确选择时机（如餐前时间）、严谨存放（冷藏）与科学轮换部位，是发挥这份“药学之美”的关键。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsulinTypes;
