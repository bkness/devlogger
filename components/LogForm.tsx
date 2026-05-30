"use client";

import { useState, useEffect } from "react";
import { Log } from "@/lib/types";
import { createLog, updateLog, deleteLog } from "@/app/actions";
import { ToastType } from "@/lib/types";
import { TITLE_MAX, CONTENT_MAX, TAG_MAX_COUNT, TAG_MAX_LENGTH } from "@/lib/constants";

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
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editTagInput, setEditTagInput] = useState("");
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { handleToast("Please fill in the title", "error", "Validation"); return; }
    if (!content.trim()) { handleToast("Please fill in the content", "error", "Validation"); return; }
    if (title.length > TITLE_MAX) { handleToast(`Title must be under ${TITLE_MAX} characters`, "error", "Validation"); return; }
    if (content.length > CONTENT_MAX) { handleToast(`Content must be under ${CONTENT_MAX} characters`, "error", "Validation"); return; }
    const result = await createLog(title, content, tags);
    if (result?.error) {
      handleToast(result.error, "error", "Error");
    } else {
      handleToast("Log created successfully", "success", "Log created");
      setTitle("");
      setContent("");
      setTags([]);
    }
  }

  function handleTagKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    current: string[],
    setter: (t: string[]) => void,
    inputValue: string,
    inputSetter: (v: string) => void
  ) {
    if (e.key !== "Enter" && e.key !== ",") return;
    e.preventDefault();
    const val = inputValue.trim().toLowerCase().replace(/,/g, "");
    if (!val || current.includes(val) || current.length >= 5 || val.length > 20) {
      return handleToast(!val ? "Tag cannot be empty" : current.includes(val) ? "Tag already added" : current.length >= 5 ? "Maximum 5 tags allowed" : "Tag must be under 20 characters",
        "error",
        "Invalid tag");
    }
    setter([...current, val]);
    inputSetter("");
  }

  function handleEditClick() {
    if (!detailLog) return;
    setEditTitle(detailLog.title);
    setEditContent(detailLog.content);
    setEditTags(detailLog.tags ?? []);
    setEditTagInput("");
    setIsEditing(true);
  }

  async function handleSave() {
    if (!detailLog) return;
    const result = await updateLog(detailLog.id, editTitle, editContent, editTags);
    if (result?.error) {
      handleToast(result.error, "error", "Error");
    } else {
      setIsEditing(false);
      onDetailClear();
      onClear();
      handleToast("Log updated successfully", "success", "Log updated");
    }
  }

  async function handleDelete() {
    if (!detailLog) return;
    const result = await deleteLog(detailLog.id);
    if (result?.error) {
      handleToast(result.error, "error", "Error");
      setConfirmDelete(false);
    } else {
      onDetailClear();
      onClear();
      handleToast("Log deleted successfully", "success", "Log deleted");
    }
  }

  const isDirty = !!detailLog && (
    editTitle !== detailLog.title ||
    editContent !== detailLog.content ||
    JSON.stringify(editTags) !== JSON.stringify(detailLog.tags ?? [])
  );

  function handleCancelEdit() {
    if (isDirty) {
      setConfirmDiscard(true);
      return;
    }
    setIsEditing(false);
    handleToast("Edit cancelled", "warn", "Cancelled");
  }

  function handleConfirmDiscard() {
    setConfirmDiscard(false);
    setIsEditing(false);
    handleToast("Changes discarded", "warn", "Discarded");
  }

  useEffect(() => {
    setConfirmDelete(false);
    setConfirmDiscard(false);
    setIsEditing(false);
  }, [detailLog?.id]);

  return (
    <form id="mainForm" onSubmit={handleCreate} className="form-wrapper flex flex-col lg:flex-row gap-4 mb-8">

      {/* Left col — create form + session preview */}
      <div className="w-full lg:w-2/3 lg:self-start flex flex-col gap-4">
        <div className="form-entry-panel">
          <div className="panel-header">{"// New Entry"}</div>
          <div className="form-entry-body">
            <input
              id="mainTitle"
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="panel-field p-2 rounded h-12 w-full"
            />
            <div className={`char-counter ${title.length > TITLE_MAX ? "over" : ""}`}>{title.length}/{TITLE_MAX}</div>
            <textarea
              id="mainContent"
              placeholder="What did you work on?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="panel-field p-2 rounded w-full"
            />
            <div className={`char-counter ${content.length > CONTENT_MAX ? "over" : ""}`}>{content.length}/{CONTENT_MAX}</div>
            <div className="flex flex-wrap gap-2 items-center">
              {tags.map(tag => (
                <span key={tag} className="tag-chip">
                  {tag}
                  <button type="button" className="tag-remove-btn" onClick={() => setTags(tags.filter(t => t !== tag))}>×</button>
                </span>
              ))}
              {tags.length < 5 && (
                <input
                  type="text"
                  placeholder="Add tag (max 5)"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => handleTagKeyDown(e, tags, setTags, tagInput, setTagInput)}
                  className="tag-input"
                />
              )}
            </div>
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
            <div key={detailLog.id} className="detail-content flex flex-col gap-3 h-full">
              <h2 className="font-bold detail-title">{detailLog.title}</h2>
              <span className="detail-body">{detailLog.content}</span>
              <span className="detail-date">{new Date(detailLog.createdAt).toLocaleDateString()}</span>
            </div>
          )}

          {detailLog && isEditing && (
            <div key={`edit-${detailLog.id}`} className="detail-content flex flex-col gap-3 h-full">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="panel-field p-2 rounded w-full"
              />
              <div className={`char-counter ${editTitle.length > TITLE_MAX ? "over" : ""}`}>{editTitle.length}/{TITLE_MAX}</div>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="panel-field p-2 rounded w-full flex-1"
              />
              <div className={`char-counter ${editContent.length > CONTENT_MAX ? "over" : ""}`}>{editContent.length}/{CONTENT_MAX}</div>
              <div className="flex flex-wrap gap-2 items-center">
                {editTags.map(tag => (
                  <span key={tag} className="tag-chip">
                    {tag}
                    <button type="button" className="tag-remove-btn" onClick={() => setEditTags(editTags.filter(t => t !== tag))}>×</button>
                  </span>
                ))}
                {editTags.length < 5 && (
                  <input
                    type="text"
                    placeholder="Add tag (max 5)"
                    value={editTagInput}
                    onChange={e => setEditTagInput(e.target.value)}
                    onKeyDown={e => handleTagKeyDown(e, editTags, setEditTags, editTagInput, setEditTagInput)}
                    className="tag-input"
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {detailLog && !isEditing && (
          <div key={`actions-${detailLog.id}`} className="detail-actions flex gap-2 mb-1 p-2">
            {confirmDelete ? (
              <>
                <span className="delete-confirm-label">{"// delete?"}</span>
                <button type="button" className="delete-btn flex-1 p-2" onClick={handleDelete}>
                  Yes, delete
                </button>
                <button type="button" id="cancelBtn" onClick={() => setConfirmDelete(false)}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button type="button" id="editBtn" className="update-btn flex-1 p-2" onClick={handleEditClick}>
                  Edit
                </button>
                <button type="button" id="deleteBtn" className="delete-btn flex-1 p-2" onClick={() => setConfirmDelete(true)}>
                  Delete
                </button>
                <button type="button" id="cancelBtn" className="cancel-btn flex-1 p-2" onClick={onDetailClear}>
                  Cancel
                </button>
              </>
            )}
          </div>
        )}

        {detailLog && isEditing && (
          <div key={`edit-actions-${detailLog.id}`} className="detail-actions flex gap-2 mb-1 p-2">
            {confirmDiscard ? (
              <>
                <span className="delete-confirm-label">{"// discard changes?"}</span>
                <button type="button" className="delete-btn flex-1 p-2" onClick={handleConfirmDiscard}>
                  Yes, discard
                </button>
                <button type="button" className="cancel-btn" onClick={() => setConfirmDiscard(false)}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button type="button" id="saveBtn" className="update-btn flex-1 p-2" onClick={handleSave}>
                  Save
                </button>
                <button type="button" id="cancelEditBtn" className="cancel-btn flex-1 p-2"
                  onClick={handleCancelEdit}>
                  Cancel
                </button>
              </>
            )}
          </div>
        )}

      </div>

    </form>
  );
}
