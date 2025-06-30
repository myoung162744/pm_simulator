import React, { useState, useEffect } from 'react';
import { sendMessageToAPI } from '../services/api';
import { jsonrepair } from 'jsonrepair';
import { getCompanyContextForReviews } from '../companyConfig';

export const EvaluationScreen = ({ documentContent, simulationData, onComplete }) => {
  const [evaluation, setEvaluation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    generateEvaluation();
  }, [documentContent]);

  const extractJSON = (response, label) => {
    // Remove code block markers if present
    const cleaned = response.replace(/```json|```/g, '');
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (err) {
        // Try to repair the JSON if parsing fails
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
      throw new Error('Could not parse evaluation response');
    }
  };

  const generateEvaluation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Run all evaluations in parallel
      const [
        overallEvaluation,
        categoriesEvaluation,
        leadershipFeedback,
        readinessEvaluation
      ] = await Promise.all([
        // Overall Score and Grade
        sendMessageToAPI({
          message: 'Please evaluate the overall quality of this proposal.',
          history: [],
          systemPrompt: `You are Sarah Chen, VP of Product at ShopSphere, evaluating a mobile checkout optimization proposal.

COMPANY CONTEXT:
${getCompanyContextForReviews()}

PROJECT CONTEXT: 78% mobile abandonment vs 65% desktop costs us $2.4M monthly. Need solution by Q2.

DOCUMENT EXCERPT (first 1000 chars):
${documentContent.substring(0, 1000)}

Return ONLY a JSON object with this exact structure:
{
  "overall_score": number (0-100),
  "overall_grade": string (A+, A, A-, B+, B, B-, C+, C, C-, D+, D, D-, F),
  "executive_summary": string (2-3 sentences summarizing the proposal's strengths and areas for improvement)
}`,
          characterName: 'Sarah Chen',
          characterRole: 'VP of Product'
        }),

        // Categories Evaluation
        sendMessageToAPI({
          message: 'Please evaluate each category of this proposal.',
          history: [],
          systemPrompt: `You are Sarah Chen, VP of Product at ShopSphere, evaluating a mobile checkout optimization proposal.

COMPANY CONTEXT:
${getCompanyContextForReviews()}

PROJECT CONTEXT: 78% mobile abandonment vs 65% desktop costs us $2.4M monthly. Need solution by Q2.

DOCUMENT EXCERPT (first 1000 chars):
${documentContent.substring(0, 1000)}

Return ONLY a JSON object with this exact structure:
{
  "categories": [
    {
      "name": "Problem Understanding",
      "score": number (0-100),
      "feedback": string (2-3 sentences),
      "strengths": string[],
      "areas_for_improvement": string[]
    },
    {
      "name": "Solution Quality",
      "score": number (0-100),
      "feedback": string (2-3 sentences),
      "strengths": string[],
      "areas_for_improvement": string[]
    },
    {
      "name": "Data-Driven Approach",
      "score": number (0-100),
      "feedback": string (2-3 sentences),
      "strengths": string[],
      "areas_for_improvement": string[]
    },
    {
      "name": "Implementation Planning",
      "score": number (0-100),
      "feedback": string (2-3 sentences),
      "strengths": string[],
      "areas_for_improvement": string[]
    },
    {
      "name": "Business Impact",
      "score": number (0-100),
      "feedback": string (2-3 sentences),
      "strengths": string[],
      "areas_for_improvement": string[]
    }
  ]
}`,
          characterName: 'Sarah Chen',
          characterRole: 'VP of Product'
        }),

        // Leadership Feedback
        sendMessageToAPI({
          message: 'Please provide leadership feedback for this proposal.',
          history: [],
          systemPrompt: `You are Sarah Chen, VP of Product at ShopSphere, evaluating a mobile checkout optimization proposal.

COMPANY CONTEXT:
${getCompanyContextForReviews()}

PROJECT CONTEXT: 78% mobile abandonment vs 65% desktop costs us $2.4M monthly. Need solution by Q2.

DOCUMENT EXCERPT (first 1000 chars):
${documentContent.substring(0, 1000)}

Return ONLY a JSON object with this exact structure:
{
  "leadership_feedback": {
    "what_went_well": string (2-3 sentences),
    "growth_opportunities": string (2-3 sentences),
    "next_steps": string (2-3 sentences)
  }
}`,
          characterName: 'Sarah Chen',
          characterRole: 'VP of Product'
        }),

        // Readiness for Presentation
        sendMessageToAPI({
          message: 'Please evaluate the readiness for presentation.',
          history: [],
          systemPrompt: `You are Sarah Chen, VP of Product at ShopSphere, evaluating a mobile checkout optimization proposal.

COMPANY CONTEXT:
${getCompanyContextForReviews()}

PROJECT CONTEXT: 78% mobile abandonment vs 65% desktop costs us $2.4M monthly. Need solution by Q2.

DOCUMENT EXCERPT (first 1000 chars):
${documentContent.substring(0, 1000)}

Return ONLY a JSON object with this exact structure:
{
  "readiness_for_presentation": {
    "ready": boolean,
    "confidence_level": string ("High", "Medium", "Low"),
    "key_talking_points": string[],
    "potential_questions": string[]
  }
}`,
          characterName: 'Sarah Chen',
          characterRole: 'VP of Product'
        })
      ]);

      // Parse and combine all responses robustly
      const overallData = extractJSON(overallEvaluation, 'overallEvaluation');
      const categoriesData = extractJSON(categoriesEvaluation, 'categoriesEvaluation');
      const leadershipData = extractJSON(leadershipFeedback, 'leadershipFeedback');
      const readinessData = extractJSON(readinessEvaluation, 'readinessEvaluation');

      const combinedEvaluation = {
        ...overallData,
        ...categoriesData,
        ...leadershipData,
        ...readinessData
      };

      console.log('Combined Evaluation:', combinedEvaluation);
      setEvaluation(combinedEvaluation);
    } catch (err) {
      console.error('Evaluation generation error:', err);
      setError('Failed to generate evaluation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getGradeColor = (score) => {
    if (score >= 90) return '#10B981'; // Green
    if (score >= 80) return '#3B82F6'; // Blue
    if (score >= 70) return '#F59E0B'; // Yellow
    if (score >= 60) return '#EF4444'; // Red
    return '#6B7280'; // Gray
  };

  const getScoreBarWidth = (score, maxScore = 100) => {
    return `${(score / maxScore) * 100}%`;
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: 'var(--gb-cream)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{
            borderColor: 'var(--gb-blue)'
          }}></div>
          <h2 className="font-bold mb-2" style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'var(--pixel-md)',
            color: 'var(--gb-dark-blue)'
          }}>
            🔍 ANALYZING YOUR PROPOSAL
          </h2>
          <p style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'var(--pixel-xs)',
            color: 'var(--gb-dark-blue)'
          }}>
            Sarah Chen is reviewing your work...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: 'var(--gb-cream)' }}>
        <div className="text-center pokemon-panel" style={{ maxWidth: '400px', padding: 'var(--spacing-lg)' }}>
          <h2 className="font-bold mb-4" style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'var(--pixel-md)',
            color: 'var(--gb-red)'
          }}>
            ❌ EVALUATION ERROR
          </h2>
          <p className="mb-4" style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'var(--pixel-xs)',
            color: 'var(--gb-dark-blue)'
          }}>
            {error}
          </p>
          <button 
            onClick={generateEvaluation}
            className="pokemon-button pokemon-button--primary"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'var(--pixel-xs)'
            }}
          >
            🔄 TRY AGAIN
          </button>
        </div>
      </div>
    );
  }

  if (!evaluation) return null;

  return (
    <div className="h-full overflow-y-auto" style={{ backgroundColor: 'var(--gb-cream)' }}>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="pokemon-panel mb-6">
          <div className="pokemon-panel--header" style={{ backgroundColor: 'var(--gb-blue)' }}>
            <h1 className="font-bold text-white" style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'var(--pixel-lg)'
            }}>
              📊 PROPOSAL EVALUATION
            </h1>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-6xl font-bold mb-2" style={{ 
                  color: getGradeColor(evaluation.overall_score),
                  fontFamily: "'Press Start 2P', monospace"
                }}>
                  {evaluation.overall_grade}
                </div>
                <div className="text-2xl font-bold" style={{
                  color: getGradeColor(evaluation.overall_score),
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 'var(--pixel-md)'
                }}>
                  {evaluation.overall_score}/100
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold mb-1" style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 'var(--pixel-xs)',
                  color: 'var(--gb-dark-blue)'
                }}>
                  OVERALL PERFORMANCE
                </div>
                <div className="w-48 h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: getScoreBarWidth(evaluation.overall_score),
                      backgroundColor: getGradeColor(evaluation.overall_score)
                    }}
                  />
                </div>
              </div>
            </div>
            <p style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'var(--pixel-xs)',
              color: 'var(--gb-dark-blue)',
              lineHeight: '1.6'
            }}>
              {evaluation.executive_summary}
            </p>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="grid gap-4 mb-6">
          {evaluation.categories.map((category, index) => (
            <div key={index} className="pokemon-panel">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold" style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 'var(--pixel-sm)',
                    color: 'var(--gb-dark-blue)'
                  }}>
                    {category.name}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="font-bold" style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 'var(--pixel-sm)',
                      color: getGradeColor(category.score)
                    }}>
                                             {category.score}/100
                    </span>
                                         <div className="w-24 h-3 bg-gray-200 rounded-full overflow-hidden">
                       <div 
                         className="h-full transition-all duration-1000 ease-out"
                         style={{ 
                           width: getScoreBarWidth(category.score, 100),
                           backgroundColor: getGradeColor(category.score),
                           transitionDelay: `${index * 100}ms`
                         }}
                       />
                     </div>
                  </div>
                </div>
                
                <p className="mb-3" style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 'var(--pixel-xs)',
                  color: 'var(--gb-dark-blue)',
                  lineHeight: '1.5'
                }}>
                  {category.feedback}
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold mb-2" style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 'var(--pixel-xs)',
                      color: 'var(--gb-green)'
                    }}>
                      ✅ STRENGTHS
                    </h4>
                    <ul className="space-y-1">
                      {category.strengths.map((strength, i) => (
                        <li key={i} className="text-xs" style={{
                          fontFamily: "'Press Start 2P', monospace",
                          fontSize: 'var(--pixel-xs)',
                          color: 'var(--gb-dark-blue)',
                          lineHeight: '1.4'
                        }}>
                          • {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold mb-2" style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 'var(--pixel-xs)',
                      color: 'var(--gb-orange)'
                    }}>
                      📈 IMPROVEMENTS
                    </h4>
                    <ul className="space-y-1">
                      {category.areas_for_improvement.map((improvement, i) => (
                        <li key={i} className="text-xs" style={{
                          fontFamily: "'Press Start 2P', monospace",
                          fontSize: 'var(--pixel-xs)',
                          color: 'var(--gb-dark-blue)',
                          lineHeight: '1.4'
                        }}>
                          • {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Leadership Feedback */}
        <div className="pokemon-panel mb-6">
          <div className="pokemon-panel--header" style={{ backgroundColor: 'var(--gb-green)' }}>
            <h2 className="font-bold" style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'var(--pixel-md)',
              color: '#000000'
            }}>
              👩‍💼 LEADERSHIP FEEDBACK
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <h3 className="font-bold mb-2" style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 'var(--pixel-sm)',
                color: '#000000'
              }}>
                🌟 WHAT WENT WELL
              </h3>
              <p style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 'var(--pixel-xs)',
                color: '#000000',
                lineHeight: '1.6'
              }}>
                {evaluation.leadership_feedback.what_went_well}
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2" style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 'var(--pixel-sm)',
                color: '#000000'
              }}>
                🚀 GROWTH OPPORTUNITIES
              </h3>
              <p style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 'var(--pixel-xs)',
                color: '#000000',
                lineHeight: '1.6'
              }}>
                {evaluation.leadership_feedback.growth_opportunities}
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2" style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 'var(--pixel-sm)',
                color: '#000000'
              }}>
                📋 NEXT STEPS
              </h3>
              <p style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 'var(--pixel-xs)',
                color: '#000000',
                lineHeight: '1.6'
              }}>
                {evaluation.leadership_feedback.next_steps}
              </p>
            </div>
          </div>
        </div>

        {/* Presentation Readiness */}
        <div className="pokemon-panel mb-6">
          <div className="pokemon-panel--header" style={{ 
            backgroundColor: evaluation.readiness_for_presentation.ready ? 'var(--gb-green)' : 'var(--gb-orange)'
          }}>
            <h2 className="font-bold" style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'var(--pixel-md)',
              color: '#000000'
            }}>
              🎯 PRESENTATION READINESS
            </h2>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl">
                {evaluation.readiness_for_presentation.ready ? '✅' : '⚠️'}
              </div>
              <div>
                <div className="font-bold" style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 'var(--pixel-sm)',
                  color: '#000000'
                }}>
                  {evaluation.readiness_for_presentation.ready ? 'READY FOR LEADERSHIP' : 'NEEDS REFINEMENT'}
                </div>
                <div style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 'var(--pixel-xs)',
                  color: '#000000'
                }}>
                  Confidence: {evaluation.readiness_for_presentation.confidence_level}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-bold mb-2" style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 'var(--pixel-xs)',
                  color: '#000000'
                }}>
                  🎤 KEY TALKING POINTS
                </h3>
                <ul className="space-y-1">
                  {evaluation.readiness_for_presentation.key_talking_points.map((point, i) => (
                    <li key={i} style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 'var(--pixel-xs)',
                      color: '#000000',
                      lineHeight: '1.4'
                    }}>
                      • {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-2" style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 'var(--pixel-xs)',
                  color: '#000000'
                }}>
                  ❓ POTENTIAL QUESTIONS
                </h3>
                <ul className="space-y-1">
                  {evaluation.readiness_for_presentation.potential_questions.map((question, i) => (
                    <li key={i} style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 'var(--pixel-xs)',
                      color: '#000000',
                      lineHeight: '1.4'
                    }}>
                      • {question}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Complete Button */}
        <div className="text-center">
          <button
            onClick={onComplete}
            className="pokemon-button pokemon-button--primary hover:scale-105 transition-transform"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'var(--pixel-sm)',
              padding: 'var(--spacing-md) var(--spacing-xl)',
              backgroundColor: 'var(--gb-green)',
              color: '#000000'
            }}
          >
            🎉 COMPLETE SIMULATION
          </button>
        </div>
      </div>
    </div>
  );
}; 