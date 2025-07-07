import React, { useState, useMemo, useCallback } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { FileText } from 'lucide-react';

// Helper function to serialize Slate value to plain text
const serialize = nodes => {
  return nodes.map(n => n.children.map(c => c.text).join('')).join('\n');
};

// Helper function to deserialize plain text to Slate value
const deserialize = text => {
  return text.split('\n').map(line => {
    return {
      type: 'paragraph',
      children: [{ text: line }],
    };
  });
};

// Helper to update comments based on a Slate operation (mutates in place)
// TODO: Handle when a comment is split to cross multiple lines.
// Yes this is a brute force AF, but we can fix that later.
function updateCommentsForOperation(comments, op) {
  if (
    op.type === 'split_node' &&
    op.path.length === 2 // Generally 2 duplicate node operations are emitted for operation. Only use 1.
  ) {
    comments.forEach(comment => {
      if (comment.lineOffset === op.path[0] && comment.charRange[0] >= op.position) {
        comment.lineOffset += 1;
      } else if (comment.lineOffset > op.path[0]) {
        comment.lineOffset += 1;
      }
    });
  } else if (
    op.type === 'insert_node' &&
    op.path.length === 1
  ) {
    comments.forEach(comment => {
      if (comment.lineOffset >= op.path[0]) {
        comment.lineOffset += 1;
      }
    });
  } else if (
    (op.type === 'merge_node' || op.type === 'remove_node') &&
    op.path.length === 1
  ) {
    comments.forEach(comment => {
      if (comment.lineOffset >= op.path[0]) {
        comment.lineOffset -= 1;
      }
    });
  } else if (
    op.type === 'insert_text' &&
    op.path.length === 2
  ) {
    comments.forEach(comment => {
      if (comment.lineOffset === op.path[0]) {
        if (comment.charRange[0] >= op.offset) {
          comment.charRange[0] += 1;
        }
        if (comment.charRange[1] > op.offset) {
          comment.charRange[1] += 1;
        }
      }
    });
  } else if (
    op.type === 'remove_text' &&
    op.path.length === 2
  ) {
    comments.forEach(comment => {
      if (comment.lineOffset === op.path[0]) {
        if (comment.charRange[0] > op.offset) {
          comment.charRange[0] -= op.text.length;
        }
        if (comment.charRange[1] > op.offset) {
          comment.charRange[1] -= op.text.length;
        } 
      }
    });
  } 
}

