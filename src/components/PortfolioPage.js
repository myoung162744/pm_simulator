import React, { useState } from 'react';
import { globalVariables, scenario } from '../promptConfig';

export const PortfolioPage = ({ documentContent, onContinue }) => {
  const [copied, setCopied] = useState(false);

  const portfolioContent = `# Product Management Case Study: ${globalVariables.project.name}

## Scenario

${scenario.replace(/##/g, '##').replace(/\*\*/g, '**')}

---

## My Solution

${documentContent || 'No proposal content available.'}

---

*This proposal was created as part of the ShopSphere Product Management Simulation.*`;

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(portfolioContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = portfolioContent;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="h-screen overflow-y-auto" style={{ backgroundColor: 'var(--gb-cream)' }}>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="pokemon-panel mb-6">
          <div className="pokemon-panel--header" style={{ backgroundColor: 'var(--gb-green)' }}>
            <h1 className="font-bold text-black" style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'var(--pixel-lg)'
            }}>
              📁 ADD TO PORTFOLIO
            </h1>
          </div>
          <div className="p-6">
            <p className="mb-4" style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'var(--pixel-sm)',
              color: 'var(--gb-dark-blue)',
              lineHeight: '1.6'
            }}>
              Great work! Your proposal is ready to add to your portfolio.
            </p>
            <p className="mb-6" style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'var(--pixel-xs)',
              color: 'var(--gb-dark-blue)',
              lineHeight: '1.6'
            }}>
              Copy the content below to showcase your product management skills. 
              It includes both the scenario you tackled and your complete solution.
            </p>

            {/* Copy Button */}
            <div className="flex gap-4 mb-4">
              <button
                onClick={handleCopyToClipboard}
                className="pokemon-button pokemon-button--primary"
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 'var(--pixel-sm)',
                  backgroundColor: copied ? 'var(--gb-green)' : 'var(--gb-blue)',
                  color: copied ? '#000000' : '#ffffff'
                }}
              >
                {copied ? '✓ COPIED!' : '📋 COPY TO CLIPBOARD'}
              </button>
              
              <button
                onClick={onContinue}
                className="pokemon-button pokemon-button--secondary"
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 'var(--pixel-sm)'
                }}
              >
                🎉 FINISH
              </button>
            </div>
          </div>
        </div>

        {/* Preview Content */}
        <div className="pokemon-panel">
          <div className="pokemon-panel--header" style={{ backgroundColor: 'var(--gb-blue)' }}>
            <h2 className="font-bold text-white" style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'var(--pixel-md)'
            }}>
              📄 PORTFOLIO CONTENT PREVIEW
            </h2>
          </div>
          <div className="p-6">
            <div 
              className="pokemon-textbox max-h-96 overflow-y-auto"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: '12px',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap',
                color: 'var(--gb-dark-text)'
              }}
            >
              {portfolioContent}
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="pokemon-panel mt-6">
          <div className="p-4">
            <h3 className="font-bold mb-3" style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'var(--pixel-sm)',
              color: 'var(--gb-dark-blue)'
            }}>
              💡 PORTFOLIO TIPS
            </h3>
            <ul className="space-y-2" style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'var(--pixel-xs)',
              color: 'var(--gb-dark-blue)',
              lineHeight: '1.5'
            }}>
              <li>• Add this to your LinkedIn or personal website</li>
              <li>• Include it in your PM portfolio or case study collection</li>
              <li>• Use it as a talking point in product management interviews</li>
              <li>• Reference your process and strategic thinking in cover letters</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}; 