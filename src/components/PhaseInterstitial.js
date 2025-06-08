import React from 'react';

export const PhaseInterstitial = ({ 
  phase, 
  onContinue, 
  progress, 
  isNewPhase = false,
  timeSpent = 0 
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="pokemon-panel max-w-2xl mx-4 p-8 animate-fade-in">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">{phase.icon}</div>
          
          {isNewPhase ? (
            <div className="pokemon-textbox mb-4 text-center">
              <h2 className="text-lg font-bold mb-2" style={{
                fontFamily: "'Press Start 2P', monospace",
                color: 'var(--gb-dark-green)'
              }}>
                PHASE {progress.currentPhase} OF {progress.totalPhases}
              </h2>
              <h1 className="text-xl font-bold mb-2" style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 'var(--pixel-base)'
              }}>
                {phase.title}
              </h1>
              <p className="text-sm mb-4" style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 'var(--pixel-xs)',
                color: 'var(--gb-text-medium)'
              }}>
                {phase.subtitle}
              </p>
            </div>
          ) : (
            <div className="pokemon-textbox mb-4 text-center">
              <h2 className="text-lg font-bold mb-2" style={{
                fontFamily: "'Press Start 2P', monospace",
                color: 'var(--gb-dark-green)'
              }}>
                PHASE COMPLETE!
              </h2>
              <p className="text-sm mb-2" style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 'var(--pixel-xs)'
              }}>
                Time spent: {formatTime(timeSpent)}
              </p>
            </div>
          )}
        </div>

        <div className="pokemon-textbox mb-6">
          <h3 className="font-bold mb-3" style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'var(--pixel-sm)'
          }}>
            DESCRIPTION:
          </h3>
          <p className="mb-4 leading-relaxed" style={{
            fontFamily: "var(--font-mono)",
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            {phase.description}
          </p>
          
          <h3 className="font-bold mb-3" style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'var(--pixel-sm)'
          }}>
            OBJECTIVES:
          </h3>
          <ul className="space-y-2">
            {phase.objectives.map((objective, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-600 font-bold">▶</span>
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: '13px',
                  lineHeight: '1.4'
                }}>
                  {objective}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pokemon-textbox mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold" style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'var(--pixel-xs)'
            }}>
              ESTIMATED TIME:
            </span>
            <span style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'var(--pixel-xs)',
              color: 'var(--gb-text-medium)'
            }}>
              {phase.estimatedTime}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-bold" style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'var(--pixel-xs)'
            }}>
              OVERALL PROGRESS:
            </span>
            <span style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'var(--pixel-xs)',
              color: 'var(--gb-text-medium)'
            }}>
              {progress.percentage}%
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-300 h-3 mt-2 border-2 border-gray-600">
            <div 
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onContinue}
            className="pokemon-button pokemon-button--primary text-lg px-8 py-3"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'var(--pixel-sm)'
            }}
          >
            {isNewPhase ? 'START PHASE' : 'CONTINUE'}
          </button>
        </div>

        {isNewPhase && (
          <div className="text-center mt-4">
            <p className="text-xs" style={{
              fontFamily: "'Press Start 2P', monospace",
              color: 'var(--gb-text-light)',
              fontSize: 'var(--pixel-xs)'
            }}>
              Press ENTER or click to continue
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Component for showing current phase status in header
export const PhaseStatus = ({ phase, progress, phaseProgress, simulationConfig }) => {
  const [showTooltip, setShowTooltip] = React.useState(false);

  return (
    <div className="flex items-center gap-4">
      <div 
        className="pokemon-textbox px-3 py-1 relative cursor-help"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <span className="font-bold mr-2" style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 'var(--pixel-xs)'
        }}>
          PHASE {progress.currentPhase}:
        </span>
        <span style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 'var(--pixel-xs)',
          color: 'var(--gb-text-medium)'
        }}>
          {phase.title}
        </span>
        
        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute top-full left-0 mt-2 w-80 z-50 animate-fade-in">
            <div className="pokemon-panel p-4 shadow-lg">
              {/* Current Objectives */}
              <h3 className="font-bold mb-3 text-center" style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 'var(--pixel-sm)',
                color: 'var(--gb-dark-green)'
              }}>
                CURRENT OBJECTIVES
              </h3>
              
              <div className="space-y-3 mb-4">
                {phase.objectives.map((objective, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">
                      {index < phaseProgress.completed ? '✓' : '▶'}
                    </span>
                    <span 
                      className={index < phaseProgress.completed ? 'line-through opacity-60' : ''}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: '12px',
                        lineHeight: '1.4'
                      }}
                    >
                      {objective}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mb-4 pt-3 border-t-2 border-gray-300">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold" style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 'var(--pixel-xs)'
                  }}>
                    PHASE PROGRESS:
                  </span>
                  <span style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 'var(--pixel-xs)',
                    color: 'var(--gb-text-medium)'
                  }}>
                    {phaseProgress.percentage}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-300 h-2 border border-gray-600">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${phaseProgress.percentage}%` }}
                  />
                </div>
              </div>

              {/* Mission Context */}
              <div className="pt-3 border-t-2 border-gray-300">
                <h3 className="font-bold mb-3 text-center" style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 'var(--pixel-sm)',
                  color: 'var(--gb-dark-green)'
                }}>
                  MISSION CONTEXT
                </h3>
                <div className="space-y-2 text-xs" style={{ fontFamily: "var(--font-mono)" }}>
                  <p><strong>Company:</strong> {simulationConfig?.company?.name || 'ShopSphere'}</p>
                  <p><strong>Role:</strong> {simulationConfig?.userRole?.title || 'Senior Product Manager'}</p>
                  <p><strong>Manager:</strong> {simulationConfig?.userRole?.manager || 'Sarah Chen (VP of Product)'}</p>
                  <p><strong>Problem:</strong> 78% mobile abandonment vs 65% desktop</p>
                  <p><strong>Impact:</strong> $2.4M monthly revenue at risk</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="pokemon-textbox px-3 py-1">
        <span className="font-bold mr-2" style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 'var(--pixel-xs)'
        }}>
          PROGRESS:
        </span>
        <span style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 'var(--pixel-xs)',
          color: 'var(--gb-text-medium)'
        }}>
          {phaseProgress.completed}/{phaseProgress.total}
        </span>
      </div>
    </div>
  );
};

// Component for showing objectives sidebar
export const ObjectivesSidebar = ({ phase, phaseProgress, completedActions }) => {
  return (
    <div className="pokemon-panel p-4 mb-4">
      <h3 className="font-bold mb-3 text-center" style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 'var(--pixel-sm)',
        color: 'var(--gb-dark-green)'
      }}>
        CURRENT OBJECTIVES
      </h3>
      
      <div className="space-y-3">
        {phase.objectives.map((objective, index) => (
          <div key={index} className="flex items-start gap-2">
            <span className="text-green-600 font-bold mt-1">
              {index < phaseProgress.completed ? '✓' : '▶'}
            </span>
            <span 
              className={index < phaseProgress.completed ? 'line-through opacity-60' : ''}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: '12px',
                lineHeight: '1.4'
              }}
            >
              {objective}
            </span>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t-2 border-gray-300">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold" style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'var(--pixel-xs)'
          }}>
            PHASE PROGRESS:
          </span>
          <span style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'var(--pixel-xs)',
            color: 'var(--gb-text-medium)'
          }}>
            {phaseProgress.percentage}%
          </span>
        </div>
        
        <div className="w-full bg-gray-300 h-2 border border-gray-600">
          <div 
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${phaseProgress.percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}; 