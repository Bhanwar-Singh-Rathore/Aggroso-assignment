import { Link } from "react-router-dom";
import { Plus, FileText, Clock } from "lucide-react";
import { getHistory } from "../services/storage";
import { useState, useEffect } from "react";

export default function Home() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const totalActions = history.reduce(
    (acc, note) => acc + (note.actionItems?.length || 0),
    0,
  );
  const pendingActions = history.reduce(
    (acc, note) => acc + (note.actionItems?.filter((i) => !i.done).length || 0),
    0,
  );

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back 👋</h1>
          <p className="text-gray-500 mt-1">
            Manage your meeting transcripts and action items.
          </p>
        </div>
        <Link to="/tracker" className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          New Meeting
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="card-base p-6 border-l-4 border-purple-500">
          <div className="text-gray-500 text-sm font-medium mb-1">
            Total Meetings
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {history.length}
          </div>
        </div>
        <div className="card-base p-6 border-l-4 border-orange-400">
          <div className="text-gray-500 text-sm font-medium mb-1">
            Action Items
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {pendingActions} Pending
          </div>
        </div>
        <div className="card-base p-6 border-l-4 border-blue-400">
          <div className="text-gray-500 text-sm font-medium mb-1">
            Total Tasks
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {totalActions} Extracted
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Recent Meetings</h2>
        <Link
          to="/tracker"
          className="text-sm font-medium text-purple-600 hover:text-purple-700"
        >
          New Note
        </Link>
      </div>

      <div className="space-y-4">
        {history.length === 0 ? (
          <div className="card-base p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <FileText size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No meetings tracked
            </h3>
            <p className="text-gray-500 mt-1 mb-6">
              Start by transcribing your first meeting.
            </p>
            <Link
              to="/tracker"
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus size={18} />
              Start Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((entry) => (
              <Link
                key={entry.id}
                to={`/meeting/${entry.id}`}
                className="card-base p-5 hover:shadow-md transition-shadow group relative block"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                    <FileText size={20} />
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">
                  {entry.title || "Untitled Meeting"}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-3 mb-4 h-10">
                  {entry.summary}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-400 pt-4 border-t border-gray-50">
                  <Clock size={12} />
                  <span>{new Date(entry.date).toLocaleDateString()}</span>
                  <span className="mx-1">•</span>
                  <span>{entry.actionItems?.length || 0} actions</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
