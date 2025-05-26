import React from 'react';
import { FileText } from 'lucide-react';

export const DocumentInterface = ({ 
  documentContent, 
  setDocumentContent, 
  comments,
  generateComments,
  isGeneratingComments,
  clearComments
}) => {
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
      const highlightColor = 'bg-purple-200 border-purple-400';
      
      const endPosition = Math.min(comment.textPosition + comment.textLength, documentContent.length);
      
      result.push(
        <span
          key={`highlight-${comment.id}`}
          className={`${highlightColor} border rounded px-1 cursor-pointer transition-all duration-200 hover:shadow-md hover:ring-2 hover:ring-purple-400`}
          title={`${comment.author}: ${comment.text}`}
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
      <div className="flex-1 bg-gradient-to-br from-yellow-50 to-orange-50 flex flex-col">
        <div className="p-3 md:p-4 border-b-4 border-orange-300 bg-gradient-to-r from-yellow-200 to-orange-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-base md:text-lg text-orange-800 flex items-center gap-2">
              <FileText size={16} className="md:w-5 md:h-5" />
              <span className="hidden sm:inline">Product Requirements Document</span>
              <span className="sm:hidden">PRD</span>
            </h2>
            <div className="flex gap-2">
              <button
                onClick={generateComments}
                disabled={isGeneratingComments || !documentContent.trim()}
                className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                  isGeneratingComments || !documentContent.trim()
                    ? 'bg-gray-200 border border-gray-400 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-200 hover:bg-blue-300 border border-blue-400 text-blue-800'
                }`}
              >
                {isGeneratingComments ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                    Reviewing...
                  </>
                ) : (
                  '📝 Get Feedback'
                )}
              </button>
              {comments.length > 0 && (
                <button
                  onClick={clearComments}
                  className="px-3 py-1 bg-red-200 border border-red-400 rounded-full text-xs font-bold text-red-800"
                >
                  Clear Comments
                </button>
              )}
            </div>
          </div>
          {comments.length > 0 && (
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-800">
                  📝 Review Mode - Hover over highlights to see comments
                </span>
                <button
                  onClick={clearComments}
                  className="text-xs bg-blue-200 hover:bg-blue-300 px-2 py-1 rounded border border-blue-400 text-blue-800"
                >
                  ✏️ Edit Document
                </button>
              </div>
            </div>
          )}
          <div className="flex gap-2 mt-2 flex-wrap">
            <span className="px-2 md:px-3 py-1 bg-green-200 border border-green-400 rounded-full text-xs font-bold text-green-800">
              ✨ Draft
            </span>
            {comments.length > 0 && (
              <span className="px-2 md:px-3 py-1 bg-purple-200 border border-purple-400 rounded-full text-xs font-bold text-purple-800">
                💬 {comments.length} Comments
              </span>
            )}
          </div>
        </div>
        
        <div className="flex-1 p-3 md:p-6 overflow-y-auto">
          <div className="bg-white rounded-lg border-4 border-orange-300 shadow-xl p-3 md:p-6 h-full">
            {comments.length > 0 ? (
              <div className="w-full h-full overflow-y-auto">
                <div className="prose max-w-none font-mono text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
                  {renderDocumentWithHighlights()}
                </div>
              </div>
            ) : (
              <textarea
                value={documentContent}
                onChange={(e) => setDocumentContent(e.target.value)}
                className="w-full h-full p-3 md:p-4 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none resize-none font-mono text-xs md:text-sm"
                placeholder="Start writing your PRD..."
              />
            )}
          </div>
        </div>
      </div>

      {/* Comments Sidebar - Simplified */}
      <div className="w-80 bg-gradient-to-b from-pink-100 to-purple-100 border-l-4 border-pink-400 overflow-y-auto flex flex-col">
        <div className="p-4 border-b-2 border-pink-300 bg-gradient-to-r from-pink-200 to-purple-200 flex-shrink-0">
          <h3 className="font-bold text-pink-800">Comments & Feedback</h3>
        </div>
        <div className="p-4 space-y-4 flex-1">
          {comments.length === 0 ? (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-2 border-blue-200 text-center">
              <h4 className="font-bold text-sm text-blue-800 mb-2">🎯 Ready for Review</h4>
              <p className="text-xs text-blue-600 mb-3">
                Write your PRD and click "Get Feedback" to receive AI comments.
              </p>
            </div>
          ) : (
            comments.map(comment => (
              <div 
                key={comment.id} 
                className="bg-white p-3 rounded-lg border-2 border-purple-300 shadow-md transition-all duration-200 hover:ring-2 hover:ring-purple-400 hover:shadow-lg"
              >
                <div className="flex items-center gap-2 mb-2">
                  {comment.avatar && (
                    <span className="text-lg flex-shrink-0">{comment.avatar}</span>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-pink-800 truncate">{comment.author}</span>
                      {comment.perspective && (
                        <span className="text-xs bg-blue-100 text-blue-600 px-1 py-0.5 rounded">
                          {comment.perspective}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">just now</span>
                  </div>
                </div>
                
                {comment.textExcerpt && (
                  <div className="mb-2 p-2 bg-gray-100 border-l-4 border-gray-400 text-xs">
                    <span className="text-gray-600 font-semibold">Re: </span>
                    <span className="text-gray-800 italic">"{comment.textExcerpt.length > 40 ? comment.textExcerpt.substring(0, 40) + '...' : comment.textExcerpt}"</span>
                  </div>
                )}
                
                <p className="text-sm text-gray-700">{comment.text}</p>
                <div className="flex gap-2 mt-2">
                  <button className="text-xs bg-green-200 hover:bg-green-300 px-2 py-1 rounded border border-green-400">
                    ✓ Resolve
                  </button>
                  <button 
                    onClick={generateComments}
                    className="text-xs bg-orange-200 hover:bg-orange-300 px-2 py-1 rounded border border-orange-400"
                  >
                    🔄 More Feedback
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}; 