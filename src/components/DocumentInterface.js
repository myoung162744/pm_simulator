import React, { useState, useRef, useEffect } from 'react';
import { FileText } from 'lucide-react';

export const DocumentInterface = ({ 
  documentContent, 
  setDocumentContent, 
  comments,
  generateComments,
  isGeneratingComments,
  clearComments
}) => {
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const commentsContainerRef = useRef(null);
  const documentContainerRef = useRef(null);

  // Function to handle clicking on highlighted text
  const handleHighlightClick = (commentId) => {
    setSelectedCommentId(commentId);
    
    // Scroll to the corresponding comment in the sidebar
    const commentElement = document.getElementById(`comment-${commentId}`);
    if (commentElement && commentsContainerRef.current) {
      commentElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'nearest'
      });
    }
  };

  // Function to handle clicking on a comment
  const handleCommentClick = (commentId) => {
    setSelectedCommentId(commentId);
    
    // Scroll to the corresponding highlighted text in the document
    const highlightElement = document.getElementById(`highlight-${commentId}`);
    if (highlightElement && documentContainerRef.current) {
      highlightElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'nearest'
      });
    }
  };

  // Clear selection when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.comment-item') && !event.target.closest('.highlight-item')) {
        setSelectedCommentId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const renderDocumentWithHighlights = () => {
    if (comments.length === 0) {
      return documentContent;
    }

    // Sort comments by position and resolve overlaps
    const sortedComments = [...comments]
      .sort((a, b) => a.textPosition - b.textPosition)
      .filter((comment, index, arr) => {
        // Remove overlapping comments (keep the first one)
        if (index === 0) return true;
        const prev = arr[index - 1];
        return comment.textPosition >= prev.textPosition + prev.textLength;
      });
    
    let result = [];
    let lastIndex = 0;

    sortedComments.forEach((comment, index) => {
      // Add text before this comment
      if (comment.textPosition > lastIndex) {
        result.push(
          <span key={`text-${index}`}>
            {documentContent.substring(lastIndex, comment.textPosition)}
          </span>
        );
      }

      // Add highlighted text for this comment
      const isSelected = selectedCommentId === comment.id;
      const highlightStyle = isSelected 
        ? {
            backgroundColor: 'var(--gb-yellow)',
            border: '2px solid var(--gb-black)',
            boxShadow: '2px 2px 0px var(--gb-darker-beige)'
          }
        : {
            backgroundColor: 'var(--gb-light-beige)',
            border: '2px solid var(--gb-darker-beige)'
          };
      
      const endPosition = Math.min(comment.textPosition + comment.textLength, documentContent.length);
      
      result.push(
        <span
          key={`highlight-${comment.id}`}
          id={`highlight-${comment.id}`}
          className="highlight-item cursor-pointer transition-all duration-200 hover:scale-105"
          style={{
            ...highlightStyle,
            padding: 'var(--spacing-xs)',
            borderRadius: 'var(--spacing-xs)',
            fontFamily: "var(--font-mono)"
          }}
          title={`${comment.author}: ${comment.text}`}
          onClick={() => handleHighlightClick(comment.id)}
        >
          {documentContent.substring(comment.textPosition, endPosition)}
        </span>
      );

      lastIndex = endPosition;
    });

    // Add remaining text
    if (lastIndex < documentContent.length) {
      result.push(
        <span key="remaining-text">
          {documentContent.substring(lastIndex)}
        </span>
      );
    }

    return result;
  };

  return (
    <div className="flex h-full relative">
      {/* Document Editor */}
      <div className="flex-1 flex flex-col" style={{ backgroundColor: 'var(--gb-cream)' }}>
        <div className="pokemon-panel--header flex-shrink-0" style={{
          backgroundColor: 'var(--gb-dark-beige)',
          padding: 'var(--spacing-lg) var(--spacing-xl)',
          borderBottom: '2px solid var(--gb-black)'
        }}>
          <div className="flex items-center justify-between">
            <div className="pokemon-textbox" style={{
              backgroundColor: 'var(--gb-yellow)',
              padding: 'var(--spacing-sm) var(--spacing-lg)',
              borderLeft: '4px solid var(--gb-black)'
            }}>
              <h2 className="font-bold flex items-center gap-3 text-primary" style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 'var(--pixel-lg)',
                margin: 0
              }}>
                📄 <span className="hidden sm:inline">USER DASHBOARD ENHANCEMENT</span>
                <span className="sm:hidden">PRD</span>
              </h2>
            </div>
            <div className="flex gap-3">
              <button
                onClick={generateComments}
                disabled={isGeneratingComments || !documentContent.trim()}
                className={`pokemon-button transition-all ${
                  isGeneratingComments || !documentContent.trim()
                    ? ''
                    : 'pokemon-button--primary hover:scale-105'
                }`}
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 'var(--pixel-xs)',
                  backgroundColor: isGeneratingComments || !documentContent.trim() 
                    ? 'var(--gb-darker-beige)' 
                    : 'var(--gb-blue)',
                  color: 'var(--gb-white)'
                }}
              >
                {isGeneratingComments ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 mr-2" style={{
                      borderColor: 'var(--gb-white)'
                    }}></div>
                    REVIEWING...
                  </>
                ) : (
                  '📝 GET FEEDBACK'
                )}
              </button>
              {comments.length > 0 && (
                <button
                  onClick={clearComments}
                  className="pokemon-button--danger"
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 'var(--pixel-xs)'
                  }}
                >
                  CLEAR
                </button>
              )}
            </div>
          </div>
          {comments.length > 0 && (
            <div className="pokemon-textbox" style={{
              marginTop: 'var(--spacing-md)',
              backgroundColor: 'var(--gb-white)'
            }}>
              <div className="flex items-center justify-between">
                <span className="text-primary" style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 'var(--pixel-sm)'
                }}>
                  📝 REVIEW MODE - CLICK HIGHLIGHTS OR COMMENTS
                </span>
                <button
                  onClick={clearComments}
                  className="pokemon-button"
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 'var(--pixel-xs)',
                    padding: 'var(--spacing-xs) var(--spacing-sm)'
                  }}
                >
                  ✏️ EDIT
                </button>
              </div>
            </div>
          )}
          <div className="flex gap-2 flex-wrap" style={{ marginTop: 'var(--spacing-md)' }}>
            <span className="pokemon-textbox" style={{
              padding: 'var(--spacing-xs) var(--spacing-sm)',
              backgroundColor: 'var(--gb-yellow)',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'var(--pixel-xs)',
              color: 'var(--gb-dark-text)'
            }}>
              ✨ DRAFT
            </span>
            {comments.length > 0 && (
              <span className="pokemon-textbox" style={{
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                backgroundColor: 'var(--gb-blue)',
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 'var(--pixel-xs)',
                color: 'var(--gb-white)'
              }}>
                💬 {comments.length} COMMENTS
              </span>
            )}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto" ref={documentContainerRef} style={{
          padding: 'var(--spacing-xl)'
        }}>
          <div className="pokemon-panel--content h-full" style={{
            backgroundColor: 'var(--gb-white)',
            padding: 'var(--spacing-xl)'
          }}>
            {comments.length > 0 ? (
              <div className="w-full h-full overflow-y-auto">
                <div className="prose max-w-none whitespace-pre-wrap" style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 'var(--text-base)',
                  lineHeight: '1.6',
                  color: 'var(--gb-dark-text)'
                }}>
                  {renderDocumentWithHighlights()}
                </div>
              </div>
            ) : (
              <textarea
                value={documentContent}
                onChange={(e) => setDocumentContent(e.target.value)}
                className="w-full h-full pokemon-textbox resize-none"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 'var(--text-base)',
                  backgroundColor: 'var(--gb-white)',
                  color: 'var(--gb-dark-text)',
                  padding: 'var(--spacing-lg)'
                }}
                placeholder="START WRITING YOUR PRD..."
              />
            )}
          </div>
        </div>
      </div>

      {/* Comments Sidebar */}
      <div className="w-80 pokemon-panel--content overflow-y-auto flex flex-col" style={{
        backgroundColor: 'var(--gb-medium-beige)'
      }}>
        <div className="pokemon-panel--header flex-shrink-0" style={{
          backgroundColor: 'var(--gb-dark-beige)',
          padding: 'var(--spacing-lg) var(--spacing-xl)'
        }}>
          <h3 className="font-bold text-primary" style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'var(--pixel-lg)'
          }}>💬 COMMENTS</h3>
        </div>
        <div className="flex-1" ref={commentsContainerRef} style={{
          padding: 'var(--spacing-lg)'
        }}>
          {comments.length === 0 ? (
            <div className="pokemon-textbox text-center" style={{
              backgroundColor: 'var(--gb-white)'
            }}>
              <h4 className="font-bold mb-3 text-primary" style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 'var(--pixel-sm)'
              }}>🎯 READY FOR REVIEW</h4>
              <p className="text-secondary" style={{
                fontFamily: "var(--font-mono)",
                fontSize: 'var(--text-sm)',
                lineHeight: '1.6'
              }}>
                WRITE YOUR PRD AND CLICK "GET FEEDBACK" TO RECEIVE AI COMMENTS.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map(comment => {
                const isSelected = selectedCommentId === comment.id;
                return (
                  <div 
                    key={comment.id}
                    id={`comment-${comment.id}`}
                    className="comment-item cursor-pointer pokemon-textbox transition-all duration-200 hover:scale-102"
                    style={{
                      backgroundColor: isSelected ? 'var(--gb-yellow)' : 'var(--gb-white)',
                      boxShadow: isSelected 
                        ? '2px 2px 0px var(--gb-darker-beige)' 
                        : '1px 1px 0px var(--gb-darker-beige)',
                      transform: isSelected ? 'translate(-1px, -1px)' : 'none'
                    }}
                    onClick={() => handleCommentClick(comment.id)}
                  >
                    <div className="flex items-center gap-2" style={{
                      marginBottom: 'var(--spacing-sm)'
                    }}>
                      {comment.avatar && (
                        <span className="text-lg flex-shrink-0">{comment.avatar}</span>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold truncate text-primary" style={{
                            fontFamily: "'Press Start 2P', monospace",
                            fontSize: 'var(--pixel-sm)'
                          }}>{comment.author.toUpperCase()}</span>
                          {comment.perspective && (
                            <span className="pokemon-textbox" style={{
                              padding: '2px 4px',
                              backgroundColor: 'var(--gb-blue)',
                              color: 'var(--gb-white)',
                              fontFamily: "'Press Start 2P', monospace",
                              fontSize: 'var(--pixel-xs)'
                            }}>
                              {comment.perspective.toUpperCase()}
                            </span>
                          )}
                          {isSelected && (
                            <span className="pokemon-textbox" style={{
                              padding: '2px 4px',
                              backgroundColor: 'var(--gb-red)',
                              color: 'var(--gb-white)',
                              fontFamily: "'Press Start 2P', monospace",
                              fontSize: 'var(--pixel-xs)'
                            }}>
                              ✨ ACTIVE
                            </span>
                          )}
                        </div>
                        <span className="text-muted" style={{
                          fontFamily: "'Press Start 2P', monospace",
                          fontSize: 'var(--pixel-xs)'
                        }}>JUST NOW</span>
                      </div>
                    </div>
                    
                    {comment.textExcerpt && (
                      <div className="pokemon-textbox" style={{
                        marginBottom: 'var(--spacing-sm)',
                        padding: 'var(--spacing-sm)',
                        backgroundColor: isSelected ? 'var(--gb-white)' : 'var(--gb-light-beige)',
                        borderLeft: '4px solid var(--gb-darker-beige)'
                      }}>
                        <span className="text-secondary" style={{
                          fontFamily: "'Press Start 2P', monospace",
                          fontSize: 'var(--pixel-xs)'
                        }}>RE: </span>
                        <span className="text-primary" style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 'var(--text-xs)',
                          fontStyle: 'italic'
                        }}>"{comment.textExcerpt.length > 40 ? comment.textExcerpt.substring(0, 40) + '...' : comment.textExcerpt}"</span>
                      </div>
                    )}
                    
                    <p className="text-primary" style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 'var(--text-sm)',
                      lineHeight: '1.6',
                      marginBottom: 'var(--spacing-sm)'
                    }}>{comment.text}</p>
                    
                    <div className="flex gap-2">
                      <button className="pokemon-button" style={{
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: 'var(--pixel-xs)',
                        backgroundColor: 'var(--gb-yellow)',
                        color: 'var(--gb-dark-text)',
                        padding: 'var(--spacing-xs) var(--spacing-sm)'
                      }}>
                        ✓ RESOLVE
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          generateComments();
                        }}
                        className="pokemon-button" style={{
                          fontFamily: "'Press Start 2P', monospace",
                          fontSize: 'var(--pixel-xs)',
                          backgroundColor: 'var(--gb-blue)',
                          color: 'var(--gb-white)',
                          padding: 'var(--spacing-xs) var(--spacing-sm)'
                        }}
                      >
                        🔄 MORE
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 