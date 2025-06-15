import React, { useState, useEffect } from 'react';
import { Inbox, FileText, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import { simulationDocuments } from '../simulationDocuments';

export const InboxInterface = ({ sharedDocuments }) => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [markdownContent, setMarkdownContent] = useState('');

  // Set the first document as selected when documents are loaded or changed
  useEffect(() => {
    if (sharedDocuments.length > 0 && !selectedDocument) {
      setSelectedDocument(sharedDocuments[0]);
    }
  }, [sharedDocuments, selectedDocument]);

  // Load document content when selectedDocument changes
  useEffect(() => {
    if (selectedDocument && selectedDocument.id) {
      // Find the document content in simulationDocuments
      const docContent = simulationDocuments[selectedDocument.id];
      if (docContent) {
        setMarkdownContent(docContent.content);
      } else {
        setMarkdownContent('Document content not found.');
      }
    } else {
      setMarkdownContent('');
    }
  }, [selectedDocument]);

  return (
    <div className="flex h-full relative">
      {/* Document List */}
      <div className="w-80 pokemon-panel--sidebar overflow-y-auto flex flex-col" style={{
        backgroundColor: 'var(--gb-medium-beige)'
      }}>
        <div className="pokemon-panel--header flex-shrink-0" style={{
          backgroundColor: 'var(--gb-dark-beige)',
          padding: 'var(--spacing-lg) var(--spacing-xl)'
        }}>
          <h3 className="font-bold text-primary flex items-center gap-3" style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'var(--pixel-lg)'
          }}>
            📮 SHARED DOCS
          </h3>
        </div>
        <div className="flex-1" style={{ padding: 'var(--spacing-md)' }}>
          {sharedDocuments.length === 0 ? (
            <div className="pokemon-textbox text-center" style={{
              backgroundColor: 'var(--gb-white)'
            }}>
              <p className="text-secondary" style={{
                fontFamily: "var(--font-mono)",
                fontSize: 'var(--text-sm)',
                lineHeight: '1.6'
              }}>
                NO DOCUMENTS HAVE BEEN SHARED WITH YOU YET. MAYBE YOUR TEAMMATES HAVE SOMETHING THEY CAN SEND YOU.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sharedDocuments.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDocument(doc)}
                  className={`w-full text-left pokemon-textbox transition-all duration-200 hover:scale-102 ${
                    selectedDocument && selectedDocument.id === doc.id ? 'shadow-lg' : 'shadow-md'
                  }`}
                  style={{
                    backgroundColor: selectedDocument && selectedDocument.id === doc.id 
                      ? 'var(--gb-yellow)' 
                      : 'var(--gb-white)',
                    boxShadow: selectedDocument && selectedDocument.id === doc.id 
                      ? '2px 2px 0px var(--gb-darker-beige)' 
                      : '1px 1px 0px var(--gb-darker-beige)',
                    transform: selectedDocument && selectedDocument.id === doc.id 
                      ? 'translate(-1px, -1px)' 
                      : 'none',
                    padding: 'var(--spacing-lg)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-xl">📄</div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold truncate text-primary" style={{
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: 'var(--pixel-sm)',
                        marginBottom: 'var(--spacing-xs)'
                      }}>
                        {doc.name.toUpperCase()}
                      </div>
                      <div className="text-xs truncate text-secondary" style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 'var(--text-xs)'
                      }}>
                        FROM: {doc.author.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Document Viewer */}
      <div className="flex-1 flex flex-col" style={{ backgroundColor: 'var(--gb-cream)' }}>
        {selectedDocument ? (
          <>
            <div className="pokemon-panel--header flex-shrink-0" style={{
              backgroundColor: 'var(--gb-dark-beige)',
              padding: 'var(--spacing-lg) var(--spacing-xl)'
            }}>
              <div className="flex items-center justify-between">
                <h2 className="font-bold flex items-center gap-3 text-primary" style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 'var(--pixel-lg)'
                }}>
                  📄 <span>{selectedDocument.name.toUpperCase()}</span>
                </h2>
                <div className="flex items-center gap-2">
                  <span className="pokemon-textbox" style={{
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    backgroundColor: 'var(--gb-blue)',
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 'var(--pixel-xs)',
                    color: 'var(--gb-white)'
                  }}>
                    SHARED BY: {selectedDocument.author.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto" style={{
              padding: 'var(--spacing-xl)'
            }}>
              <div className="pokemon-panel--content h-full overflow-y-auto" style={{
                backgroundColor: 'var(--gb-white)',
                padding: 'var(--spacing-xl)'
              }}>
                <div className="prose max-w-none markdown" style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 'var(--text-base)',
                  lineHeight: '1.6',
                  color: 'var(--gb-dark-text)'
                }}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeSlug]}
                  >
                    {markdownContent}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center" style={{
            padding: 'var(--spacing-xl)'
          }}>
            <div className="text-center pokemon-panel--content max-w-md" style={{
              backgroundColor: 'var(--gb-white)',
              padding: 'var(--spacing-3xl)'
            }}>
              <div className="text-6xl mb-4">📮</div>
              <h3 className="font-bold mb-4 text-primary" style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 'var(--pixel-xl)',
                marginBottom: 'var(--spacing-lg)'
              }}>YOUR DOCUMENT INBOX</h3>
              <p className="text-secondary" style={{
                fontFamily: "var(--font-mono)",
                fontSize: 'var(--text-sm)',
                lineHeight: '1.6'
              }}>
                SELECT A DOCUMENT FROM THE LIST TO VIEW ITS CONTENTS.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
