"use client";

import { useState } from "react";
import Image from "next/image";
import { Log } from "@/lib/types";
import { createLog, updateLog, deleteLog } from "@/app/actions";

interface LogFormProps {
  selectedLog: Log | null;
  onClear: () => void;
  detailLog: Log | null;
  onDetailClear: () => void;
  handleToast: (msg: string) => void;
}

export default function LogForm({ selectedLog, onClear, detailLog, onDetailClear, handleToast }: LogFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { handleToast("Please fill in the title ❌"); return; }
    if (!content.trim()) { handleToast("Please fill in the content ❌"); return; }
    if (title.length > 30) { handleToast("Title must be under 30 characters ❌"); return; }
    if (content.length > 200) { handleToast("Content must be under 200 characters ❌"); return; }
    await createLog(title, content);
    setTitle("");
    setContent("");
    handleToast("Log created successfully ✅");
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
    handleToast("Log updated successfully ✅");
  }

  async function handleDelete() {
    if (!detailLog) return;
    await deleteLog(detailLog.id);
    onDetailClear();
    onClear();
    handleToast("Log deleted successfully ✅");
  }

  function handleCancelEdit() {
    setIsEditing(false);
    handleToast("Edit cancelled ❌");
  }

  return (
    <form id="mainForm" onSubmit={handleCreate} className="form-wrapper flex flex-col lg:flex-row gap-4 mb-8">

      {/* Left col — create form + session preview */}
      <div className="w-full lg:w-2/3 lg:self-start flex flex-col gap-4">
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

        {/* Session preview */}
        <div id="formFiller" className="flex flex-col gap-3">
          <div id="previewLabel" className="w-full rounded border px-3 py-2">
            <p className="panel-label">SESSION PREVIEW</p>
          </div>
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

      {/* Right col — detail / inline edit / watermark */}
      <div className="w-full lg:w-2/3 flex flex-col mb-3 gap-4" id="rightPanel">
        <div id="detailPanel" className="flex-1 p-4 flex flex-col gap-3">
          {!detailLog && (
            <div id="idlePanel">
              <Image src="/images/devlogger-logo.png" alt="Dev Logger" width={200} height={200} loading="eager" style={{ opacity: 0.8 }} />
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
