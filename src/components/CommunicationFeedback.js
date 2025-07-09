import React, { useState, useEffect } from 'react';
import { sendMessageToAPI } from '../services/api';
import { jsonrepair } from 'jsonrepair';

export const CommunicationFeedback = ({ 
  chatMessages, 
  sharedDocuments, 
  timeSpent, 
  onContinue 
}) => {
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    generateFeedback();
  }, []);

  const extractJSON = (response, label) => {
    const cleaned = response.replace(/```json|```/g, '');
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (err) {
        try {
          const repaired = jsonrepair(jsonMatch[0]);
          return JSON.parse(repaired);
        } catch (repairErr) {
          console.error(`JSON parse/repair error in ${label}:`, repairErr, 'Raw:', jsonMatch[0]);
          throw repairErr;
        }
      }
    } else {
      console.error(`No JSON object found in ${label} response:`, response);
      throw new Error('Could not parse feedback response');
    }
  };

  const generateFeedback = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Analyze chat messages and document review
      const chatAnalysis = chatMessages
        .filter(msg => msg.role === 'user')
        .map(msg => msg.content)
        .join('\n');

      const documentsReviewed = sharedDocuments.map(doc => doc.name).join(', ');

      const response = await sendMessageToAPI({
        message: `Analyze this user's communication and research skills during the first two phases of a product management simulation.

CHAT INTERACTIONS:
${chatAnalysis}

DOCUMENTS REVIEWED:
${documentsReviewed}

TIME SPENT: ${Math.floor(timeSpent / 60)} minutes ${timeSpent % 60} seconds

Evaluate their:
1. Communication effectiveness with team members
2. Research thoroughness and document review
3. Question quality and follow-up
4. Information gathering approach
5. Professional communication style

Return ONLY a JSON object with this exact structure:
{
  "overall_score": number (0-100),
  "communication_score": number (0-100),
  "research_score": number (0-100),
  "strengths": [
    {
      "category": "communication|research|professionalism",
      "description": "specific strength observed",
      "impact": "why this matters for PM work"
    }
  ],
  "improvement_areas": [
    {
      "category": "communication|research|professionalism", 
      "description": "specific area for improvement",
      "suggestion": "concrete tip for improvement"
    }
  ],
  "communication_style": {
    "type": "direct|collaborative|analytical|empathetic",
    "description": "description of their communication approach",
    "effectiveness": "how well this style worked"
  },
  "research_approach": {
    "thoroughness": "high|medium|low",
    "focus_areas": ["technical", "user", "business", "competitive"],
    "gaps": ["areas they could have explored more"]
  },
  "key_insights_gathered": [
    "specific valuable information they collected"
  ],
  "next_phase_recommendations": [
    "specific suggestions for the planning phase"
  ]
}`,
        history: [],
        systemPrompt: `You are Sarah Chen, VP of Product at ShopSphere, providing feedback on a PM's communication and research skills.

Focus on:
- How well they gathered information from team members
- Quality of their questions and follow-up
- Thoroughness of document review
- Professional communication style
- Strategic thinking in their research approach

Be constructive and specific. Remember there are multiple valid approaches to research and communication.`
      });

      const feedbackData = extractJSON(response, 'communicationFeedback');
      setFeedback(feedbackData);

    } catch (error) {
      console.error('Feedback generation failed:', error);
      setError('Failed to generate feedback. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBarWidth = (score) => {
    return `${score}%`;
  };

  if (isLoading) {
    return (
      <div className="h-screen overflow-y-auto" style={{ backgroundColor: 'var(--gb-cream)' }}>
        <div className="max-w-4xl mx-auto p-6">
          <div className="pokemon-panel">
            <div className="pokemon-panel--header" style={{ backgroundColor: 'var(--gb-blue)' }}>
              <h1 className="font-bold text-white" style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 'var(--pixel-lg)'
              }}>
                💬 COMMUNICATION CHECKPOINT
              </h1>
            </div>
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500 mx-auto mb-4"></div>
              <p style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 'var(--pixel-md)',
                color: 'var(--gb-dark-blue)'
              }}>
                ANALYZING YOUR COMMUNICATION & RESEARCH SKILLS...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen overflow-y-auto" style={{ backgroundColor: 'var(--gb-cream)' }}>
        <div className="max-w-4xl mx-auto p-6">
          <div className="pokemon-panel">
            <div className="pokemon-panel--header" style={{ backgroundColor: 'var(--gb-red)' }}>
              <h1 className="font-bold text-white" style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 'var(--pixel-lg)'
              }}>
                ⚠️ ERROR
              </h1>
            </div>
            <div className="p-6">
              <p style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 'var(--pixel-sm)',
                color: 'var(--gb-dark-red)'
              }}>
                {error}
              </p>
              <button
                onClick={generateFeedback}
                className="pokemon-button pokemon-button--primary mt-4"
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 'var(--pixel-sm)'
                }}
              >
                🔄 TRY AGAIN
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto" style={{ backgroundColor: 'var(--gb-cream)' }}>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="pokemon-panel mb-6">
          <div className="pokemon-panel--header" style={{ backgroundColor: 'var(--gb-blue)' }}>
            <h1 className="font-bold text-white" style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'var(--pixel-lg)'
            }}>
              💬 COMMUNICATION CHECKPOINT
            </h1>
          </div>
          <div className="p-6">
            <p className="mb-4" style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'var(--pixel-sm)',
              color: 'var(--gb-dark-blue)',
              lineHeight: '1.6'
            }}>
              Great work on the research phase! Here's feedback on your communication and information gathering skills.
            </p>
          </div>
        </div>

        {/* Overall Score */}
        <div className="pokemon-panel mb-6">
          <div className="pokemon-panel--header" style={{ backgroundColor: 'var(--gb-green)' }}>
            <h2 className="font-bold text-black" style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'var(--pixel-md)'
            }}>
              📊 OVERALL PERFORMANCE
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Overall Score */}
              <div className="text-center">
                <div className="text-4xl font-bold mb-2" style={{
                  fontFamily: "'Press Start 2P', monospace",
                  color: getScoreColor(feedback.overall_score)
                }}>
                  {feedback.overall_score}/100
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className="h-3 rounded-full transition-all duration-500"
                    style={{
                      width: getScoreBarWidth(feedback.overall_score),
                      backgroundColor: feedback.overall_score >= 80 ? 'var(--gb-green)' : 
                                     feedback.overall_score >= 60 ? 'var(--gb-yellow)' : 'var(--gb-red)'
                    }}
                  ></div>
                </div>
                <p style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 'var(--pixel-xs)',
                  color: 'var(--gb-dark-blue)'
                }}>
                  OVERALL SCORE
                </p>
              </div>

              {/* Communication Score */}
              <div className="text-center">
                <div className="text-4xl font-bold mb-2" style={{
                  fontFamily: "'Press Start 2P', monospace",
                  color: getScoreColor(feedback.communication_score)
                }}>
                  {feedback.communication_score}/100
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className="h-3 rounded-full transition-all duration-500"
                    style={{
                      width: getScoreBarWidth(feedback.communication_score),
                      backgroundColor: feedback.communication_score >= 80 ? 'var(--gb-green)' : 
                                     feedback.communication_score >= 60 ? 'var(--gb-yellow)' : 'var(--gb-red)'
                    }}
                  ></div>
                </div>
                <p style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 'var(--pixel-xs)',
                  color: 'var(--gb-dark-blue)'
                }}>
                  COMMUNICATION
                </p>
              </div>

              {/* Research Score */}
              <div className="text-center">
                <div className="text-4xl font-bold mb-2" style={{
                  fontFamily: "'Press Start 2P', monospace",
                  color: getScoreColor(feedback.research_score)
                }}>
                  {feedback.research_score}/100
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className="h-3 rounded-full transition-all duration-500"
                    style={{
                      width: getScoreBarWidth(feedback.research_score),
                      backgroundColor: feedback.research_score >= 80 ? 'var(--gb-green)' : 
                                     feedback.research_score >= 60 ? 'var(--gb-yellow)' : 'var(--gb-red)'
                    }}
                  ></div>
                </div>
                <p style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 'var(--pixel-xs)',
                  color: 'var(--gb-dark-blue)'
                }}>
                  RESEARCH
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Strengths */}
        <div className="pokemon-panel mb-6">
          <div className="pokemon-panel--header" style={{ backgroundColor: 'var(--gb-green)' }}>
            <h2 className="font-bold text-black" style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'var(--pixel-md)'
            }}>
              ✅ YOUR STRENGTHS
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {feedback.strengths.map((strength, index) => (
                <div key={index} className="pokemon-textbox" style={{ backgroundColor: 'var(--gb-light-green)' }}>
                  <div className="flex items-start gap-3">
                    <span className="text-green-600 font-bold mt-1">✅</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold" style={{
                          fontFamily: "'Press Start 2P', monospace",
                          fontSize: 'var(--pixel-xs)',
                          textTransform: 'uppercase',
                          color: 'var(--gb-dark-green)'
                        }}>
                          {strength.category}
                        </span>
                      </div>
                      <p style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: '14px',
                        lineHeight: '1.5',
                        color: 'var(--gb-dark-text)'
                      }}>
                        {strength.description}
                      </p>
                      <p style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: '12px',
                        lineHeight: '1.4',
                        color: 'var(--gb-text-medium)',
                        fontStyle: 'italic',
                        marginTop: '4px'
                      }}>
                        <strong>Impact:</strong> {strength.impact}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Improvement Areas */}
        <div className="pokemon-panel mb-6">
          <div className="pokemon-panel--header" style={{ backgroundColor: 'var(--gb-yellow)' }}>
            <h2 className="font-bold text-black" style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'var(--pixel-md)'
            }}>
              🎯 IMPROVEMENT OPPORTUNITIES
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {feedback.improvement_areas.map((area, index) => (
                <div key={index} className="pokemon-textbox" style={{ backgroundColor: 'var(--gb-light-yellow)' }}>
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-600 font-bold mt-1">🎯</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold" style={{
                          fontFamily: "'Press Start 2P', monospace",
                          fontSize: 'var(--pixel-xs)',
                          textTransform: 'uppercase',
                          color: 'var(--gb-dark-yellow)'
                        }}>
                          {area.category}
                        </span>
                      </div>
                      <p style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: '14px',
                        lineHeight: '1.5',
                        color: 'var(--gb-dark-text)'
                      }}>
                        {area.description}
                      </p>
                      <p style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: '12px',
                        lineHeight: '1.4',
                        color: 'var(--gb-text-medium)',
                        fontStyle: 'italic',
                        marginTop: '4px'
                      }}>
                        <strong>Tip:</strong> {area.suggestion}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Communication Style & Research Approach */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Communication Style */}
          <div className="pokemon-panel">
            <div className="pokemon-panel--header" style={{ backgroundColor: 'var(--gb-blue)' }}>
              <h2 className="font-bold text-white" style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 'var(--pixel-sm)'
              }}>
                💬 COMMUNICATION STYLE
              </h2>
            </div>
            <div className="p-4">
              <div className="pokemon-textbox mb-3" style={{ backgroundColor: 'var(--gb-light-blue)' }}>
                <span className="font-bold" style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 'var(--pixel-xs)',
                  textTransform: 'uppercase',
                  color: 'var(--gb-dark-blue)'
                }}>
                  {feedback.communication_style.type}
                </span>
              </div>
              <p style={{
                fontFamily: "var(--font-mono)",
                fontSize: '12px',
                lineHeight: '1.4',
                color: 'var(--gb-dark-text)'
              }}>
                {feedback.communication_style.description}
              </p>
              <p style={{
                fontFamily: "var(--font-mono)",
                fontSize: '11px',
                lineHeight: '1.3',
                color: 'var(--gb-text-medium)',
                fontStyle: 'italic',
                marginTop: '4px'
              }}>
                <strong>Effectiveness:</strong> {feedback.communication_style.effectiveness}
              </p>
            </div>
          </div>

          {/* Research Approach */}
          <div className="pokemon-panel">
            <div className="pokemon-panel--header" style={{ backgroundColor: 'var(--gb-purple)' }}>
              <h2 className="font-bold text-white" style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 'var(--pixel-sm)'
              }}>
                🔍 RESEARCH APPROACH
              </h2>
            </div>
            <div className="p-4">
              <div className="pokemon-textbox mb-3" style={{ backgroundColor: 'var(--gb-light-purple)' }}>
                <span className="font-bold" style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 'var(--pixel-xs)',
                  textTransform: 'uppercase',
                  color: 'var(--gb-dark-purple)'
                }}>
                  {feedback.research_approach.thoroughness} THOROUGHNESS
                </span>
              </div>
              <div className="mb-3">
                <p style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: '11px',
                  lineHeight: '1.3',
                  color: 'var(--gb-dark-text)'
                }}>
                  <strong>Focus Areas:</strong> {feedback.research_approach.focus_areas.join(', ')}
                </p>
              </div>
              {feedback.research_approach.gaps.length > 0 && (
                <div>
                  <p style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: '11px',
                    lineHeight: '1.3',
                    color: 'var(--gb-text-medium)',
                    fontStyle: 'italic'
                  }}>
                    <strong>Could explore more:</strong> {feedback.research_approach.gaps.join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Key Insights & Next Phase Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Key Insights Gathered */}
          <div className="pokemon-panel">
            <div className="pokemon-panel--header" style={{ backgroundColor: 'var(--gb-green)' }}>
              <h2 className="font-bold text-black" style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 'var(--pixel-sm)'
              }}>
                💡 KEY INSIGHTS GATHERED
              </h2>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {feedback.key_insights_gathered.map((insight, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">•</span>
                    <p style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: '11px',
                      lineHeight: '1.3',
                      color: 'var(--gb-dark-text)'
                    }}>
                      {insight}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Next Phase Recommendations */}
          <div className="pokemon-panel">
            <div className="pokemon-panel--header" style={{ backgroundColor: 'var(--gb-orange)' }}>
              <h2 className="font-bold text-white" style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 'var(--pixel-sm)'
              }}>
                🚀 NEXT PHASE TIPS
              </h2>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {feedback.next_phase_recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold mt-1">→</span>
                    <p style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: '11px',
                      lineHeight: '1.3',
                      color: 'var(--gb-dark-text)'
                    }}>
                      {rec}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={onContinue}
            className="pokemon-button pokemon-button--primary text-lg px-8 py-3"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'var(--pixel-sm)'
            }}
          >
            📝 CONTINUE TO PLANNING
          </button>
        </div>
      </div>
    </div>
  );
}; 