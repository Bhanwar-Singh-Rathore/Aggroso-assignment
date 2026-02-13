import { useState } from "react";
import {
  Trash2,
  CheckSquare,
  Square,
  Edit2,
  Calendar,
  User,
} from "lucide-react";

export default function ActionItems({
  items,
  onUpdate,
  onDelete,
  onToggleDone,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  if (!items || items.length === 0) {
    return null;
  }

  const startEditing = (item) => {
    setEditingId(item.id);
    setEditText(item.task);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText("");
  };

  const saveEdit = (id) => {
    if (editText.trim()) {
      onUpdate({ ...items.find((i) => i.id === id), task: editText });
    }
    setEditingId(null);
    setEditText("");
  };

  const handleKeyDown = (e, id) => {
    if (e.key === "Enter") {
      saveEdit(id);
    } else if (e.key === "Escape") {
      cancelEditing();
    }
  };

  return (
    <div className="card-base p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Action Items</h3>
        <div className="flex gap-2">
          <span className="bg-purple-50 text-purple-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-purple-100">
            {items.filter((i) => !i.done).length} Open
          </span>
          <span className="bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-green-100">
            {items.filter((i) => i.done).length} Done
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={`group flex items-start gap-3 p-3 rounded-lg transition-colors border-b last:border-0 border-gray-50 ${item.done ? "bg-gray-50" : "hover:bg-gray-50"}`}
          >
            <button
              onClick={() => onToggleDone(item.id)}
              className={`mt-0.5 flex-shrink-0 transition-colors ${item.done ? "text-green-500" : "text-gray-300 hover:text-purple-500"}`}
            >
              {item.done ? <CheckSquare size={18} /> : <Square size={18} />}
            </button>

            <div className="flex-1 min-w-0">
              {editingId === item.id ? (
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, item.id)}
                    className="input-base text-sm"
                    autoFocus
                  />
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => saveEdit(item.id)}
                      className="text-xs font-medium text-green-600 hover:text-green-700 border border-green-200 px-2 py-1 rounded bg-green-50"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="text-xs font-medium text-gray-500 hover:text-gray-700 px-2 py-1"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p
                    className={`text-sm text-gray-700 font-medium leading-relaxed ${item.done ? "line-through text-gray-400" : ""}`}
                  >
                    {item.task}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 opacity-60 hover:opacity-100 transition-opacity">
                    {item.owner && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <User size={12} className="text-purple-400" />
                        <span>{item.owner}</span>
                      </div>
                    )}
                    {item.dueDate && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar size={12} className="text-orange-400" />
                        <span>{item.dueDate}</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => startEditing(item)}
                className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
