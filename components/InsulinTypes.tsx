
import React from 'react';
import { INSULIN_TYPES } from '../constants';

const InsulinTypes: React.FC = () => {
  return (
    <div className="py-40 bg-white text-slate-800 overflow-hidden relative">
      {/* 动态网格背景 */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-32">
          <span className="text-blue-500 font-black text-xl uppercase tracking-[0.5em] mb-8 block">Pharmacological Map</span>
          <h2 className="text-5xl md:text-6xl font-black mb-10 tracking-tight text-slate-900">胰岛素家族图谱</h2>
          <p className="text-slate-500 max-w-3xl mx-auto text-lg font-medium leading-relaxed">
            不同的药动学特征，交织成精准治疗的华丽乐章。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {INSULIN_TYPES.map((type) => (
            <div 
              key={type.id} 
              className="group relative bg-white border border-slate-100 p-10 rounded-[2.5rem] hover:border-blue-200 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"
            >
              <div className={`absolute -top-10 left-10 w-20 h-20 rounded-3xl ${type.color} shadow-lg flex items-center justify-center transition-transform group-hover:rotate-6`}>
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>

              <h3 className="text-2xl font-black mb-8 mt-10 text-slate-900 group-hover:text-blue-600 transition-colors">{type.name}</h3>
              
              <div className="space-y-6 mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="flex flex-col">
                  <span className="text-slate-400 text-[10px] uppercase font-black tracking-widest mb-1">Onset Time</span>
                  <span className="text-xl font-black text-blue-600 tracking-tighter">{type.onset}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-[10px] uppercase font-black tracking-widest mb-1">Peak Period</span>
                  <span className="text-xl font-black text-purple-600 tracking-tighter">{type.peak}</span>
                </div>
              </div>

              <p className="text-slate-500 leading-relaxed font-medium text-sm group-hover:text-slate-700 transition-colors">
                {type.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-32 p-1 bg-gradient-to-r from-blue-100 via-purple-100 to-indigo-100 rounded-[3rem] shadow-sm">
          <div className="bg-white rounded-[2.9rem] p-10 flex flex-col md:flex-row items-center gap-10">
            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0 border border-blue-100">
              <svg className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-2xl font-black mb-3 tracking-tighter text-slate-900">药师温馨提示</h4>
              <p className="text-slate-500 text-base leading-relaxed max-w-4xl font-medium">
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
