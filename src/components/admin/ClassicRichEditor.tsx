"use client";

import React, { useState, useRef } from "react";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Eye,
  Edit3,
  CheckCircle2,
  Sparkles
} from "lucide-react";

interface ClassicRichEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  label?: string;
}

export default function ClassicRichEditor({
  value = "",
  onChange,
  placeholder = "Write content, headings (### Heading), bullet points (- Point), or numbered lists...",
  rows = 7,
  label = "Content & Description"
}: ClassicRichEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [viewMode, setViewMode] = useState<"write" | "preview" | "split">("write");

  // Helper to wrap or insert text at cursor
  const insertFormatting = (prefix: string, suffix = "", defaultText = "text") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = value || "";
    const selectedText = current.substring(start, end);
    const textToInsert = selectedText || defaultText;

    const before = current.substring(0, start);
    const after = current.substring(end);

    const isNewLineRequired = prefix.startsWith("#") || prefix.startsWith("-") || prefix.startsWith("1.");
    const needsLeadingNewline = isNewLineRequired && before.length > 0 && !before.endsWith("\n");
    const formattedPrefix = needsLeadingNewline ? `\n${prefix}` : prefix;

    const updated = `${before}${formattedPrefix}${textToInsert}${suffix}${after}`;
    onChange(updated);

    // Reposition cursor
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + formattedPrefix.length + textToInsert.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // Preview renderer matching live site
  const renderPreview = (content: string) => {
    if (!content || content.trim() === "") {
      return (
        <p className="text-slate-400 italic text-xs py-4 text-center">
          (No content yet. Type in the editor or use the toolbar buttons above to write.)
        </p>
      );
    }

    const rawLines = content.split(/\r?\n/);
    const elements: React.ReactNode[] = [];
    let currentList: { type: "bullet" | "number"; items: string[] } | null = null;

    const parseInline = (txt: string) => {
      const parts = txt.split(/(\*\*[^*]+\*\*)/g);
      return parts.map((part, pIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={pIdx} className="font-bold text-slate-900">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });
    };

    const flushList = () => {
      if (currentList) {
        if (currentList.type === "bullet") {
          elements.push(
            <ul key={`list-${elements.length}`} className="space-y-1.5 my-2.5 pl-1">
              {currentList.items.map((item, iIdx) => (
                <li key={iIdx} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={10} className="text-red-600" />
                  </div>
                  <span className="flex-1">{parseInline(item)}</span>
                </li>
              ))}
            </ul>
          );
        } else {
          elements.push(
            <ol key={`list-${elements.length}`} className="space-y-1.5 my-2.5 pl-1">
              {currentList.items.map((item, iIdx) => (
                <li key={iIdx} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                  <span className="w-4 h-4 rounded bg-red-50 text-red-600 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-red-100">
                    {iIdx + 1}
                  </span>
                  <span className="flex-1">{parseInline(item)}</span>
                </li>
              ))}
            </ol>
          );
        }
        currentList = null;
      }
    };

    for (let i = 0; i < rawLines.length; i++) {
      const rawLine = rawLines[i].trim();
      if (!rawLine) {
        flushList();
        continue;
      }

      if (rawLine.startsWith("### ")) {
        flushList();
        elements.push(
          <h4 key={`h-${i}`} className="text-xs font-bold text-slate-900 mt-3 mb-1.5 flex items-center gap-2">
            <div className="w-2 h-[2px] bg-red-600" />
            <span>{parseInline(rawLine.replace(/^###\s+/, ""))}</span>
          </h4>
        );
      } else if (rawLine.startsWith("## ")) {
        flushList();
        elements.push(
          <h3 key={`h-${i}`} className="text-sm font-bold text-slate-900 mt-4 mb-2 flex items-center gap-2">
            <div className="w-3 h-[2px] bg-red-600" />
            <span>{parseInline(rawLine.replace(/^##\s+/, ""))}</span>
          </h3>
        );
      } else if (/^[-*•]\s+/.test(rawLine)) {
        const item = rawLine.replace(/^[-*•]\s+/, "");
        if (!currentList || currentList.type !== "bullet") {
          flushList();
          currentList = { type: "bullet", items: [item] };
        } else {
          currentList.items.push(item);
        }
      } else if (/^\d+\.\s+/.test(rawLine)) {
        const item = rawLine.replace(/^\d+\.\s+/, "");
        if (!currentList || currentList.type !== "number") {
          flushList();
          currentList = { type: "number", items: [item] };
        } else {
          currentList.items.push(item);
        }
      } else {
        flushList();
        elements.push(
          <p key={`p-${i}`} className="text-xs text-slate-600 leading-relaxed mb-2">
            {parseInline(rawLine)}
          </p>
        );
      }
    }
    flushList();

    return <div className="space-y-1">{elements}</div>;
  };

  return (
    <div className="rounded-xl border border-slate-300 bg-white shadow-xs overflow-hidden focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100 transition-all">
      {/* Classic Editor Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-50 border-b border-slate-200">
        
        {/* Left Toolbar Group */}
        <div className="flex items-center flex-wrap gap-1">
          <button
            type="button"
            title="Bold (**text**)"
            onClick={() => insertFormatting("**", "**", "bold text")}
            className="p-1.5 hover:bg-slate-200 text-slate-700 rounded-lg transition text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <Bold size={14} />
          </button>
          <button
            type="button"
            title="Italic (*text*)"
            onClick={() => insertFormatting("*", "*", "italic text")}
            className="p-1.5 hover:bg-slate-200 text-slate-700 rounded-lg transition text-xs flex items-center gap-1 cursor-pointer"
          >
            <Italic size={14} />
          </button>

          <div className="w-[1px] h-4 bg-slate-300 mx-1" />

          <button
            type="button"
            title="Heading 2 (## Title)"
            onClick={() => insertFormatting("## ", "\n", "Main Section Title")}
            className="p-1.5 hover:bg-slate-200 text-slate-700 rounded-lg transition text-xs font-black flex items-center gap-0.5 cursor-pointer"
          >
            <Heading2 size={14} />
          </button>
          <button
            type="button"
            title="Heading 3 (### Sub-heading)"
            onClick={() => insertFormatting("### ", "\n", "Sub-heading Title")}
            className="p-1.5 hover:bg-slate-200 text-slate-700 rounded-lg transition text-xs font-bold flex items-center gap-0.5 cursor-pointer"
          >
            <Heading3 size={14} />
          </button>

          <div className="w-[1px] h-4 bg-slate-300 mx-1" />

          <button
            type="button"
            title="Bullet List (- item)"
            onClick={() => insertFormatting("- ", "\n", "Key Scope / Deliverable")}
            className="px-2 py-1 hover:bg-slate-200 text-slate-700 rounded-lg transition text-xs font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <List size={14} />
            <span className="hidden sm:inline text-[11px]">Bullet List</span>
          </button>
          <button
            type="button"
            title="Numbered List (1. item)"
            onClick={() => insertFormatting("1. ", "\n", "Milestone Execution Step")}
            className="px-2 py-1 hover:bg-slate-200 text-slate-700 rounded-lg transition text-xs font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <ListOrdered size={14} />
            <span className="hidden sm:inline text-[11px]">Numbered List</span>
          </button>

          <div className="w-[1px] h-4 bg-slate-300 mx-1" />

          <button
            type="button"
            title="Callout / Highlight Quote"
            onClick={() => insertFormatting("> ", "\n", "Important standard note or specification.")}
            className="p-1.5 hover:bg-slate-200 text-slate-700 rounded-lg transition text-xs flex items-center gap-1 cursor-pointer"
          >
            <Quote size={14} />
          </button>
        </div>

        {/* Right View Mode Switcher */}
        <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setViewMode("write")}
            className={`px-2.5 py-1 rounded-md transition font-medium flex items-center gap-1.5 cursor-pointer ${
              viewMode === "write" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Edit3 size={12} />
            <span>Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("preview")}
            className={`px-2.5 py-1 rounded-md transition font-medium flex items-center gap-1.5 cursor-pointer ${
              viewMode === "preview" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Eye size={12} />
            <span>Live Preview</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("split")}
            className={`hidden md:flex px-2.5 py-1 rounded-md transition font-medium items-center gap-1.5 cursor-pointer ${
              viewMode === "split" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>Split View</span>
          </button>
        </div>

      </div>

      {/* Editor Content Area */}
      <div className={viewMode === "split" ? "grid grid-cols-2 divide-x divide-slate-200" : ""}>
        
        {/* Textarea Input */}
        {(viewMode === "write" || viewMode === "split") && (
          <div className="relative">
            <textarea
              ref={textareaRef}
              data-lenis-prevent
              rows={rows}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full p-3.5 text-xs sm:text-sm text-slate-900 font-mono leading-relaxed bg-white focus:outline-hidden resize-y overscroll-contain [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full"
              style={{ minHeight: `${rows * 26}px` }}
            />
          </div>
        )}

        {/* Live Preview Panel */}
        {(viewMode === "preview" || viewMode === "split") && (
          <div
            data-lenis-prevent
            className="p-4 bg-slate-50/70 overflow-y-auto max-h-[380px] overscroll-contain [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-red-300 [&::-webkit-scrollbar-thumb]:rounded-full"
            style={{ minHeight: `${rows * 26}px` }}
          >
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Sparkles size={11} className="text-red-500" />
              <span>Live Site Render Preview</span>
            </div>
            {renderPreview(value)}
          </div>
        )}

      </div>

      {/* Footer Helper Note */}
      <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>
          💡 Format: <strong className="text-red-600">### Heading</strong>, <strong className="text-red-600">- Bullet Item</strong>, <strong className="text-red-600">1. Numbered</strong>, <strong className="text-red-600">**bold**</strong>
        </span>
        <span className="font-mono text-[10px] text-slate-400">
          {value ? `${value.length} characters` : "0 chars"}
        </span>
      </div>
    </div>
  );
}
