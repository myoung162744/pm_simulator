import React, { useState, useEffect } from 'react';
import { Inbox, FileText, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';

export const InboxInterface = ({ sharedDocuments }) => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [markdownContent, setMarkdownContent] = useState('');

  // Set the first document as selected when documents are loaded or changed
  useEffect(() => {
    if (sharedDocuments.length > 0 && !selectedDocument) {
      setSelectedDocument(sharedDocuments[0]);
    }
  }, [sharedDocuments, selectedDocument]);

  // Fetch markdown content when selectedDocument changes
  useEffect(() => {
    const fetchMarkdown = async () => {
      if (selectedDocument && selectedDocument.path) {
        try {
          const response = await fetch(selectedDocument.path);
          if (!response.ok) throw new Error('Failed to load document');
          const text = await response.text();
          setMarkdownContent(text);
        } catch (e) {
          setMarkdownContent('Error loading document.');
        }
      } else {
        setMarkdownContent('');
      }
    };
    fetchMarkdown();
  }, [selectedDocument]);

  return (
    <div className="flex h-full relative">
      {/* Document List */}
      <div className="w-64 bg-gradient-to-b from-blue-100 to-indigo-100 border-r-4 border-indigo-300 overflow-y-auto flex flex-col">
        <div className="p-4 border-b-2 border-indigo-300 bg-gradient-to-r from-blue-200 to-indigo-200 flex-shrink-0">
          <h3 className="font-bold text-indigo-800 flex items-center gap-2">
            <Inbox size={16} className="md:w-5 md:h-5" />
            Shared Documents
          </h3>
        </div>
        <div className="p-2 space-y-1 flex-1">
          {sharedDocuments.length === 0 ? (
            <div className="p-3 bg-white rounded-lg border border-indigo-200 text-center">
              <p className="text-xs text-indigo-600">
                No documents have been shared with you yet.
              </p>
            </div>
          ) : (
            sharedDocuments.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setSelectedDocument(doc)}
                className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-200 ${
                  selectedDocument && selectedDocument.id === doc.id
                    ? 'bg-indigo-100 border-indigo-400 shadow-md'
                    : 'bg-white border-indigo-200 hover:bg-indigo-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-indigo-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-xs text-indigo-800 truncate">
                      {doc.name}
                    </div>
                    <div className="text-xs text-indigo-600 truncate">
                      From: {doc.author}
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Document Viewer */}
      <div className="flex-1 bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col">
        {selectedDocument ? (
          <>
            <div className="p-3 md:p-4 border-b-4 border-indigo-300 bg-gradient-to-r from-indigo-200 to-purple-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-base md:text-lg text-indigo-800 flex items-center gap-2">
                  <FileText size={16} className="md:w-5 md:h-5" />
                  <span>{selectedDocument.name}</span>
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-indigo-700">
                    Shared by: {selectedDocument.author}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-1 p-3 md:p-6 overflow-y-auto">
              <div className="bg-white rounded-lg border-4 border-indigo-300 shadow-xl p-3 md:p-6 h-full overflow-y-auto">
                <div className="prose max-w-none markdown">
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
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-6 bg-white rounded-lg border-4 border-indigo-300 shadow-xl max-w-md">
              <Inbox size={48} className="mx-auto text-indigo-400 mb-4" />
              <h3 className="font-bold text-lg text-indigo-800 mb-2">Your Document Inbox</h3>
              <p className="text-indigo-600 mb-4">
                Select a document from the list to view its contents.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
