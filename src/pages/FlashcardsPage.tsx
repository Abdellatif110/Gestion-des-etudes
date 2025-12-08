import { useState } from 'react';
import { Plus, Layers, RotateCcw, Check, X, ChevronLeft, ChevronRight, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useStudyStore } from '@/store/studyStore';
import { cn } from '@/lib/utils';
import type { Flashcard, FlashcardDeck } from '@/types/study';

const deckColors = ['#10B981', '#6366F1', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function FlashcardsPage() {
  const { flashcards, flashcardDecks, addFlashcard, updateFlashcard, deleteFlashcard, addFlashcardDeck, deleteFlashcardDeck } = useStudyStore();
  
  const [selectedDeck, setSelectedDeck] = useState<FlashcardDeck | null>(null);
  const [isStudying, setIsStudying] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAddDeck, setShowAddDeck] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newDeck, setNewDeck] = useState({ name: '', description: '', color: deckColors[0] });
  const [newCard, setNewCard] = useState({ front: '', back: '' });

  const deckCards = selectedDeck ? flashcards.filter(f => f.deckId === selectedDeck.id) : [];
  const currentCard = deckCards[currentCardIndex];

  const handleAddDeck = () => {
    if (!newDeck.name.trim()) return;
    const deck: FlashcardDeck = {
      id: crypto.randomUUID(),
      name: newDeck.name,
      description: newDeck.description,
      color: newDeck.color,
      createdAt: new Date(),
      cardCount: 0,
    };
    addFlashcardDeck(deck);
    setNewDeck({ name: '', description: '', color: deckColors[0] });
    setShowAddDeck(false);
  };

  const handleAddCard = () => {
    if (!newCard.front.trim() || !newCard.back.trim() || !selectedDeck) return;
    const card: Flashcard = {
      id: crypto.randomUUID(),
      front: newCard.front,
      back: newCard.back,
      deckId: selectedDeck.id,
      difficulty: 'medium',
      correctCount: 0,
      incorrectCount: 0,
    };
    addFlashcard(card);
    setNewCard({ front: '', back: '' });
    setShowAddCard(false);
  };

  const handleAnswer = (correct: boolean) => {
    if (currentCard) {
      updateFlashcard(currentCard.id, {
        correctCount: correct ? currentCard.correctCount + 1 : currentCard.correctCount,
        incorrectCount: correct ? currentCard.incorrectCount : currentCard.incorrectCount + 1,
        lastReviewed: new Date(),
      });
    }
    setIsFlipped(false);
    if (currentCardIndex < deckCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setIsStudying(false);
      setCurrentCardIndex(0);
    }
  };

  const startStudying = () => {
    setIsStudying(true);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  if (isStudying && currentCard) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{selectedDeck?.name}</h2>
          <p className="text-muted-foreground">Card {currentCardIndex + 1} of {deckCards.length}</p>
        </div>

        {/* Flashcard */}
        <div 
          className={cn(
            "w-full max-w-md h-64 cursor-pointer perspective-1000",
            "transition-transform duration-500"
          )}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className={cn(
            "relative w-full h-full transition-transform duration-500 transform-style-3d",
            isFlipped && "rotate-y-180"
          )}>
            {/* Front */}
            <div className={cn(
              "absolute inset-0 glass rounded-2xl p-8 flex items-center justify-center backface-hidden",
              "border-2"
            )} style={{ borderColor: selectedDeck?.color }}>
              <p className="text-2xl font-semibold text-center">{currentCard.front}</p>
            </div>
            {/* Back */}
            <div className={cn(
              "absolute inset-0 glass rounded-2xl p-8 flex items-center justify-center backface-hidden rotate-y-180",
              "border-2"
            )} style={{ borderColor: selectedDeck?.color, backgroundColor: `${selectedDeck?.color}15` }}>
              <p className="text-xl text-center">{currentCard.back}</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">Click card to flip</p>

        {/* Controls */}
        {isFlipped && (
          <div className="flex gap-4 animate-slide-up">
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleAnswer(false)}
              className="border-destructive text-destructive hover:bg-destructive/10"
            >
              <X className="w-5 h-5 mr-2" />
              Incorrect
            </Button>
            <Button
              variant="default"
              size="lg"
              onClick={() => handleAnswer(true)}
              className="bg-success hover:bg-success/90 text-white"
            >
              <Check className="w-5 h-5 mr-2" />
              Correct
            </Button>
          </div>
        )}

        <Button variant="ghost" onClick={() => { setIsStudying(false); setIsFlipped(false); }}>
          Exit Study Mode
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Layers className="w-8 h-8 text-primary" />
            Flashcards
          </h1>
          <p className="text-muted-foreground">Create and study flashcard decks</p>
        </div>
        <Button variant="gradient" onClick={() => setShowAddDeck(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Deck
        </Button>
      </div>

      {/* Add Deck Modal */}
      {showAddDeck && (
        <div className="glass rounded-xl p-6 space-y-4 animate-slide-up">
          <h3 className="font-semibold">Create New Deck</h3>
          <div className="space-y-4">
            <div>
              <Label>Deck Name</Label>
              <Input
                placeholder="e.g., Spanish Vocabulary"
                value={newDeck.name}
                onChange={(e) => setNewDeck({ ...newDeck, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Description (optional)</Label>
              <Input
                placeholder="Brief description..."
                value={newDeck.description}
                onChange={(e) => setNewDeck({ ...newDeck, description: e.target.value })}
              />
            </div>
            <div>
              <Label>Color</Label>
              <div className="flex gap-2 mt-2">
                {deckColors.map((color) => (
                  <button
                    key={color}
                    className={cn(
                      "w-8 h-8 rounded-full transition-transform",
                      newDeck.color === color && "ring-2 ring-offset-2 ring-offset-background scale-110"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewDeck({ ...newDeck, color })}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="gradient" onClick={handleAddDeck}>Create Deck</Button>
              <Button variant="outline" onClick={() => setShowAddDeck(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Deck View */}
      {selectedDeck ? (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setSelectedDeck(null)}>
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <div className="flex-1">
              <h2 className="text-2xl font-bold" style={{ color: selectedDeck.color }}>{selectedDeck.name}</h2>
              <p className="text-sm text-muted-foreground">{deckCards.length} cards</p>
            </div>
            {deckCards.length > 0 && (
              <Button variant="gradient" onClick={startStudying}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Study Now
              </Button>
            )}
            <Button variant="outline" onClick={() => setShowAddCard(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Card
            </Button>
          </div>

          {/* Add Card Form */}
          {showAddCard && (
            <div className="glass rounded-xl p-6 space-y-4 animate-slide-up">
              <h3 className="font-semibold">Add New Card</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Front (Question)</Label>
                  <Textarea
                    placeholder="Enter the question or term..."
                    value={newCard.front}
                    onChange={(e) => setNewCard({ ...newCard, front: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Back (Answer)</Label>
                  <Textarea
                    placeholder="Enter the answer..."
                    value={newCard.back}
                    onChange={(e) => setNewCard({ ...newCard, back: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="gradient" onClick={handleAddCard}>Add Card</Button>
                <Button variant="outline" onClick={() => setShowAddCard(false)}>Cancel</Button>
              </div>
            </div>
          )}

          {/* Cards List */}
          <div className="grid md:grid-cols-2 gap-4">
            {deckCards.map((card) => (
              <div key={card.id} className="glass rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium">{card.front}</p>
                    <p className="text-sm text-muted-foreground mt-1">{card.back}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteFlashcard(card.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span className="text-success">✓ {card.correctCount}</span>
                  <span className="text-destructive">✗ {card.incorrectCount}</span>
                </div>
              </div>
            ))}
          </div>

          {deckCards.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No cards yet. Add your first card to start studying!</p>
            </div>
          )}
        </div>
      ) : (
        /* Decks Grid */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {flashcardDecks.map((deck) => {
            const cards = flashcards.filter(f => f.deckId === deck.id);
            return (
              <div
                key={deck.id}
                className="glass rounded-xl p-6 cursor-pointer hover:scale-[1.02] transition-transform"
                onClick={() => setSelectedDeck(deck)}
              >
                <div className="flex items-start justify-between">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${deck.color}20` }}
                  >
                    <Layers style={{ color: deck.color }} />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFlashcardDeck(deck.id);
                    }}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <h3 className="font-semibold mt-4">{deck.name}</h3>
                {deck.description && (
                  <p className="text-sm text-muted-foreground mt-1">{deck.description}</p>
                )}
                <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                  <span>{cards.length} cards</span>
                  <span>•</span>
                  <span>{cards.filter(c => c.correctCount > c.incorrectCount).length} mastered</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {flashcardDecks.length === 0 && !showAddDeck && (
        <div className="text-center py-12 text-muted-foreground">
          <Layers className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-4">No flashcard decks yet</p>
          <Button variant="gradient" onClick={() => setShowAddDeck(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Deck
          </Button>
        </div>
      )}
    </div>
  );
}