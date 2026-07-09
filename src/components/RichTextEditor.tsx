import React, { useRef, useEffect, useState } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Quote, Link } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxCharacters?: number;
}

export function RichTextEditor({ value, onChange, placeholder = "Write something...", maxCharacters = 2000 }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [characterCount, setCharacterCount] = useState(0);

  // Sync state value to editor content if they differ
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
      updateCharacterCount();
    }
  }, [value]);

  const updateCharacterCount = () => {
    if (editorRef.current) {
      // Get plain text length
      const text = editorRef.current.innerText || '';
      setCharacterCount(text.trim().length);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      // If it's just a blank line, treat it as empty
      if (html === '<br>' || html === '<div><br></div>') {
        onChange('');
      } else {
        onChange(html);
      }
      updateCharacterCount();
    }
  };

  const executeCommand = (command: string, arg: string = '') => {
    document.execCommand(command, false, arg);
    handleInput();
    // Re-focus editor to keep typing active
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const addLink = () => {
    const url = prompt('Enter the link URL (e.g., https://example.com):');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  // Keyboard shortcut listener inside the editor
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'b') {
        e.preventDefault();
        executeCommand('bold');
      } else if (e.key === 'i') {
        e.preventDefault();
        executeCommand('italic');
      } else if (e.key === 'u') {
        e.preventDefault();
        executeCommand('underline');
      }
    }
  };

  return (
    <div className="w-full border border-[var(--border-color)] rounded-2xl bg-white/[0.01] overflow-hidden focus-within:border-blue-500/50 transition-all font-sans text-left">
      {/* Minimal Toolbar (Notion Style) */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[var(--border-color)] bg-black/[0.01] select-none">
        <button
          type="button"
          onClick={() => executeCommand('bold')}
          className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--text-primary)] hover:bg-white/5 transition-all cursor-pointer"
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('italic')}
          className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--text-primary)] hover:bg-white/5 transition-all cursor-pointer"
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('underline')}
          className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--text-primary)] hover:bg-white/5 transition-all cursor-pointer"
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </button>
        <span className="w-px h-4 bg-[var(--border-color)] mx-1" />
        <button
          type="button"
          onClick={() => executeCommand('insertUnorderedList')}
          className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--text-primary)] hover:bg-white/5 transition-all cursor-pointer"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('insertOrderedList')}
          className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--text-primary)] hover:bg-white/5 transition-all cursor-pointer"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<blockquote>')}
          className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--text-primary)] hover:bg-white/5 transition-all cursor-pointer"
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>
        <span className="w-px h-4 bg-[var(--border-color)] mx-1" />
        <button
          type="button"
          onClick={addLink}
          className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--text-primary)] hover:bg-white/5 transition-all cursor-pointer"
          title="Insert Link"
        >
          <Link className="w-4 h-4" />
        </button>
      </div>

      {/* Content Area */}
      <div className="relative min-h-[140px] p-4 text-sm">
        {/* Placeholder styling */}
        {!value && (
          <div className="absolute top-4 left-4 text-gray-500 pointer-events-none select-none italic text-sm leading-relaxed">
            {placeholder}
          </div>
        )}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          className="w-full focus:outline-none text-[var(--text-primary)] leading-relaxed min-h-[140px] prose dark:prose-invert prose-sm max-w-none"
          style={{ wordBreak: 'break-word' }}
        />
      </div>

      {/* Character Counter & Helper Footer */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-[var(--border-color)] bg-black/[0.005] select-none">
        <span className="text-[10px] text-gray-500">
          Markdown / HTML formatting is supported
        </span>
        <span className={`text-[10px] font-mono font-medium ${characterCount > maxCharacters ? 'text-red-500' : 'text-gray-500'}`}>
          {characterCount} / {maxCharacters} chars
        </span>
      </div>
    </div>
  );
}
