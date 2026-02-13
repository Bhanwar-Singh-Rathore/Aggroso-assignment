import { useState, useEffect, useRef } from "react";
import TranscriptInput from "../components/TranscriptInput";
import ActionItems from "../components/ActionItems";
import { processTranscript, chatWithTranscript } from "../services/llm";
import { saveHistory } from "../services/storage";
import {
  FileText,
  List,
  MessageSquare,
  Plus,
  Send,
  User,
  Paperclip,
} from "lucide-react";

export default function Tracker() {
  const [meetingData, setMeetingData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("transcribe");
  const [rawTranscript, setRawTranscript] = useState("");

  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  const chatEndRef = useRef(null);

  const [participants, setParticipants] = useState([]);
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const handleTranscriptSubmit = async (transcript) => {
    setIsProcessing(true);
    setRawTranscript(transcript);
    try {
      const data = await processTranscript(transcript);
      setMeetingData(data);
      setParticipants(
        data.participants?.map((p) => ({ id: Math.random(), name: p })) || [],
      );
      saveHistory(data);
      setActiveTab("summary");
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatting) return;

    const userMessage = { role: "user", content: chatInput };
    setChatMessages([...chatMessages, userMessage]);
    setChatInput("");
    setIsChatting(true);

    try {
      const response = await chatWithTranscript(
        rawTranscript,
        chatMessages,
        chatInput,
      );
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
    } catch (error) {
      alert("Chat failed. Please try again.");
    } finally {
      setIsChatting(false);
    }
  };

  const handleToggleDone = (id) => {
    const updated = {
      ...meetingData,
      actionItems: meetingData.actionItems.map((i) =>
        i.id === id ? { ...i, done: !i.done } : i,
      ),
    };
    setMeetingData(updated);
  };

  const handleUpdateAction = (updatedItem) => {
    const updated = {
      ...meetingData,
      actionItems: meetingData.actionItems.map((i) =>
        i.id === updatedItem.id ? updatedItem : i,
      ),
    };
    setMeetingData(updated);
  };

  const handleDeleteAction = (id) => {
    const updated = {
      ...meetingData,
      actionItems: meetingData.actionItems.filter((i) => i.id !== id),
    };
    setMeetingData(updated);
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {meetingData?.title || "New Meeting Note"}
        </h1>
        {meetingData && (
          <p className="text-gray-500 mt-2 flex items-center gap-2">
            <User size={14} /> Shared by you •{" "}
            {new Date(meetingData.date).toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg w-fit mb-8">
        <button
          onClick={() => setActiveTab("transcribe")}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === "transcribe" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
        >
          <FileText size={16} /> Transcribe
        </button>
        <button
          onClick={() => setActiveTab("summary")}
          disabled={!meetingData}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${!meetingData ? "opacity-50 cursor-not-allowed" : activeTab === "summary" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
        >
          <List size={16} /> Summary
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          disabled={!meetingData}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${!meetingData ? "opacity-50 cursor-not-allowed" : activeTab === "chat" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
        >
          <MessageSquare size={16} /> AI Chat
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          {activeTab === "transcribe" && (
            <div className="animate-fade-in">
              <TranscriptInput
                onSubmit={handleTranscriptSubmit}
                isProcessing={isProcessing}
              />
            </div>
          )}

          {activeTab === "summary" && meetingData && (
            <div className="animate-fade-in space-y-6">
              <div className="card-base p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  # Meeting Overview
                </h2>
                <h3 className="font-bold text-gray-800 mb-2">Purpose</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {meetingData.purpose}
                </p>

                <h3 className="font-bold text-gray-800 mb-2">
                  • Executive Summary
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {meetingData.summary}
                </p>

                <h3 className="font-bold text-gray-800 mb-2">
                  • Key Topics Discussed:
                </h3>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  {meetingData.topics?.map((topic, i) => (
                    <li key={i}>{topic}</li>
                  ))}
                </ul>
              </div>

              <ActionItems
                items={meetingData.actionItems}
                onDelete={handleDeleteAction}
                onToggleDone={handleToggleDone}
                onUpdate={handleUpdateAction}
              />
            </div>
          )}

          {activeTab === "chat" && (
            <div className="animate-fade-in card-base flex flex-col h-[600px]">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatMessages.length === 0 && (
                  <div className="text-center py-10">
                    <div className="bg-purple-50 text-purple-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare size={24} />
                    </div>
                    <p className="text-gray-500">
                      Ask anything about this meeting
                    </p>
                  </div>
                )}
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${msg.role === "user" ? "bg-purple-600 text-white rounded-tr-none" : "bg-gray-100 text-gray-800 rounded-tl-none"}`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isChatting && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-4 rounded-2xl rounded-tl-none text-gray-500 animate-pulse">
                      Thinking...
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t bg-gray-50 flex gap-2"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type your question..."
                  className="flex-1 input-base"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || isChatting}
                  className="btn-primary p-2.5"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card-base p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">
              Participants
            </h3>
            <div className="space-y-3">
              {participants.map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs">
                    {p.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {p.name}
                  </span>
                </div>
              ))}
              <button
                onClick={() =>
                  setParticipants([
                    ...participants,
                    { id: Date.now(), name: "Guest User" },
                  ])
                }
                className="flex items-center gap-2 text-sm text-purple-600 font-medium mt-2 hover:underline"
              >
                <Plus size={14} /> Add Guest
              </button>
            </div>
          </div>

          <div className="card-base p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">
              Attachments
            </h3>
            <div className="space-y-2">
              {attachments.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <FileText size={16} className="text-red-500" />
                  <span className="text-sm text-gray-700 truncate">
                    {f.name}
                  </span>
                </div>
              ))}
              <button
                onClick={() =>
                  setAttachments([
                    ...attachments,
                    { id: Date.now(), name: "Meeting_Transcript.pdf" },
                  ])
                }
                className="flex items-center gap-2 text-sm text-purple-600 font-medium mt-2 hover:underline"
              >
                <Paperclip size={14} /> Attach File
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
