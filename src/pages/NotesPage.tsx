import { useState } from 'react';
import { Plus, Search, FileText, Trash2, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStudyStore } from '@/store/studyStore';
import { cn } from '@/lib/utils';
import type { Note } from '@/types/study';

const noteColors = [
  'bg-card',
  'bg-primary/10',
  'bg-success/10',
  'bg-warning/10',
  'bg-destructive/10',
  'bg-accent/10',
];

export default function NotesPage() {
  const { notes, addNote, updateNote, deleteNote } = useStudyStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedColor, setSelectedColor] = useState(noteColors[0]);

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = () => {
    if (!title.trim()) return;

    if (editingNote) {
      updateNote(editingNote.id, { title, content, color: selectedColor });
    } else {
      addNote({
        id: crypto.randomUUID(),
        title: title.trim(),
        content: content.trim(),
        createdAt: new Date(),
        updatedAt: new Date(),
        color: selectedColor,
      });
    }

    handleCloseEditor();
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setSelectedColor(note.color || noteColors[0]);
    setShowEditor(true);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setEditingNote(null);
    setTitle('');
    setContent('');
    setSelectedColor(noteColors[0]);
  };

  const handleNewNote = () => {
    setEditingNote(null);
    setTitle('');
    setContent('');
    setSelectedColor(noteColors[0]);
    setShowEditor(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notes</h1>
          <p className="text-muted-foreground">Capture ideas and study materials</p>
        </div>
        <Button variant="gradient" onClick={handleNewNote}>
          <Plus className="w-4 h-4" />
          New Note
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
          <h3 className="font-medium text-lg mb-2">
            {searchQuery ? 'No notes found' : 'No notes yet'}
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            {searchQuery ? 'Try a different search term' : 'Create your first note to get started'}
          </p>
          {!searchQuery && (
            <Button variant="gradient" onClick={handleNewNote}>
              <Plus className="w-4 h-4" />
              Create Note
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className={cn(
                "group glass rounded-xl p-5 transition-all duration-200 hover:shadow-md cursor-pointer animate-scale-in",
                note.color
              )}
              onClick={() => handleEdit(note)}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold line-clamp-1">{note.title}</h3>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(note);
                    }}
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-wrap">
                {note.content || 'No content'}
              </p>
              <p className="text-xs text-muted-foreground mt-3">
                {new Date(note.updatedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Note Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-strong rounded-2xl p-6 w-full max-w-2xl shadow-lg animate-scale-in max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {editingNote ? 'Edit Note' : 'New Note'}
              </h2>
              <div className="flex items-center gap-2">
                {noteColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "w-6 h-6 rounded-full border-2 transition-transform",
                      color,
                      selectedColor === color ? "scale-125 border-primary" : "border-transparent hover:scale-110"
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Input
                placeholder="Note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg font-medium"
                autoFocus
              />
              <textarea
                placeholder="Write your note..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={handleCloseEditor} className="flex-1">
                Cancel
              </Button>
              <Button variant="gradient" onClick={handleSave} className="flex-1">
                {editingNote ? 'Save Changes' : 'Create Note'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}