export const DocumentInterface = ({ 
  documentContent, 
  setDocumentContent, 
  comments,
  generateComments,
  isGeneratingComments,
  clearComments,
  phase,
  setComments
}) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  
  const initialValue = useMemo(() => deserialize(documentContent || ''), []);
  const [value, setValue] = useState(initialValue);
  const [selectedCommentId, setSelectedCommentId] = useState(null);

  const handleChange = (newValue) => {
    for (const op of editor.operations) {
      updateCommentsForOperation(comments, op); // Mutate comments directly
    }

    setValue(newValue);
    
    // Check if content has actually changed before updating parent state
    const newContent = serialize(newValue);
    if (newContent !== documentContent) {
      setDocumentContent(newContent);
    }
  };

  const decorate = useCallback(([node, path]) => {
    const ranges = [];
    if (!node.text || comments.length === 0) {
        return ranges;
    }

    comments.forEach(comment => {
        if (comment.lineOffset === path[0]) {
            const [start, end] = comment.charRange || [];
            if (start !== undefined && end !== undefined && start < end && end <= node.text.length) {
              const isSelected = selectedCommentId === comment.id;
              const commentMetadata = {
                anchor: { path, offset: start },
                focus: { path, offset: end },
                highlight: true,
                isSelected: isSelected,
                commentId: comment.id
              }
              if (isSelected) {
                // Add selected comment to the end of the ranges array so that it is rendered on top
                ranges.push(commentMetadata);
              } else {
                ranges.unshift(commentMetadata);
              }
            }
        }
    });

    return ranges;
  }, [comments, selectedCommentId]);

  const renderLeaf = useCallback(({ attributes, children, leaf }) => {
    if (leaf.highlight) {
      const style = leaf.isSelected
        ? {
            backgroundColor: 'var(--gb-yellow)',
            border: '2px solid var(--gb-darker-beige)',
            borderRadius: '4px',
            boxShadow: '2px 2px 0px var(--gb-darker-beige)',
            padding: '2px 4px',
            margin: '0 1px',
            position: 'relative',
            zIndex: 2,
          }
        : {
            backgroundColor: 'var(--gb-light-beige)',
            border: '1px solid var(--gb-darker-beige)',
            borderRadius: '3px',
            boxShadow: '1px 1px 0px var(--gb-darker-beige)',
            padding: '2px 4px',
            margin: '0 1px',
            position: 'relative',
            zIndex: 1,
          };
      return <span {...attributes} style={style}>{children}</span>;
    }
    return <span {...attributes}>{children}</span>;
  }, []);

  // Remove a comment by id
  const handleResolveComment = (id) => {
    setComments(comments => comments.filter(comment => comment.id !== id));
    if (selectedCommentId === id) setSelectedCommentId(null);
  };

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
                  `📝 ${phase?.id === 'FINALIZATION' ? 'SUBMIT' : 'GET FEEDBACK'}`
                )}
              </button>
              {comments.length > 0 && (
                <button
                  onClick={clearComments}
                  className="pokemon-button pokemon-button--danger"
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 'var(--pixel-xs)'
                  }}
                >
                  🗑️ CLEAR
                </button>
              )}
            </div>
          </div>
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
            padding: 'var(--spacing-lg)',
            overflow: 'auto',
            position: 'relative'
          }}>
            {isGeneratingComments && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(255, 255, 224, 0.85)',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'auto',
                borderRadius: '8px',
              }}>
                <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-yellow-500 mb-4" style={{ borderColor: 'var(--gb-yellow)' }}></div>
                <div style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 'var(--pixel-md)',
                  color: 'var(--gb-dark-text)',
                  textAlign: 'center',
                  textShadow: '1px 1px 0 var(--gb-yellow)'
                }}>
                  Waiting on peer feedback...
                </div>
              </div>
            )}
            <Slate editor={editor} initialValue={value} onChange={handleChange}>
              <Editable 
                placeholder="Start writing your PRD..."
                className="w-full h-full outline-none"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 'var(--text-base)',
                  lineHeight: '1.6',
                  color: 'var(--gb-dark-text)',
                  minHeight: '100%',
                }}
                decorate={decorate}
                renderLeaf={renderLeaf}
                readOnly={isGeneratingComments}
              />
            </Slate>
          </div>
        </div>
      </div>

      {/* Comments Sidebar */}
      <div className="w-80 overflow-y-auto flex flex-col" style={{
        backgroundColor: 'var(--gb-cream)',
        borderLeft: '2px solid var(--gb-black)'
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
        <div className="flex-1" style={{
          padding: 'var(--spacing-lg)',
          backgroundColor: 'var(--gb-medium-beige)'
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
                WRITE YOUR PRD AND CLICK "{phase?.id === 'FINALIZATION' ? 'SUBMIT' : 'GET FEEDBACK'}" TO RECEIVE AI COMMENTS.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map(comment => {
                return (
                  <div 
                    key={comment.id}
                    id={`comment-${comment.id}`}
                    className="comment-item cursor-pointer pokemon-textbox transition-all duration-200 hover:scale-102"
                    style={{
                      backgroundColor: 'var(--gb-white)',
                      boxShadow: '1px 1px 0px var(--gb-darker-beige)',
                      border: selectedCommentId === comment.id ? '2px solid #3399ff' : undefined,
                    }}
                    onClick={() => setSelectedCommentId(comment.id)}
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
                        </div>
                        <span className="text-muted" style={{
                          fontFamily: "'Press Start 2P', monospace",
                          fontSize: 'var(--pixel-xs)'
                        }}>{comment.timestamp || 'JUST NOW'}</span>
                      </div>
                    </div>
                    {/* DEBUG INFO - REMOVE BEFORE PRODUCTION */}
                    {/* {comment.lineOffset !== undefined && comment.charRange !== undefined && (
                      <div style={{
                        background: '#ffeeba',
                        color: '#b94a48',
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        padding: '4px 8px',
                        marginBottom: '8px',
                        border: '1px dashed #b94a48',
                      }}>
                        <strong>DEBUG:</strong> lineOffset: {comment.lineOffset}, charRange: [{comment.charRange[0]}, {comment.charRange[1]}]
                      </div>
                    )} */}
                    {/* END DEBUG INFO */}
                    {comment.textExcerpt && (
                      <div className="pokemon-textbox" style={{
                        marginBottom: 'var(--spacing-sm)',
                        padding: 'var(--spacing-sm)',
                        backgroundColor: 'var(--gb-light-beige)',
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
                      <button 
                        className="pokemon-button"
                        style={{
                          fontFamily: "'Press Start 2P', monospace",
                          fontSize: 'var(--pixel-xs)',
                          backgroundColor: 'var(--gb-yellow)',
                          color: 'var(--gb-dark-text)',
                          padding: 'var(--spacing-xs) var(--spacing-sm)'
                        }}
                        onClick={e => {
                          e.stopPropagation();
                          handleResolveComment(comment.id);
                        }}
                      >
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