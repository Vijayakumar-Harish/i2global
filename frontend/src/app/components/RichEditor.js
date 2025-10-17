"use client";
import { useRef, useEffect } from "react";

export default function RichEditor({ value, onChange }) {
  const editorRef = useRef(null);

  useEffect(() => {
    
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const exec = (cmd, arg = null) => {
    document.execCommand(cmd, false, arg);
    editorRef.current.focus();
  };

  return (
    <div className="border rounded text-black">
      
      <div className="flex items-center gap-1 px-3 py-2 bg-gray-50 border-b">
        <button
          type="button"
          onClick={() => exec("bold")}
          className="px-2 py-1 text-sm border rounded hover:bg-gray-200"
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => exec("italic")}
          className="px-2 py-1 text-sm border rounded hover:bg-gray-200 italic"
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => exec("underline")}
          className="px-2 py-1 text-sm border rounded hover:bg-gray-200 underline"
          title="Underline"
        >
          U
        </button>
        <span className="mx-2 text-gray-300">|</span>
        <button
          type="button"
          onClick={() => exec("insertUnorderedList")}
          className="px-2 py-1 text-sm border rounded hover:bg-gray-200"
          title="Bullet list"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => exec("insertOrderedList")}
          className="px-2 py-1 text-sm border rounded hover:bg-gray-200"
          title="Numbered list"
        >
          1. List
        </button>
      </div>

      
      <div
        ref={editorRef}
        contentEditable
        onInput={() => onChange(editorRef.current.innerHTML)}
        className="min-h-[200px] p-3 focus:outline-none"
      />
    </div>
  );
}
