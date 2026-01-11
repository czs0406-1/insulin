
import React, { useState, useEffect, useMemo } from 'react';

const InteractiveLab: React.FC = () => {
  const [activeModule, setActiveModule] = useState<'dynamics' | 'cellular'>('dynamics');
  const [simulationState, setSimulationState] = useState<'idle' | 'running' | 'complete'>('idle');
  const [selectedType, setSelectedType] = useState('rapid');
  const [scanProgress, setScanProgress] = useState(0);

  // 药动学路径重构：确保单次达峰，代谢后平滑归零
  const pkData = useMemo(() => ({
    rapid: { 
      color: '#f43f5e', 
      path: "M0 90 C 5 10, 20 10, 35 90 L 100 90", 
      glucosePath: "M0 50 C 5 85, 20 90, 35 55 L 100 50",
      label: "超短效", 
      peak: "1-2h" 
    },
    regular: { 
      color: '#f59e0b', 
      path: "M0 90 C 10 30, 40 30, 65 90 L 100 90", 
      glucosePath: "M0 50 C 15 80, 45 85, 70 55 L 100 50",
      label: "短效", 
      peak: "2-4h" 
    },
    nph: { 
      color: '#10b981', 
      path: "M0 90 C 20 50, 70 50, 95 90 L 100 90", 
      glucosePath: "M0 50 C 25 75, 75 80, 100 55",
      label: "中效", 
      peak: "4-10h" 
    },
    long: { 
      color: '#6366f1', 
      path: "M0 90 C 10 75, 30 72, 100 72", 
      glucosePath: "M0 50 C 10 60, 40 65, 100 65",
      label: "长效", 
      peak: "无显著峰值" 
    }
  }), []);

  useEffect(() => {
    let interval: any;
    if (simulationState === 'running') {
      setScanProgress(0);
      interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setSimulationState('complete');
            return 100;
          }
          return prev + 1;
        });
      }, 40); 
    }
    return () => clearInterval(interval);
  }, [simulationState]);

  const handleRunSim = () => {
    if (simulationState === 'running') return;
    setSimulationState('running');
  };

  const currentPK = (pkData as any)[selectedType];

  return (
    <div className="w-full max-w-7xl mx-auto glass rounded-[4rem] border-white/10 overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.6)] bg-slate-950/60 relative">
      
      {/* 模块切换导航 - 字体增大一倍 */}
      <div className="flex bg-black/60 border-b border-white/5 backdrop-blur-3xl">
        {[
          { id: 'dynamics', label: '药动学全景模拟', icon: '📊' },
          { id: 'cellular', label: '细胞通路解锁', icon: '🧫' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => { setActiveModule(tab.id as any); setSimulationState('idle'); setScanProgress(0); }}
            className={`flex-1 py-12 flex flex-col items-center gap-4 transition-all relative group ${activeModule === tab.id ? 'bg-blue-500/10' : 'hover:bg-white/5'}`}
          >
            <span className={`text-4xl transition-transform duration-500 ${activeModule === tab.id ? 'scale-125 rotate-12' : 'group-hover:scale-110'}`}>{tab.icon}</span>
            <span className={`text-2xl font-black uppercase tracking-[0.4em] ${activeModule === tab.id ? 'text-blue-400' : 'text-slate-400'}`}>
              {tab.label}
            </span>
            {activeModule === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>}
          </button>
        ))}
      </div>

      <div className="p-8 lg:p-16 flex flex-col lg:flex-row gap-12 min-h-[750px] items-stretch">
        
        {/* 左侧控制面板 */}
        <div className="lg:w-[400px] flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest">
              <span className={`w-2.5 h-2.5 rounded-full ${simulationState === 'running' ? 'bg-amber-500 animate-ping' : 'bg-green-500'}`}></span>
              System: {simulationState.toUpperCase()}
            </div>
            
            <h3 className="text-4xl lg:text-5xl font-black text-white leading-[1.1] tracking-tighter">
              {activeModule === 'dynamics' && "时效动力模拟"}
              {activeModule === 'cellular' && "胞内信号联级"}
            </h3>

            <div className="space-y-4">
              <p className="text-slate-400 text-xl leading-relaxed font-medium">
                {activeModule === 'dynamics' && "实时模拟药物在体内的浓度曲线（实线）及对应的血糖下降趋势（虚线）。"}
                {activeModule === 'cellular' && "模拟胰岛素与受体结合后的跨膜传递过程。观察 GLUT4 转运蛋白如何响应信号并开启通道。"}
              </p>
              
              {/* 实时状态显示 */}
              <div className="glass p-6 rounded-2xl border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Process Progress</span>
                  <span className="text-sm font-mono font-black text-blue-400">{scanProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 transition-all duration-300 shadow-[0_0_10px_#3b82f6]" style={{ width: `${scanProgress}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-8 border-t border-white/5">
            {activeModule === 'dynamics' && (
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(pkData).map(k => (
                  <button 
                    key={k}
                    onClick={() => { setSelectedType(k); setSimulationState('idle'); setScanProgress(0); }}
                    className={`py-6 rounded-2xl text-2xl font-black uppercase tracking-widest border transition-all ${selectedType === k ? 'bg-white text-black border-white shadow-[0_10px_30px_rgba(255,255,255,0.2)]' : 'bg-transparent text-slate-500 border-white/10 hover:border-white/20'}`}
                  >
                    {(pkData as any)[k].label}
                  </button>
                ))}
              </div>
            )}
            
            <button 
              onClick={handleRunSim}
              disabled={simulationState === 'running'}
              className={`group w-full py-8 rounded-2xl text-2xl font-black flex items-center justify-center gap-4 transition-all shadow-2xl relative overflow-hidden ${simulationState !== 'running' ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40' : 'bg-slate-800 text-slate-500'}`}
            >
              <span className="relative z-10">{simulationState === 'idle' ? '启动协议仿真' : '仿真运行中...'}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </button>
          </div>
        </div>

        {/* 右侧主交互视觉区 */}
        <div className="flex-1 relative rounded-[3rem] bg-black/40 border border-white/5 overflow-hidden shadow-inner flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent)] pointer-events-none"></div>

          {/* 1. 药动学全景模拟 */}
          {activeModule === 'dynamics' && (
            <div className="absolute inset-0 flex items-stretch p-12">
               <div className="flex-1 flex flex-col relative">
                  <div className="absolute inset-0 bg-green-500/5 rounded-2xl border border-green-500/10 pointer-events-none" style={{ top: '40%', height: '25%' }}>
                     <span className="absolute right-6 top-3 text-[10px] font-black text-green-500/50 uppercase tracking-widest">Normal Glycemic Zone</span>
                  </div>
                  
                  <div className="flex-1 relative border-l-2 border-b-2 border-slate-800 mb-8 overflow-hidden">
                     <div className="absolute top-0 bottom-0 w-[2px] bg-white/40 shadow-[0_0_15px_white] z-20" style={{ left: `${scanProgress}%`, opacity: simulationState === 'running' ? 1 : 0 }}></div>

                     <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                        <defs>
                          <linearGradient id={`grad-${selectedType}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={currentPK.color} stopOpacity="0.3" />
                            <stop offset="100%" stopColor={currentPK.color} stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <g stroke="#ffffff05" strokeWidth="0.5">
                           {[20, 40, 60, 80].map(v => <line key={v} x1={v} y1="0" x2={v} y2="100" />)}
                           {[25, 50, 75].map(v => <line key={v} x1="0" y1={v} x2="100" y2={v} />)}
                        </g>
                        
                        <path 
                          d={currentPK.glucosePath}
                          fill="none" stroke="#4ade80" strokeWidth="1.5" strokeDasharray="4 4" 
                          opacity={simulationState === 'running' || simulationState === 'complete' ? 0.4 : 0}
                          className="transition-all duration-[3000ms]"
                        />

                        <path 
                          d={currentPK.path}
                          fill="none" stroke={currentPK.color} strokeWidth="3.5" strokeLinecap="round"
                          strokeDasharray="1000"
                          strokeDashoffset={simulationState === 'running' || simulationState === 'complete' ? 0 : 1000}
                          style={{ transition: 'all 3s cubic-bezier(0.4, 0, 0.2, 1)', filter: 'drop-shadow(0 0 10px currentColor)' }}
                        />
                        <path 
                          d={`${currentPK.path} L 100 90 L 0 90 Z`}
                          fill={`url(#grad-${selectedType})`}
                          opacity={simulationState === 'running' || simulationState === 'complete' ? 1 : 0}
                          className="transition-opacity duration-1000"
                        />
                     </svg>
                  </div>
                  
                  <div className="flex justify-between px-2">
                     {['0h', '4h', '8h', '12h', '16h', '20h', '24h'].map(t => (
                        <span key={t} className="text-xs font-black text-slate-500 font-mono tracking-tighter">{t}</span>
                     ))}
                  </div>

                  <div className="absolute bottom-12 right-0 flex items-center gap-4 bg-black/60 px-8 py-4 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl">
                     <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Estimated Peak:</span>
                     <span className="text-2xl font-black text-white">{currentPK.peak}</span>
                  </div>
               </div>
            </div>
          )}

          {/* 2. 细胞解锁 - 深度重构复杂版 */}
          {activeModule === 'cellular' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-slate-950">
              <div className="relative w-full h-full max-w-4xl overflow-hidden border border-white/5 rounded-[3rem] shadow-2xl">
                <svg viewBox="0 0 800 600" className="w-full h-full">
                  <defs>
                    <pattern id="lipidPattern" x="0" y="0" width="20" height="40" patternUnits="userSpaceOnUse">
                      <circle cx="10" cy="5" r="4" fill="#3b82f6" opacity="0.4" />
                      <line x1="8" y1="9" x2="8" y2="20" stroke="#3b82f6" strokeWidth="1" opacity="0.3" />
                      <line x1="12" y1="9" x2="12" y2="20" stroke="#3b82f6" strokeWidth="1" opacity="0.3" />
                      <circle cx="10" cy="35" r="4" fill="#3b82f6" opacity="0.4" />
                      <line x1="8" y1="31" x2="8" y2="20" stroke="#3b82f6" strokeWidth="1" opacity="0.3" />
                      <line x1="12" y1="31" x2="12" y2="20" stroke="#3b82f6" strokeWidth="1" opacity="0.3" />
                    </pattern>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  <text x="30" y="50" className="text-sm fill-slate-500 font-black uppercase tracking-widest">Extracellular Fluid</text>
                  
                  {[...Array(6)].map((_, i) => (
                    <circle 
                      key={i} 
                      r="6" 
                      fill="#3b82f6" 
                      filter="url(#glow)"
                      cx={350 + i * 20} 
                      cy={-20 + (scanProgress * 2.5)}
                      opacity={scanProgress > 5 ? 1 : 0}
                      style={{ transition: 'cy 0.1s linear' }}
                    />
                  ))}

                  <rect x="0" y="180" width="800" height="40" fill="url(#lipidPattern)" />
                  <rect x="0" y="180" width="800" height="40" fill="rgba(59, 130, 246, 0.05)" />
                  
                  <g transform="translate(360, 150)">
                    <path d="M0 0 Q20 -40 40 0" stroke="#3b82f6" strokeWidth="6" fill="none" strokeLinecap="round" />
                    <path d="M40 0 Q60 -40 80 0" stroke="#3b82f6" strokeWidth="6" fill="none" strokeLinecap="round" />
                    <rect x="15" y="0" width="10" height="80" fill="#2563eb" rx="5" />
                    <rect x="55" y="0" width="10" height="80" fill="#2563eb" rx="5" />
                    {scanProgress > 35 && (
                      <circle cx="40" cy="10" r="15" fill="#3b82f6" opacity={(scanProgress - 35) / 15} filter="url(#glow)" />
                    )}
                  </g>

                  <text x="30" y="570" className="text-sm fill-slate-500 font-black uppercase tracking-widest">Cytoplasm</text>

                  {scanProgress > 40 && (
                    <g opacity={(scanProgress - 40) / 30}>
                      <path 
                        d="M400 230 Q400 350 300 450 M400 230 Q400 350 500 450" 
                        stroke="#3b82f6" strokeWidth="2" strokeDasharray="5 5" fill="none"
                      >
                         <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite" />
                      </path>
                      <rect x="370" y="260" width="60" height="25" rx="12" fill="#1d4ed8" />
                      <text x="382" y="278" className="text-sm fill-white font-black">IRS-1</text>
                    </g>
                  )}

                  <g>
                    {[...Array(3)].map((_, i) => {
                      const basePos = [200, 400, 600][i];
                      const yPos = 500 - (scanProgress > 60 ? (scanProgress - 60) * 9 : 0);
                      return (
                        <g key={i} transform={`translate(${basePos}, ${yPos})`}>
                          {/* 囊泡外壳 */}
                          <circle r="30" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth="2" strokeDasharray="4 2" />
                          {/* 内部的 GLUT4 蛋白分子 (绿色小点) */}
                          <circle r="5" cx="-10" cy="-5" fill="#10b981" filter="url(#glow)" />
                          <circle r="5" cx="10" cy="5" fill="#10b981" filter="url(#glow)" />
                          <text x="-25" y="45" className="text-sm fill-green-400 font-black tracking-widest">GLUT4</text>
                        </g>
                      );
                    })}
                  </g>

                  {scanProgress > 85 && (
                    <g>
                      <rect x="180" y="180" width="40" height="40" fill="#0f172a" rx="5" stroke="#10b981" strokeWidth="2" />
                      <rect x="580" y="180" width="40" height="40" fill="#0f172a" rx="5" stroke="#10b981" strokeWidth="2" />
                      {[...Array(10)].map((_, i) => (
                        <circle key={i} r="4" fill="#10b981" filter="url(#glow)">
                           <animate attributeName="cy" from="50" to="500" dur={`${1 + Math.random()}s`} begin={`${Math.random() * 2}s`} repeatCount="indefinite" />
                           <animate attributeName="cx" values={i % 2 === 0 ? "200;200" : "600;600"} dur="2s" repeatCount="indefinite" />
                        </circle>
                      ))}
                    </g>
                  )}
                </svg>

                <div className="absolute top-8 left-1/2 -translate-x-1/2 px-12 py-6 glass rounded-[2.5rem] border-white/20 text-center backdrop-blur-2xl shadow-2xl min-w-[450px]">
                   <div className="text-xs font-black text-blue-500 uppercase tracking-[0.4em] mb-2">Cellular Event Log</div>
                   <div className="text-2xl font-black text-white leading-tight">
                      {scanProgress < 30 && "Detecting Insulin ligands..."}
                      {scanProgress >= 30 && scanProgress < 60 && "Receptor Binding Activated"}
                      {scanProgress >= 60 && scanProgress < 85 && "Signal Cascade: IRS-1 Activated"}
                      {scanProgress >= 85 && "GLUT4 Opening: Glucose Intake"}
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveLab;
