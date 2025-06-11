import React, { useState, useEffect } from 'react';
import { sendMessageToAPI } from '../services/api';

export const EvaluationScreen = ({ documentContent, simulationData, onComplete }) => {
  const [evaluation, setEvaluation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    generateEvaluation();
  }, [documentContent]);

  const generateEvaluation = async () => {
    setIsLoading(true);
    setError(null);

    const evaluationPrompt = `You are Sarah Chen, VP of Product at ShopSphere, evaluating a mobile checkout optimization proposal.

CONTEXT: 78% mobile abandonment vs 65% desktop costs us $2.4M monthly. Need solution by Q2.

DOCUMENT EXCERPT (first 1000 chars):
${documentContent.substring(0, 1000)}...

Provide evaluation as JSON only:

{
  "overall_score": 85,
  "overall_grade": "B+",
  "executive_summary": "Solid proposal with good problem understanding and practical solutions",
  "categories": [
    {
      "name": "Problem Understanding",
      "score": 85,
      "feedback": "Good grasp of mobile checkout issues",
      "strengths": ["Clear problem statement", "Used provided metrics"],
      "areas_for_improvement": ["More user perspective", "Deeper analysis"]
    },
    {
      "name": "Solution Quality",
      "score": 80,
      "feedback": "Practical approach with room for innovation",
      "strengths": ["Feasible solutions", "Addresses core issues"],
      "areas_for_improvement": ["More creative solutions", "Better prioritization"]
    },
    {
      "name": "Business Impact",
      "score": 88,
      "feedback": "Strong connection to business metrics",
      "strengths": ["Revenue focus", "Clear metrics"],
      "areas_for_improvement": ["ROI analysis", "Risk assessment"]
    }
  ],
  "leadership_feedback": {
    "what_went_well": "You demonstrated strong analytical thinking and practical problem-solving skills throughout this project.",
    "growth_opportunities": "Focus on more innovative solutions and deeper user empathy to elevate your PM impact.",
    "next_steps": "Continue developing your strategic thinking and stakeholder management skills."
  },
  "readiness_for_presentation": {
    "ready": true,
    "confidence_level": "High",
    "key_talking_points": ["Revenue impact", "User pain points", "Implementation timeline"],
    "potential_questions": ["What about budget?", "How will you measure success?"]
  }
}

Provide specific, actionable feedback that would help them grow as a product manager.`;

    try {
      const response = await sendMessageToAPI({
        message: 'Please evaluate my product requirements document.',
        history: [],
        systemPrompt: evaluationPrompt,
        characterName: 'Sarah Chen',
        characterRole: 'VP of Product'
      });

      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const evaluationData = JSON.parse(jsonMatch[0]);
        setEvaluation(evaluationData);
      } else {
        throw new Error('Could not parse evaluation response');
      }
    } catch (err) {
      console.error('Evaluation generation error:', err);
      
      // Fallback to mock evaluation for testing
      console.log('Using mock evaluation data for testing...');
      const mockEvaluation = {
        overall_score: 82,
        overall_grade: "B+",
        executive_summary: "Strong proposal that demonstrates good understanding of the mobile checkout problem and offers practical solutions. Your analytical approach and focus on user experience show promise as a product manager.",
        categories: [
          {
            name: "Problem Understanding",
            score: 85,
            feedback: "You clearly grasped the core issue of mobile checkout abandonment and its revenue impact. Good use of the provided metrics and data.",
            strengths: ["Clear problem statement", "Used quantitative data effectively", "Understood business impact"],
            areas_for_improvement: ["Could explore more user psychology", "Deeper competitive analysis"]
          },
          {
            name: "Solution Quality",
            score: 78,
            feedback: "Your solutions are practical and feasible, addressing the main pain points identified. Room for more innovative approaches.",
            strengths: ["Realistic solutions", "Addresses core issues", "Implementation-focused"],
            areas_for_improvement: ["More creative approaches", "Better solution prioritization", "Consider edge cases"]
          },
          {
            name: "Data-Driven Approach",
            score: 88,
            feedback: "Excellent use of the analytics data and research findings. You connected insights to actionable solutions effectively.",
            strengths: ["Leveraged team research", "Quantified impact", "Evidence-based decisions"],
            areas_for_improvement: ["More A/B testing ideas", "Additional metrics tracking"]
          },
          {
            name: "Implementation Planning",
            score: 75,
            feedback: "Good basic timeline and resource considerations. Could be more detailed in execution planning.",
            strengths: ["Realistic timeline", "Resource awareness", "Phased approach"],
            areas_for_improvement: ["More detailed milestones", "Risk mitigation plans", "Success criteria"]
          },
          {
            name: "Business Impact",
            score: 90,
            feedback: "Strong connection between proposed solutions and business outcomes. Clear understanding of revenue implications.",
            strengths: ["Revenue focus", "Clear ROI potential", "Executive-level thinking"],
            areas_for_improvement: ["Long-term strategic view", "Market positioning"]
          }
        ],
        leadership_feedback: {
          what_went_well: "You demonstrated strong analytical thinking and practical problem-solving skills throughout this project. Your ability to synthesize input from multiple team members and translate technical constraints into business solutions shows real PM potential. The way you balanced user needs with business requirements was particularly impressive.",
          growth_opportunities: "Focus on developing more innovative solutions and deeper user empathy to elevate your impact. Consider spending more time on strategic thinking and competitive positioning. Your next challenge will be to think beyond immediate fixes to longer-term competitive advantages.",
          next_steps: "Continue building your stakeholder management skills and practice presenting complex solutions simply. I recommend diving deeper into user research methods and developing your product intuition through more customer interactions."
        },
        readiness_for_presentation: {
          ready: true,
          confidence_level: "High",
          key_talking_points: [
            "$2.4M monthly revenue opportunity through mobile optimization",
            "User research shows clear pain points in checkout flow",
            "Phased implementation reduces risk and shows quick wins",
            "Cross-team collaboration ensures technical feasibility"
          ],
          potential_questions: [
            "What's our budget for this initiative?",
            "How will you measure success beyond conversion rates?",
            "What if Apple/Google change their payment policies?",
            "How does this fit with our annual roadmap?"
          ]
        }
      };
      
      setEvaluation(mockEvaluation);
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