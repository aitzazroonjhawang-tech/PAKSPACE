/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect, FormEvent } from 'react';
import {
  Bold, Italic, Underline, List, ListOrdered, Quote, Link as LinkIcon, Code,
  Plus, Image as ImageIcon, Heading2, Undo2, Redo2, X, Smile, RefreshCw,
  Crop, AlignCenter, GripVertical, Check, Lock, ChevronLeft
} from 'lucide-react';
import { User, Space } from '../types';
import { ImageCarousel } from './ImageCarousel';

interface CreatePostComposerProps {
  currentUser: User;
  spaces: Space[];
  content: string;
  onChangeContent: (v: string) => void;
  imageUrls: string[];
  onAddPhotos: (files: File[]) => void;
  onReplacePhoto: (idx: number, file: File) => void;
  onRemovePhoto: (idx: number) => void;
  onReorderPhotos: (urls: string[]) => void;
  uploadProgressMap: Record<string, number>;
  aspectRatio: '1:1' | '4:5' | '16:9' | 'original';
  onChangeAspectRatio: (r: '1:1' | '4:5' | '16:9' | 'original') => void;
  anonymous: boolean;
  onChangeAnonymous: (v: boolean) => void;
  spaceId: string;
  onChangeSpaceId: (id: string) => void;
  isPublishing: boolean;
  onSubmit: (e: FormEvent) => void;
  onClose: () => void;
}

const EMOJIS = ['😀', '😂', '😍', '🥳', '😎', '🤔', '👏', '🔥', '💯', '🎓', '📚', '☕', '🙌', '❤️', '😢', '😮'];

