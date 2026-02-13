import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, HardDrive, Cpu } from "lucide-react";

export default function Status() {
  const [storageStatus, setStorageStatus] = useState("checking");
  const [llmStatus, setLlmStatus] = useState("checking");

  useEffect(() => {
    // Check Storage
    try {
      localStorage.setItem("test", "test");
      localStorage.removeItem("test");
      setStorageStatus("active");
    } catch (e) {
      setStorageStatus("error");
    }

    // Check LLM
    const key = localStorage.getItem("llm_api_key");
    if (key) {
      setLlmStatus("configured");
    } else {
      setLlmStatus("mock");
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">System Status</h2>

      <div className="grid gap-6">
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <HardDrive size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Local Storage</h3>
              <p className="text-sm text-gray-500">
                Used for history and settings
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {storageStatus === "active" ? (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                <CheckCircle size={16} /> Active
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                <AlertCircle size={16} /> Error
              </span>
            )}
          </div>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <Cpu size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">LLM Connection</h3>
              <p className="text-sm text-gray-500">
                OpenAI / Gemini Integration
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {llmStatus === "configured" ? (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                <CheckCircle size={16} /> Configured
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                <AlertCircle size={16} /> Mock Mode
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
