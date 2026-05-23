"use client";

import { useState } from "react";
import { Log } from "@/lib/types";
import { createLog, updateLog, deleteLog } from "@/app/actions";
import { ToastType } from "@/lib/types";

interface LogFormProps {
  selectedLog: Log | null;
  onClear: () => void;
  detailLog: Log | null;
  onDetailClear: () => void;
  handleToast: (msg: string, type: ToastType, title?: string) => void;
}

export default function LogForm({ selectedLog, onClear, detailLog, onDetailClear, handleToast }: LogFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { handleToast("Please fill in the title", "error", "Validation"); return; }
    if (!content.trim()) { handleToast("Please fill in the content", "error", "Validation"); return; }
    if (title.length > 50) { handleToast("Title must be under 50 characters", "error", "Validation"); return; }
    if (content.length > 800) { handleToast("Content must be under 800 characters", "error", "Validation"); return; }
    await createLog(title, content);
    setTitle("");
    setContent("");
    handleToast("Log created successfully", "success", "Log created");
  }

  function handleEditClick() {
    if (!detailLog) return;
    setEditTitle(detailLog.title);
    setEditContent(detailLog.content);
    setIsEditing(true);
  }

  async function handleSave() {
    if (!detailLog) return;
    await updateLog(detailLog.id, editTitle, editContent);
    setIsEditing(false);
    onDetailClear();
    onClear();
    handleToast("Log updated successfully", "success", "Log updated");
  }

  async function handleDelete() {
    if (!detailLog) return;
    await deleteLog(detailLog.id);
    onDetailClear();
    onClear();
    handleToast("Log deleted successfully", "success", "Log deleted");
  }

  function handleCancelEdit() {
    setIsEditing(false);
    handleToast("Edit cancelled", "warn", "Cancelled");
  }

  return (
    <form id="mainForm" onSubmit={handleCreate} className="form-wrapper flex flex-col lg:flex-row gap-4 mb-8">

      {/* Left col — create form + session preview */}
      <div className="w-full lg:w-2/3 lg:self-start flex flex-col gap-4">
        <div className="form-entry-panel">
          <div className="panel-header">// New Entry</div>
          <div className="form-entry-body">
            <input
              id="mainTitle"
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="panel-field p-2 rounded h-12 w-full"
            />
            <textarea
              id="mainContent"
              placeholder="What did you work on?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="panel-field p-2 rounded w-full"
            />
            <button type="submit" id="addLogBtn">
              Add Log
            </button>
          </div>
        </div>

        {/* Session preview */}
        <div id="formFiller">
          <div className="panel-header">Session Preview</div>
          <div id="formFillerBody">
            {selectedLog ? (
              <div id="previewContent">
                <p className="preview-title font-bold">{selectedLog.title}</p>
                <p className="preview-body">{selectedLog.content}</p>
                <p className="preview-date">{new Date(selectedLog.createdAt).toLocaleDateString()}</p>
              </div>
            ) : (
              <p className="preview-empty">Track what you shipped, learned, and fixed today.</p>
            )}
          </div>
        </div>
      </div>

      {/* Right col — detail / inline edit / watermark */}
      <div className="w-full lg:w-2/3 flex flex-col mb-3" id="rightPanel">
        <div className="panel-header">Log Detail</div>
        <div id="detailPanel" className="flex-1 p-4 flex flex-col gap-3">
          {!detailLog && (
            <div id="idlePanel">
              <svg viewBox="0 0 100 100" fill="none" style={{ width: 120, height: 120, opacity: 0.6 }}>
                <polygon className="idle-hex-outer" points="50,6 90,28 90,72 50,94 10,72 10,28"
                  strokeWidth="2" />
                <polygon className="idle-hex-inner" points="50,18 78,33 78,67 50,82 22,67 22,33"
                  strokeWidth="1.5" fill="none" />
                <text className="idle-hex-text" x="50" y="62" textAnchor="middle"
                  fontSize="28" fontWeight="700" fontFamily="monospace">DL</text>
              </svg>
              <p id="idleWatermark">DEVFORGE</p>
              <p id="idleSubtitle">DEV LOGGER</p>
              <p id="idleHint">select a log to preview</p>
            </div>
          )}

          {detailLog && !isEditing && (
            <div key={detailLog.id} id="detailContent" className="flex flex-col gap-3 h-full">
              <h2 className="font-bold detail-title">{detailLog.title}</h2>
              <span className="detail-body">{detailLog.content}</span>
              <span className="detail-date">{new Date(detailLog.createdAt).toLocaleDateString()}</span>
            </div>
          )}

          {detailLog && isEditing && (
            <div key={`edit-${detailLog.id}`} id="detailContent" className="flex flex-col gap-3 h-full">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="panel-field p-2 rounded w-full"
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="panel-field p-2 rounded w-full flex-1"
              />
            </div>
          )}
        </div>

        {detailLog && !isEditing && (
          <div className="flex gap-2 mb-1 p-2">
            <button type="button" id="editBtn" className="update-btn flex-1 p-2" onClick={handleEditClick}>
              Edit
            </button>
            <button type="button" id="deleteBtn" className="delete-btn flex-1 p-2" onClick={handleDelete}>
              Delete
            </button>
            <button type="button" id="cancelBtn" onClick={onDetailClear}>
              Cancel
            </button>
          </div>
        )}

        {detailLog && isEditing && (
          <div className="flex gap-2 mb-1 p-2">
            <button type="button" className="update-btn flex-1 p-2" onClick={handleSave}>
              Save Changes
            </button>
            <button type="button" id="cancelBtn" onClick={handleCancelEdit}>
              Cancel
            </button>
          </div>
        )}
      </div>

    </form>
  );
}
