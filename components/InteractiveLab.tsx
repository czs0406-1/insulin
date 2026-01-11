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
      }, 50); 
    }
    return () => clearInterval(interval);
  }, [simulationState]);

  const handleRunSim = () => {
    if (simulationState === 'running') return;
    setSimulationState('running');
  };

  const currentPK = (pkData as any)[selectedType];

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-[3rem] border border-stone-100 overflow-hidden shadow-2xl relative">
      
      {/* 模块切换导航 */}
      <div className="flex bg-stone-50 border-b border-stone-100">
        {[
          { id: 'dynamics', label: '药动学全景模拟', icon: '📊' },
          { id: 'cellular', label: '细胞通路解锁', icon: '🧫' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => { setActiveModule(tab.id as any); setSimulationState('idle'); setScanProgress(0); }}
            className={`flex-1 py-10 flex flex-col items-center gap-3 transition-all relative group ${activeModule === tab.id ? 'bg-white' : 'hover:bg-stone-100/50'}`}
          >
            <span className={`text-3xl transition-transform ${activeModule === tab.id ? 'scale-110' : ''}`}>{tab.icon}</span>
            <span className={`text-base font-black uppercase tracking-[0.2em] ${activeModule === tab.id ? 'text-indigo-600' : 'text-stone-400'}`}>
              {tab.label}
            </span>
            {activeModule === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500"></div>}
          </button>
        ))}
      </div>

      <div className="p-10 lg:p-16 flex flex-col lg:flex-row gap-12 min-h-[800px] items-stretch">
        
        {/* 左侧控制面板 */}
        <div className="lg:w-[360px] flex flex-col justify-between space-y-8 shrink-0">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-50 border border-stone-100 text-stone-600 text-[10px] font-black uppercase tracking-widest">
              <span className={`w-2 h-2 rounded-full ${simulationState === 'running' ? 'bg-indigo-400 animate-ping' : 'bg-stone-300'}`}></span>
              Status: {simulationState}
            </div>
            
            <h3 className="text-3xl lg:text-4xl font-extrabold text-stone-900 leading-tight tracking-tighter">
              {activeModule === 'dynamics' && "时效动力模拟"}
              {activeModule === 'cellular' && "胞内信号联级"}
            </h3>

            <div className="space-y-4">
              <p className="text-stone-500 text-lg font-medium">
                {activeModule === 'dynamics' && "实时模拟药物在体内的浓度曲线（实线）及对应的血糖下降趋势（虚线）。"}
                {activeModule === 'cellular' && "解构胰岛素受体激活后的跨膜信号传递过程，观察 GLUT4 转运蛋白如何开启。"}
              </p>
              
              <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Processing</span>
                  <span className="text-sm font-mono font-black text-indigo-600">{scanProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${scanProgress}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-8 border-t border-stone-100">
            {activeModule === 'dynamics' && (
              <div className="grid grid-cols-2 gap-3">
                {Object.keys(pkData).map(k => (
                  <button 
                    key={k}
                    onClick={() => { setSelectedType(k); setSimulationState('idle'); setScanProgress(0); }}
                    className={`py-4 rounded-xl text-sm font-black uppercase tracking-widest border transition-all ${selectedType === k ? 'bg-stone-900 text-white border-stone-900 shadow-lg' : 'bg-transparent text-stone-400 border-stone-100 hover:border-stone-200'}`}
                  >
                    {(pkData as any)[k].label}
                  </button>
                ))}
              </div>
            )}
            
            <button 
              onClick={handleRunSim}
              disabled={simulationState === 'running'}
              className={`w-full py-6 rounded-xl text-xl font-black transition-all shadow-xl ${simulationState !== 'running' ? 'bg-stone-900 hover:bg-black text-white' : 'bg-stone-100 text-stone-300 cursor-not-allowed'}`}
            >
              {simulationState === 'idle' ? '启动仿真程序' : '仿真运行中'}
            </button>
          </div>
        </div>

        {/* 右侧交互视觉区 */}
        <div className="flex-1 relative rounded-[2rem] bg-stone-50/50 border border-stone-100 overflow-hidden">
          
          {activeModule === 'dynamics' && (
            <div className="absolute inset-0 flex items-stretch p-12">
               <div className="flex-1 flex flex-col relative">
                  <div className="absolute inset-0 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 pointer-events-none" style={{ top: '40%', height: '25%' }}>
                     <span className="absolute right-4 top-2 text-[10px] font-black text-emerald-600/50 uppercase tracking-widest">Target Glycemic Zone</span>
                  </div>
                  
                  <div className="flex-1 relative border-l-2 border-b-2 border-stone-200 mb-8 overflow-hidden">
                     <div className="absolute top-0 bottom-0 w-[1px] bg-indigo-400/50 z-20" style={{ left: `${scanProgress}%`, opacity: simulationState === 'running' ? 1 : 0 }}></div>

                     <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                        <defs>
                          <linearGradient id={`grad-${selectedType}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={currentPK.color} stopOpacity="0.2" />
                            <stop offset="100%" stopColor={currentPK.color} stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <g stroke="#f5f5f4" strokeWidth="0.2">
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
                        <span key={t} className="text-[10px] font-black text-stone-300 font-mono">{t}</span>
                     ))}
                  </div>

                  <div className="absolute bottom-8 right-8 flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-stone-100 shadow-xl">
                     <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Peak:</span>
                     <span className="text-xl font-black text-stone-800">{currentPK.peak}</span>
                  </div>
               </div>
            </div>
          )}

          {activeModule === 'cellular' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 gap-8">
              {/* 模拟控制日志 - 已移至外部顶部 */}
              <div className="px-12 py-5 bg-white border border-stone-100 rounded-3xl text-center shadow-xl min-w-[420px] z-20">
                 <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em] mb-1.5">Simulation Control Log</div>
                 <div className="text-xl font-extrabold text-stone-800">
                    {scanProgress < 25 && "等待配体分子接近..."}
                    {scanProgress >= 25 && scanProgress < 45 && "胰岛素结合并诱导构象改变"}
                    {scanProgress >= 45 && scanProgress < 60 && "受体酪氨酸激酶自磷酸启动"}
                    {scanProgress >= 60 && scanProgress < 85 && "胞内级联信号传播 (IRS/AKT)"}
                    {scanProgress >= 85 && scanProgress < 95 && "GLUT4 蛋白载体向膜转运..."}
                    {scanProgress >= 95 && "通路激活：载体嵌入，转运开启"}
                 </div>
              </div>

              {/* 动画演示容器 */}
              <div className="relative w-full flex-1 max-w-4xl overflow-hidden border border-stone-200 rounded-[3rem] bg-white shadow-2xl">
                <svg viewBox="0 0 800 600" className="w-full h-full">
                  <defs>
                    <pattern id="lipidPatternStone" x="0" y="0" width="20" height="40" patternUnits="userSpaceOnUse">
                      <circle cx="10" cy="6" r="5" fill="#e7e5e4" />
                      <line x1="10" y1="12" x2="10" y2="25" stroke="#e7e5e4" strokeWidth="1.5" />
                      <circle cx="10" cy="34" r="5" fill="#e7e5e4" />
                    </pattern>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* 细胞外部与转运动画：葡萄糖 */}
                  <text x="30" y="40" className="text-[11px] fill-stone-300 font-bold uppercase tracking-widest">Extracellular Fluid (Glucose rich)</text>
                  {[...Array(18)].map((_, i) => {
                    const isTransporting = scanProgress > 95;
                    const transportProgress = isTransporting ? (scanProgress - 95) * 60 : 0;
                    const shouldTransport = i % 3 === 0;
                    const yOffset = shouldTransport ? transportProgress : 0;
                    const isFullyInside = (40 + (i % 3 * 25) + yOffset) > 220;
                    const opacity = isFullyInside ? 0.4 : 0.8;

                    return (
                      <circle 
                        key={`glc-${i}`}
                        r="4.5" 
                        fill="#10b981" 
                        opacity={opacity}
                        cx={40 + (i * 44) + (Math.sin(scanProgress/12 + i) * 10)}
                        cy={40 + (i % 3 * 25) + yOffset}
                        className="transition-all duration-300"
                      />
                    );
                  })}

                  {/* 胰岛素分子 */}
                  {[...Array(4)].map((_, i) => {
                    const progressFactor = Math.min(scanProgress * 3.5, 130);
                    return (
                      <g key={`ins-${i}`} transform={`translate(${340 + i * 40}, ${-20 + progressFactor})`} opacity={scanProgress > 0 ? 1 : 0}>
                        <circle r="6" fill="#6366f1" filter="url(#glow)" />
                        <circle r="2" fill="white" cx="-1" cy="-1" />
                      </g>
                    );
                  })}

                  {/* 脂质双分子层 */}
                  <rect x="0" y="180" width="800" height="40" fill="url(#lipidPatternStone)" />
                  
                  {/* 胰岛素受体 (IR) */}
                  <g transform="translate(360, 140)">
                    <path d="M0 0 Q20 -50 40 0" stroke={scanProgress > 35 ? "#6366f1" : "#d6d3d1"} strokeWidth="6" fill="none" className="transition-colors duration-500" />
                    <path d="M40 0 Q60 -50 80 0" stroke={scanProgress > 35 ? "#6366f1" : "#d6d3d1"} strokeWidth="6" fill="none" className="transition-colors duration-500" />
                    <rect x="15" y="0" width="12" height="100" fill={scanProgress > 40 ? "#6366f1" : "#a8a29e"} rx="6" />
                    <rect x="53" y="0" width="12" height="100" fill={scanProgress > 40 ? "#6366f1" : "#a8a29e"} rx="6" />
                    {scanProgress > 45 && (
                      <g filter="url(#glow)">
                        <circle cx="21" cy="90" r="5" fill="#fb7185" />
                        <circle cx="59" cy="90" r="5" fill="#fb7185" />
                        <text x="70" y="95" className="text-[10px] fill-rose-500 font-bold italic">Phosphorylation</text>
                      </g>
                    )}
                  </g>

                  {/* 胞内级联反应 */}
                  {scanProgress > 50 && (
                    <g opacity={(scanProgress - 50) / 10}>
                      <rect x="375" y="260" width="50" height="30" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1" rx="8" />
                      <text x="400" y="280" textAnchor="middle" className="text-[10px] font-black fill-stone-800">IRS-1</text>
                    </g>
                  )}

                  {scanProgress > 65 && (
                    <g opacity={(scanProgress - 65) / 10}>
                      <circle cx="400" cy="350" r="25" fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="1" />
                      <text x="400" y="354" textAnchor="middle" className="text-[10px] font-black fill-stone-800">AKT</text>
                      <path d="M400 290 L 400 325" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="4 2" />
                    </g>
                  )}

                  {/* GLUT4 易位模拟 */}
                  <g>
                    {[200, 400, 600].map((basePos, i) => {
                      const activationDelay = 70;
                      const isMoving = scanProgress > activationDelay;
                      const moveDist = isMoving ? (scanProgress - activationDelay) * 11 : 0;
                      const yPos = 500 - moveDist;
                      const finalY = Math.max(yPos, 190); 
                      
                      return (
                        <g key={i} transform={`translate(${basePos}, ${finalY})`} opacity={scanProgress > 10 ? 1 : 0}>
                          <circle r="30" fill="none" stroke="#e7e5e4" strokeWidth="1" strokeDasharray="4 4" opacity={finalY > 195 ? 1 : 0.2} />
                          <circle r="22" fill="#fafaf9" stroke="#cbd5e1" strokeWidth="0.5" opacity={finalY > 195 ? 1 : 0} />
                          <circle r="6" cx="-12" cy="-5" fill="#10b981" filter={scanProgress > 95 ? "url(#glow)" : ""} />
                          <circle r="6" cx="12" cy="5" fill="#10b981" filter={scanProgress > 95 ? "url(#glow)" : ""} />
                          <circle r="6" cx="0" cy="-15" fill="#10b981" filter={scanProgress > 95 ? "url(#glow)" : ""} />
                        </g>
                      );
                    })}
                  </g>

                  {/* 信号传播连线 */}
                  {scanProgress > 70 && (
                    <path 
                      d="M400 375 C 400 450, 200 450, 200 470 M400 375 L 400 470 M400 375 C 400 450, 600 450, 600 470" 
                      stroke="#6366f1" strokeWidth="1.5" strokeDasharray="6 4" fill="none"
                      className="animate-pulse"
                    />
                  )}

                  <text x="30" y="560" className="text-[11px] fill-stone-300 font-bold uppercase tracking-widest">Intracellular (Cytoplasm)</text>
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveLab;