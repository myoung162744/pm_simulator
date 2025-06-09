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
  const editorRef = useRef(null);
  const commentsContainerRef = useRef(null);

  // Add CSS for placeholder styling
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      [contenteditable][data-placeholder]:empty::before {
        content: attr(data-placeholder);
        color: var(--gb-text-medium);
        pointer-events: none;
        position: absolute;
      }
      [contenteditable] {
        outline: none !important;
      }
      [contenteditable]:focus {
        outline: none !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleHighlightClick = (commentId) => {
    setSelectedCommentId(commentId);
    
    setTimeout(() => {
      const commentElement = document.getElementById(`comment-${commentId}`);
      if (commentElement && commentsContainerRef.current) {
        const container = commentsContainerRef.current;
        const elementTop = commentElement.offsetTop;
        const elementHeight = commentElement.offsetHeight;
        const containerHeight = container.clientHeight;
        const scrollTop = elementTop - (containerHeight / 2) + (elementHeight / 2);
        
        container.scrollTo({
          top: Math.max(0, scrollTop),
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const handleCommentClick = (commentId) => {
    setSelectedCommentId(selectedCommentId === commentId ? null : commentId);
  };

  // Handle text changes in the contentEditable div
  const handleContentChange = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerText || editorRef.current.textContent || '';
      if (newContent !== documentContent) {
        setDocumentContent(newContent);
      }
    }
  };

  // Update the editor content when documentContent changes from outside
  useEffect(() => {
    if (editorRef.current && comments.length === 0) {
      const currentContent = editorRef.current.innerText || editorRef.current.textContent || '';
      if (currentContent !== documentContent) {
        editorRef.current.textContent = documentContent;
      }
    }
  }, [documentContent, comments.length]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.comment-item') && !event.target.closest('.highlight')) {
        setSelectedCommentId(null);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const renderEditableContentWithHighlights = () => {
    if (!documentContent || comments.length === 0) {
      return (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleContentChange}
          onBlur={handleContentChange}
          className="w-full h-full outline-none"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 'var(--text-base)',
            lineHeight: '1.6',
            color: 'var(--gb-dark-text)',
            padding: 'var(--spacing-lg)',
            minHeight: '100%',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            border: 'none',
            background: 'transparent'
          }}
          data-placeholder="START WRITING YOUR PRD..."
          suppressContentEditableWarning={true}
        >
          {documentContent}
        </div>
      );
    }

    // When we have comments, we need to be more careful about rendering
    // to allow inline editing while preserving highlights
    const sortedComments = [...comments].sort((a, b) => a.textPosition - b.textPosition);
    
    let lastIndex = 0;
    const parts = [];
    
    sortedComments.forEach((comment, index) => {
      const { textPosition, textLength, id } = comment;
      const isSelected = selectedCommentId === id;
      
      // Add text before highlight
      if (textPosition > lastIndex) {
        const textBefore = documentContent.slice(lastIndex, textPosition);
        if (textBefore) {
          parts.push({
            type: 'text',
            content: textBefore,
            key: `text-${lastIndex}`
          });
        }
      }
      
      // Add highlighted text
      const highlightedText = documentContent.slice(textPosition, textPosition + textLength);
      if (highlightedText) {
        parts.push({
          type: 'highlight',
          content: highlightedText,
          commentId: id,
          isSelected,
          comment,
          key: `highlight-${id}`
        });
      }
      
      lastIndex = Math.max(lastIndex, textPosition + textLength);
    });
    
    // Add remaining text
    if (lastIndex < documentContent.length) {
      const remainingText = documentContent.slice(lastIndex);
      if (remainingText) {
        parts.push({
          type: 'text',
          content: remainingText,
          key: `text-${lastIndex}`
        });
      }
    }

    return (
      <div
        ref={editorRef}
        contentEditable
        onInput={handleContentChange}
        onBlur={handleContentChange}
        className="w-full h-full outline-none"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 'var(--text-base)',
          lineHeight: '1.6',
          color: 'var(--gb-dark-text)',
          padding: 'var(--spacing-lg)',
          minHeight: '100%',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          border: 'none',
          background: 'transparent'
        }}
        suppressContentEditableWarning={true}
        dangerouslySetInnerHTML={{
          __html: parts.map(part => {
            if (part.type === 'text') {
              return part.content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
            } else {
              const escapedContent = part.content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
              return `<span 
                class="highlight cursor-pointer transition-all duration-200" 
                data-comment-id="${part.commentId}"
                style="
                  background-color: ${part.isSelected ? 'var(--gb-yellow)' : 'var(--gb-light-beige)'};
                  padding: 2px 4px;
                  border-radius: 2px;
                  border: ${part.isSelected ? '2px solid var(--gb-darker-beige)' : '1px solid var(--gb-darker-beige)'};
                  margin: 0 1px;
                  box-shadow: ${part.isSelected ? '2px 2px 0px var(--gb-darker-beige)' : 'none'};
                  transform: ${part.isSelected ? 'translate(-1px, -1px)' : 'none'};
                "
                title="${part.comment.author}: ${part.comment.text.replace(/"/g, '&quot;')}"
              >${escapedContent}</span>`;
            }
          }).join('')
        }}
      />
    );
  };

  // Handle clicks on highlights within the contentEditable div
  useEffect(() => {
    const handleHighlightClickInEditor = (event) => {
      const highlightElement = event.target.closest('.highlight');
      if (highlightElement) {
        const commentId = highlightElement.getAttribute('data-comment-id');
        if (commentId) {
          event.stopPropagation();
          handleHighlightClick(commentId);
        }
      }
    };

    if (editorRef.current) {
      editorRef.current.addEventListener('click', handleHighlightClickInEditor);
      return () => {
        if (editorRef.current) {
          editorRef.current.removeEventListener('click', handleHighlightClickInEditor);
        }
      };
    }
  }, []);

  return (
    <div className="h-full flex">
      {/* Document Editor */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="pokemon-panel--header flex-shrink-0" style={{
          backgroundColor: 'var(--gb-dark-beige)',
          padding: 'var(--spacing-md) var(--spacing-lg)'
        }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="font-bold" style={{
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
              <div className="flex items-center justify-center">
                <span className="text-primary" style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 'var(--pixel-sm)'
                }}>
                  ✏️ EDIT MODE - CLICK HIGHLIGHTS TO VIEW COMMENTS
                </span>
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
        
        <div className="flex-1 overflow-y-auto" style={{
          padding: 'var(--spacing-xl)'
        }}>
          <div className="pokemon-panel--content h-full" style={{
            backgroundColor: 'var(--gb-white)',
            padding: 0,
            overflow: 'hidden'
          }}>
            {renderEditableContentWithHighlights()}
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