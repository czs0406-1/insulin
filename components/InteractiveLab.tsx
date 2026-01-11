
import React, { useState, useEffect, useMemo } from 'react';

const InteractiveLab: React.FC = () => {
  const [activeModule, setActiveModule] = useState<'dynamics' | 'cellular'>('dynamics');
  const [simulationState, setSimulationState] = useState<'idle' | 'running' | 'complete'>('idle');
  const [selectedType, setSelectedType] = useState('rapid');
  const [scanProgress, setScanProgress] = useState(0);

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
    <div className="w-full max-w-7xl mx-auto bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-2xl relative">
      
      {/* 模块切换导航 */}
      <div className="flex bg-slate-50 border-b border-slate-100">
        {[
          { id: 'dynamics', label: '药动学全景模拟', icon: '📊' },
          { id: 'cellular', label: '细胞通路解锁', icon: '🧫' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => { setActiveModule(tab.id as any); setSimulationState('idle'); setScanProgress(0); }}
            className={`flex-1 py-10 flex flex-col items-center gap-3 transition-all relative group ${activeModule === tab.id ? 'bg-white' : 'hover:bg-slate-100/50'}`}
          >
            <span className={`text-3xl transition-transform ${activeModule === tab.id ? 'scale-110' : ''}`}>{tab.icon}</span>
            <span className={`text-base font-black uppercase tracking-[0.2em] ${activeModule === tab.id ? 'text-blue-600' : 'text-slate-400'}`}>
              {tab.label}
            </span>
            {activeModule === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"></div>}
          </button>
        ))}
      </div>

      <div className="p-10 lg:p-16 flex flex-col lg:flex-row gap-12 min-h-[700px] items-stretch">
        
        {/* 左侧控制面板 */}
        <div className="lg:w-[360px] flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest">
              <span className={`w-2 h-2 rounded-full ${simulationState === 'running' ? 'bg-amber-400 animate-ping' : 'bg-green-400'}`}></span>
              Status: {simulationState}
            </div>
            
            <h3 className="text-3xl lg:text-4xl font-black text-slate-900 leading-tight tracking-tighter">
              {activeModule === 'dynamics' && "时效动力模拟"}
              {activeModule === 'cellular' && "胞内信号联级"}
            </h3>

            <div className="space-y-4">
              <p className="text-slate-500 text-lg font-medium">
                {activeModule === 'dynamics' && "实时模拟药物在体内的浓度曲线（实线）及对应的血糖下降趋势（虚线）。"}
                {activeModule === 'cellular' && "模拟胰岛素与受体结合后的跨膜传递过程。观察 GLUT4 转运蛋白如何开启。"}
              </p>
              
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progress</span>
                  <span className="text-sm font-mono font-black text-blue-600">{scanProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${scanProgress}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-8 border-t border-slate-100">
            {activeModule === 'dynamics' && (
              <div className="grid grid-cols-2 gap-3">
                {Object.keys(pkData).map(k => (
                  <button 
                    key={k}
                    onClick={() => { setSelectedType(k); setSimulationState('idle'); setScanProgress(0); }}
                    className={`py-4 rounded-xl text-sm font-black uppercase tracking-widest border transition-all ${selectedType === k ? 'bg-blue-600 text-white border-blue-600 shadow-lg' : 'bg-transparent text-slate-400 border-slate-200 hover:border-blue-200'}`}
                  >
                    {(pkData as any)[k].label}
                  </button>
                ))}
              </div>
            )}
            
            <button 
              onClick={handleRunSim}
              disabled={simulationState === 'running'}
              className={`w-full py-6 rounded-xl text-xl font-black transition-all shadow-xl ${simulationState !== 'running' ? 'bg-slate-900 hover:bg-black text-white' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
            >
              {simulationState === 'idle' ? '启动仿真程序' : '仿真运行中'}
            </button>
          </div>
        </div>

        {/* 右侧交互视觉区 */}
        <div className="flex-1 relative rounded-[2rem] bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center">
          
          {activeModule === 'dynamics' && (
            <div className="absolute inset-0 flex items-stretch p-12">
               <div className="flex-1 flex flex-col relative">
                  <div className="absolute inset-0 bg-green-500/5 rounded-2xl border border-green-500/10 pointer-events-none" style={{ top: '40%', height: '25%' }}>
                     <span className="absolute right-4 top-2 text-[10px] font-black text-green-600/50 uppercase tracking-widest">Normal Glycemic Zone</span>
                  </div>
                  
                  <div className="flex-1 relative border-l-2 border-b-2 border-slate-200 mb-8 overflow-hidden">
                     <div className="absolute top-0 bottom-0 w-[1px] bg-slate-400/50 z-20" style={{ left: `${scanProgress}%`, opacity: simulationState === 'running' ? 1 : 0 }}></div>

                     <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                        <defs>
                          <linearGradient id={`grad-${selectedType}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={currentPK.color} stopOpacity="0.2" />
                            <stop offset="100%" stopColor={currentPK.color} stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <g stroke="#e2e8f0" strokeWidth="0.2">
                           {[20, 40, 60, 80].map(v => <line key={v} x1={v} y1="0" x2={v} y2="100" />)}
                           {[25, 50, 75].map(v => <line key={v} x1="0" y1={v} x2="100" y2={v} />)}
                        </g>
                        
                        <path 
                          d={currentPK.glucosePath}
                          fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" 
                          opacity={simulationState === 'running' || simulationState === 'complete' ? 0.6 : 0}
                          className="transition-all duration-[3000ms]"
                        />

                        <path 
                          d={currentPK.path}
                          fill="none" stroke={currentPK.color} strokeWidth="3" strokeLinecap="round"
                          strokeDasharray="1000"
                          strokeDashoffset={simulationState === 'running' || simulationState === 'complete' ? 0 : 1000}
                          style={{ transition: 'all 3s cubic-bezier(0.4, 0, 0.2, 1)' }}
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
                        <span key={t} className="text-[10px] font-black text-slate-400 font-mono">{t}</span>
                     ))}
                  </div>

                  <div className="absolute bottom-8 right-8 flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-lg">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Peak:</span>
                     <span className="text-xl font-black text-slate-800">{currentPK.peak}</span>
                  </div>
               </div>
            </div>
          )}

          {activeModule === 'cellular' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-slate-50">
              <div className="relative w-full h-full max-w-4xl overflow-hidden border border-slate-200 rounded-[2rem] bg-white shadow-inner">
                <svg viewBox="0 0 800 600" className="w-full h-full">
                  <defs>
                    <pattern id="lipidPatternLight" x="0" y="0" width="20" height="40" patternUnits="userSpaceOnUse">
                      <circle cx="10" cy="5" r="4" fill="#94a3b8" opacity="0.3" />
                      <line x1="8" y1="9" x2="8" y2="20" stroke="#94a3b8" strokeWidth="1" opacity="0.2" />
                      <line x1="12" y1="9" x2="12" y2="20" stroke="#94a3b8" strokeWidth="1" opacity="0.2" />
                      <circle cx="10" cy="35" r="4" fill="#94a3b8" opacity="0.3" />
                    </pattern>
                  </defs>

                  <text x="30" y="50" className="text-[10px] fill-slate-300 font-black uppercase tracking-widest">Extracellular Fluid</text>
                  
                  {[...Array(6)].map((_, i) => (
                    <circle 
                      key={i} 
                      r="5" 
                      fill="#3b82f6" 
                      cx={350 + i * 20} 
                      cy={-20 + (scanProgress * 2.5)}
                      opacity={scanProgress > 5 ? 1 : 0}
                      style={{ transition: 'cy 0.1s linear' }}
                    />
                  ))}

                  <rect x="0" y="180" width="800" height="40" fill="url(#lipidPatternLight)" />
                  
                  <g transform="translate(360, 150)">
                    <path d="M0 0 Q20 -40 40 0" stroke="#cbd5e1" strokeWidth="5" fill="none" />
                    <path d="M40 0 Q60 -40 80 0" stroke="#cbd5e1" strokeWidth="5" fill="none" />
                    <rect x="15" y="0" width="10" height="80" fill="#94a3b8" rx="5" />
                    <rect x="55" y="0" width="10" height="80" fill="#94a3b8" rx="5" />
                  </g>

                  {scanProgress > 40 && (
                    <path 
                      d="M400 230 Q400 350 300 450 M400 230 Q400 350 500 450" 
                      stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 4" fill="none"
                    />
                  )}

                  <g>
                    {[200, 400, 600].map((basePos, i) => {
                      const yPos = 500 - (scanProgress > 60 ? (scanProgress - 60) * 8 : 0);
                      return (
                        <g key={i} transform={`translate(${basePos}, ${yPos})`}>
                          <circle r="25" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
                          <circle r="4" cx="-8" cy="-5" fill="#10b981" />
                          <circle r="4" cx="8" cy="5" fill="#10b981" />
                        </g>
                      );
                    })}
                  </g>
                </svg>

                <div className="absolute top-6 left-1/2 -translate-x-1/2 px-10 py-5 bg-white border border-slate-100 rounded-3xl text-center shadow-xl min-w-[360px]">
                   <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Cellular Event Log</div>
                   <div className="text-xl font-black text-slate-800">
                      {scanProgress < 30 && "Detecting ligands..."}
                      {scanProgress >= 30 && scanProgress < 60 && "Binding Activated"}
                      {scanProgress >= 60 && scanProgress < 85 && "Signal Cascade..."}
                      {scanProgress >= 85 && "GLUT4 Opening"}
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
