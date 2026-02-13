import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getMeetingById } from "../services/storage";
import ActionItems from "../components/ActionItems";
import { ChevronLeft, Calendar, User, FileText } from "lucide-react";

export default function MeetingDetail() {
  const { id } = useParams();
  const [meeting, setMeeting] = useState(null);

  useEffect(() => {
    const data = getMeetingById(id);
    setMeeting(data);
  }, [id]);

  if (!meeting) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-gray-900">Meeting not found</h2>
        <Link
          to="/"
          className="text-purple-600 hover:underline mt-4 inline-block"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20">
      <Link
        to="/"
        className="flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors mb-8 group w-fit"
      >
        <ChevronLeft
          size={18}
          className="group-hover:-translate-x-1 transition-transform"
        />
        <span className="text-sm font-medium">Back to Dashboard</span>
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {meeting.title}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full">
            <Calendar size={14} />
            {new Date(meeting.date).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full">
            <User size={14} />
            {meeting.participants?.length || 0} Participants
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card-base p-8">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
              <FileText className="text-purple-600" size={20} />
              <h2 className="text-lg font-bold text-gray-900">
                Meeting Summary
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Purpose
                </h3>
                <p className="text-gray-700 leading-relaxed font-medium">
                  {meeting.purpose}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Executive Summary
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {meeting.summary}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Key Topics
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {meeting.topics?.map((topic, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-gray-600 text-sm"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <ActionItems
            items={meeting.actionItems || []}
            onUpdate={() => {}}
            onDelete={() => {}}
            onToggleDone={() => {}}
          />
        </div>

        <div className="space-y-6">
          <div className="card-base p-6">
            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">
              Participants
            </h3>
            <div className="space-y-3">
              {meeting.participants?.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs">
                    {p.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
