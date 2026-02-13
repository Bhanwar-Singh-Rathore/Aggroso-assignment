import { useState } from "react";
import { Sparkles, FileText, Mic, Image, Quote } from "lucide-react";

export default function TranscriptInput({ onSubmit, isProcessing }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text);
  };

  return (
    <div className="card-base overflow-hidden animate-fade-in">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-1">
          <button className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
            <Mic size={18} />
          </button>
          <div className="w-px h-4 bg-gray-300 mx-2" />
          <button className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
            <FileText size={18} />
          </button>
          <button className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
            <Image size={18} />
          </button>
          <button className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
            <Quote size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
          {text.length} chars
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-0">
        <textarea
          id="transcript"
          rows={12}
          className="w-full p-6 text-gray-800 placeholder-gray-400 focus:outline-none resize-y text-base leading-relaxed bg-white"
          placeholder="Start typing your meeting notes here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isProcessing}
        />

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={!text.trim() || isProcessing}
            className={`
                        flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all
                        ${
                          !text.trim() || isProcessing
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-purple-600 text-white hover:bg-purple-700 shadow-sm hover:shadow-purple-200 active:scale-95"
                        }
                    `}
          >
            {isProcessing ? (
              <>
                <span className="animate-spin">⟳</span> Analyzing...
              </>
            ) : (
              <>
                <Sparkles size={16} /> Generate Summary
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