export function CreatePostComposer({
  currentUser,
  spaces,
  content,
  onChangeContent,
  imageUrls,
  onAddPhotos,
  onReplacePhoto,
  onRemovePhoto,
  onReorderPhotos,
  uploadProgressMap,
  aspectRatio,
  onChangeAspectRatio,
  anonymous,
  onChangeAnonymous,
  spaceId,
  onChangeSpaceId,
  isPublishing,
  onSubmit,
  onClose
}: CreatePostComposerProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [charCount, setCharCount] = useState(0);
  const [showInsertMenu, setShowInsertMenu] = useState(false);
  const [showSelectionToolbar, setShowSelectionToolbar] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const maxCharacters = 2000;

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
    updateCharCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateCharCount = () => {
    if (editorRef.current) {
      setCharCount((editorRef.current.innerText || '').trim().length);
    }
  };

  const handleInput = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    onChangeContent(html === '<br>' || html === '<div><br></div>' ? '' : html);
    updateCharCount();
  };

  const exec = (command: string, arg: string = '') => {
    document.execCommand(command, false, arg);
    editorRef.current?.focus();
    handleInput();
  };

  const handleAddLink = () => {
    const url = prompt('Enter a URL:');
    if (url) exec('createLink', url);
  };

  const handleSelectionCheck = () => {
    const sel = window.getSelection();
    setShowSelectionToolbar(!!sel && !sel.isCollapsed && sel.toString().trim().length > 0);
  };

  const fileInputId = 'composer-image-input';
  const replaceInputIdFor = (idx: number) => `composer-replace-input-${idx}`;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'));
    if (files.length > 0) onAddPhotos(files);
    e.target.value = '';
    setShowInsertMenu(false);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    const imageFiles: File[] = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) imageFiles.push(file);
      }
    }
    if (imageFiles.length > 0) {
      e.preventDefault();
      onAddPhotos(imageFiles);
    }
  };

  const canPublish = !isPublishing && (charCount > 0 || imageUrls.length > 0);

  return (
    <div className="w-full h-full md:h-auto flex flex-col md:block bg-[var(--bg-surface-2)] md:rounded-3xl md:border md:border-[var(--border-color)] md:shadow-2xl md:max-w-[700px] md:mx-auto relative">
      {/* Top bar — mobile: full-screen app-like header. Desktop: minimal close row */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3.5 border-b border-[var(--border-color)] shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 -ml-1.5 rounded-xl hover:bg-white/5 text-gray-400 hover:text-[var(--text-primary)] transition-all cursor-pointer flex items-center gap-1"
        >
          <ChevronLeft className="w-5 h-5 md:hidden" />
          <X className="hidden md:block w-5 h-5" />
        </button>
        <span className="text-sm font-bold text-[var(--text-primary)] font-display">New Post</span>
        <button
          type="button"
          disabled={!canPublish}
          onClick={onSubmit as any}
          className="px-4 py-1.5 bg-[var(--brand-blue)] hover:bg-[var(--brand-blue-hover)] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-full text-xs transition-all cursor-pointer flex items-center gap-1.5"
        >
          {isPublishing ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Publishing
            </>
          ) : 'Publish'}
        </button>
      </div>

      {/* Writing canvas */}
      <div className="flex-grow overflow-y-auto md:max-h-[70vh] px-5 md:px-8 py-6 space-y-4">
        {/* Author row */}
        <div className="flex items-center gap-3">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full object-cover border border-white/10 shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="min-w-0">
            <p className="text-sm font-bold text-[var(--text-primary)] leading-none truncate">
              {anonymous ? 'Anonymous Student' : currentUser.name}
            </p>
            {spaces.length > 0 && (
              <select
                value={spaceId}
                onChange={(e) => onChangeSpaceId(e.target.value)}
                className="mt-1 text-[11px] text-gray-400 bg-transparent border-none focus:outline-none cursor-pointer -ml-0.5 max-w-[220px]"
              >
                <option value="" className="bg-[var(--bg-surface-2)]">Post to Campus Feed</option>
                {spaces.map(s => (
                  <option key={s.id} value={s.id} className="bg-[var(--bg-surface-2)]">{s.name}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Selection formatting toolbar (only visible when text selected) */}
        {showSelectionToolbar && (
          <div className="flex items-center gap-1 p-1.5 bg-[var(--bg-app)] border border-[var(--border-color)] rounded-xl w-fit shadow-lg animate-fade-in select-none sticky top-0 z-10">
            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => exec('bold')} className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--text-primary)] hover:bg-white/5 cursor-pointer"><Bold className="w-3.5 h-3.5" /></button>
            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => exec('italic')} className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--text-primary)] hover:bg-white/5 cursor-pointer"><Italic className="w-3.5 h-3.5" /></button>
            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => exec('underline')} className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--text-primary)] hover:bg-white/5 cursor-pointer"><Underline className="w-3.5 h-3.5" /></button>
            <span className="w-px h-3.5 bg-[var(--border-color)] mx-0.5" />
            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => exec('formatBlock', '<h3>')} className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--text-primary)] hover:bg-white/5 cursor-pointer"><Heading2 className="w-3.5 h-3.5" /></button>
            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => exec('formatBlock', '<blockquote>')} className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--text-primary)] hover:bg-white/5 cursor-pointer"><Quote className="w-3.5 h-3.5" /></button>
            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => exec('formatBlock', '<pre>')} className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--text-primary)] hover:bg-white/5 cursor-pointer"><Code className="w-3.5 h-3.5" /></button>
            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => exec('insertUnorderedList')} className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--text-primary)] hover:bg-white/5 cursor-pointer"><List className="w-3.5 h-3.5" /></button>
            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => exec('insertOrderedList')} className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--text-primary)] hover:bg-white/5 cursor-pointer"><ListOrdered className="w-3.5 h-3.5" /></button>
            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={handleAddLink} className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--text-primary)] hover:bg-white/5 cursor-pointer"><LinkIcon className="w-3.5 h-3.5" /></button>
          </div>
        )}

        {/* Editor */}
        <div className="relative">
          {!content && (
            <div className="absolute top-0 left-0 text-gray-500 pointer-events-none select-none text-[17px] leading-relaxed font-sans">
              Share something with your university...
            </div>
          )}
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onFocus={() => setIsFocused(true)}
            onBlur={() => { setIsFocused(false); setTimeout(() => setShowSelectionToolbar(false), 150); }}
            onMouseUp={handleSelectionCheck}
            onKeyUp={handleSelectionCheck}
            onPaste={handlePaste}
            className="w-full focus:outline-none text-[17px] text-[var(--text-primary)] leading-relaxed min-h-[120px] prose dark:prose-invert max-w-none font-sans"
            style={{ wordBreak: 'break-word' }}
          />
        </div>

        {/* Inline images — part of the writing flow, not a separate preview */}
        {imageUrls.length > 0 && (
          <div className="space-y-3 pt-1">
            <div className="relative group">
              <ImageCarousel
                images={imageUrls}
                index={activeImageIdx}
                onIndexChange={setActiveImageIdx}
                aspectClassName={
                  aspectRatio === '1:1' ? 'aspect-[1/1]' : aspectRatio === '16:9' ? 'aspect-[16/9]' : aspectRatio === 'original' ? 'aspect-[4/5]' : 'aspect-[4/5]'
                }
                showCounter={imageUrls.length > 1}
                showDots={imageUrls.length > 1}
              />

              {/* Floating image toolbar */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-xl p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  title="Replace"
                  onClick={() => document.getElementById(replaceInputIdFor(activeImageIdx))?.click()}
                  className="p-1.5 rounded-lg text-white hover:bg-white/20 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <input
                  id={replaceInputIdFor(activeImageIdx)}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onReplacePhoto(activeImageIdx, file);
                    e.target.value = '';
                  }}
                />
                <button type="button" title="Crop (coming soon)" className="p-1.5 rounded-lg text-white/60 cursor-not-allowed">
                  <Crop className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="Center align width"
                  onClick={() => onChangeAspectRatio('4:5')}
                  className="p-1.5 rounded-lg text-white hover:bg-white/20 cursor-pointer"
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="Remove"
                  onClick={() => {
                    onRemovePhoto(activeImageIdx);
                    setActiveImageIdx(Math.max(0, activeImageIdx - 1));
                  }}
                  className="p-1.5 rounded-lg text-white hover:bg-red-500/70 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Aspect ratio selector */}
            <div className="flex flex-wrap gap-2">
              {(['original', '1:1', '4:5', '16:9'] as const).map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => onChangeAspectRatio(ratio)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase border transition-all cursor-pointer ${
                    aspectRatio === ratio
                      ? 'bg-blue-600/10 border-blue-500 text-blue-400'
                      : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {ratio === '16:9' ? 'Landscape' : ratio === '1:1' ? 'Square' : ratio === '4:5' ? 'Portrait' : 'Original'}
                </button>
              ))}
            </div>

            {/* Thumbnail strip — reorder / select / remove */}
            {imageUrls.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {imageUrls.map((url, idx) => (
                  <div
                    key={idx}
                    draggable
                    onDragStart={() => setDraggedIdx(idx)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (draggedIdx !== null && draggedIdx !== idx) {
                        const reordered = [...imageUrls];
                        const [item] = reordered.splice(draggedIdx, 1);
                        reordered.splice(idx, 0, item);
                        onReorderPhotos(reordered);
                      }
                      setDraggedIdx(null);
                    }}
                    onDragEnd={() => setDraggedIdx(null)}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                      activeImageIdx === idx ? 'border-[var(--brand-blue)]' : 'border-transparent opacity-70 hover:opacity-100'
                    } ${draggedIdx === idx ? 'scale-95 opacity-40' : ''}`}
                  >
                    <img src={url} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" loading="lazy" decoding="async" draggable={false} />
                    <div className="absolute bottom-0.5 right-0.5 bg-black/60 rounded p-0.5">
                      <GripVertical className="w-2.5 h-2.5 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Upload progress */}
        {Object.keys(uploadProgressMap).length > 0 && (
          <div className="space-y-2">
            {Object.entries(uploadProgressMap).map(([id, progress]) => (
              <div key={id} className="p-2.5 bg-white/5 rounded-xl border border-[var(--border-color)] flex items-center justify-between gap-3">
                <span className="text-[10px] text-gray-400 font-mono">Uploading image...</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-150" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="text-[9px] font-mono font-bold text-blue-400">{progress}%</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Inline "+" insert control — sits at the end of the writing flow */}
        <div className="relative pt-1">
          <button
            type="button"
            onClick={() => setShowInsertMenu(!showInsertMenu)}
            className={`w-8 h-8 rounded-full border border-[var(--border-color)] flex items-center justify-center transition-all cursor-pointer ${
              showInsertMenu ? 'bg-[var(--brand-blue)] text-white border-[var(--brand-blue)] rotate-45' : 'text-gray-400 hover:bg-white/5 hover:text-[var(--text-primary)]'
            }`}
            title="Insert"
          >
            <Plus className="w-4 h-4" />
          </button>

          {showInsertMenu && (
            <div className="absolute left-0 top-10 z-20 bg-[var(--bg-app)] border border-[var(--border-color)] rounded-2xl shadow-2xl p-1.5 w-52 space-y-0.5 animate-fade-in">
              <button
                type="button"
                onClick={() => document.getElementById(fileInputId)?.click()}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--text-primary)] hover:bg-white/5 transition-all cursor-pointer text-left"
              >
                <ImageIcon className="w-4 h-4 text-blue-400" /> Image
              </button>
              <button type="button" onClick={() => { exec('formatBlock', '<h3>'); setShowInsertMenu(false); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--text-primary)] hover:bg-white/5 transition-all cursor-pointer text-left">
                <Heading2 className="w-4 h-4 text-gray-400" /> Heading
              </button>
              <button type="button" onClick={() => { exec('formatBlock', '<blockquote>'); setShowInsertMenu(false); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--text-primary)] hover:bg-white/5 transition-all cursor-pointer text-left">
                <Quote className="w-4 h-4 text-gray-400" /> Quote
              </button>
              <button type="button" onClick={() => { exec('insertUnorderedList'); setShowInsertMenu(false); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--text-primary)] hover:bg-white/5 transition-all cursor-pointer text-left">
                <List className="w-4 h-4 text-gray-400" /> Bullet List
              </button>
              <button type="button" onClick={() => { exec('insertOrderedList'); setShowInsertMenu(false); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--text-primary)] hover:bg-white/5 transition-all cursor-pointer text-left">
                <ListOrdered className="w-4 h-4 text-gray-400" /> Numbered List
              </button>
              <button type="button" onClick={() => { handleAddLink(); setShowInsertMenu(false); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--text-primary)] hover:bg-white/5 transition-all cursor-pointer text-left">
                <LinkIcon className="w-4 h-4 text-gray-400" /> Link
              </button>
            </div>
          )}

          <input
            id={fileInputId}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {/* Bottom settings bar */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 border-t border-[var(--border-color)] shrink-0 relative">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onChangeAnonymous(!anonymous)}
            title="Post anonymously"
            className={`p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              anonymous ? 'bg-red-950/20 text-red-400' : 'text-gray-400 hover:bg-white/5 hover:text-[var(--text-primary)]'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wide">Anon</span>
          </button>

          <button
            type="button"
            onClick={() => document.getElementById(fileInputId)?.click()}
            title="Add images"
            className="p-2 rounded-xl text-gray-400 hover:bg-white/5 hover:text-[var(--text-primary)] transition-all cursor-pointer"
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowEmoji(!showEmoji)}
              title="Emoji"
              className="p-2 rounded-xl text-gray-400 hover:bg-white/5 hover:text-[var(--text-primary)] transition-all cursor-pointer"
            >
              <Smile className="w-4 h-4" />
            </button>
            {showEmoji && (
              <div className="absolute bottom-11 left-0 z-20 bg-[var(--bg-app)] border border-[var(--border-color)] rounded-2xl shadow-2xl p-2 grid grid-cols-8 gap-1 w-64 animate-fade-in">
                {EMOJIS.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => {
                      exec('insertText', em);
                      setShowEmoji(false);
                    }}
                    className="text-lg hover:bg-white/5 rounded-lg p-1 cursor-pointer"
                  >
                    {em}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <span className={`text-[10px] font-mono font-medium ${charCount > maxCharacters ? 'text-red-500' : 'text-gray-500'}`}>
          {charCount} / {maxCharacters}
        </span>
      </div>
    </div>
  );
}
