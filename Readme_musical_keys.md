import React, { useState } from 'react';

// Типы данных
type Note = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';
type Category = 'basic' | 'pentatonic' | 'blues' | 'church' | 'exotic';

interface CategoryOption {
  id: Category;
  name: string;
  variations: Variation[];
}

interface Variation {
  id: string;
  name: string;
}

// Конфигурация категорий и вариаций
const CATEGORIES: Record<Category, CategoryOption> = {
  basic: {
    id: 'basic',
    name: 'Основные (Мажор/Минор)',
    variations: [
      { id: 'major', name: 'Мажор' },
      { id: 'minor', name: 'Минор' }
    ]
  },
  pentatonic: {
    id: 'pentatonic',
    name: 'Пентатоника',
    variations: [
      { id: 'pent_major', name: 'Мажорная пентатоника' },
      { id: 'pent_minor', name: 'Минорная пентатоника' }
    ]
  },
  blues: {
    id: 'blues',
    name: 'Блюзовые',
    variations: [
      { id: 'blues_major', name: 'Мажорная блюзовая' },
      { id: 'blues_minor', name: 'Минорная блюзовая' }
    ]
  },
  church: {
    id: 'church',
    name: 'Церковные лады',
    variations: [
      { id: 'ionian', name: 'Ионийский' },
      { id: 'dorian', name: 'Дорийский' },
      { id: 'phrygian', name: 'Фригийский' },
      { id: 'lydian', name: 'Лидийский' },
      { id: 'mixolydian', name: 'Миксолидийский' },
      { id: 'aeolian', name: 'Эолийский' },
      { id: 'locrian', name: 'Локрийский' }
    ]
  },
  exotic: {
    id: 'exotic',
    name: 'Экзотика',
    variations: [
      { id: 'hungarian', name: 'Венгерская минорная' },
      { id: 'wholetone', name: 'Целотонная' },
      { id: 'diminished', name: 'Уменьшенная' },
      { id: 'hirajoshi', name: 'Хираджоши' },
      { id: 'iwato', name: 'Ивато' }
    ]
  }
};

// Доступные ноты (зависит от тарифа)
const NOTES_FREE: Note[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const NOTES_PREMIUM: Note[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Отображение нот для пользователя
const NOTE_DISPLAY: Record<Note, string> = {
  'C': 'До (C)',
  'C#': 'До-диез (C#)',
  'D': 'Ре (D)',
  'D#': 'Ре-диез (D#)',
  'E': 'Ми (E)',
  'F': 'Фа (F)',
  'F#': 'Фа-диез (F#)',
  'G': 'Соль (G)',
  'G#': 'Соль-диез (G#)',
  'A': 'Ля (A)',
  'A#': 'Ля-диез (A#)',
  'B': 'Си (B)'
};

interface KeySelectorProps {
  tier: 'free' | 'premium' | 'pro';
  onSelect: (selection: {
    note: Note;
    category: Category;
    variation: string;
  }) => void;
  className?: string;
}

export const KeySelector: React.FC<KeySelectorProps> = ({ 
  tier, 
  onSelect,
  className = '' 
}) => {
  // Состояния
  const [selectedNote, setSelectedNote] = useState<Note>('C');
  const [selectedCategory, setSelectedCategory] = useState<Category>('basic');
  const [selectedVariation, setSelectedVariation] = useState<string>('major');

  // Доступные ноты в зависимости от тарифа
  const availableNotes = tier === 'free' ? NOTES_FREE : NOTES_PREMIUM;

  // Доступные категории в зависимости от тарифа
  const getAvailableCategories = (): Category[] => {
    switch (tier) {
      case 'free':
        return ['basic', 'pentatonic'];
      case 'premium':
        return ['basic', 'pentatonic', 'blues', 'church', 'exotic'];
      case 'pro':
        return ['basic', 'pentatonic', 'blues', 'church', 'exotic'];
      default:
        return ['basic'];
    }
  };

  // Доступные вариации для выбранной категории
  const availableVariations = CATEGORIES[selectedCategory].variations;

  // Обработчики изменений
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value as Category;
    setSelectedCategory(newCategory);
    // Сброс вариации на первую доступную
    setSelectedVariation(CATEGORIES[newCategory].variations[0].id);
  };

  const handleVariationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVariation(e.target.value);
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedNote(e.target.value as Note);
  };

  // Отправка выбора при изменении
  React.useEffect(() => {
    onSelect({
      note: selectedNote,
      category: selectedCategory,
      variation: selectedVariation
    });
  }, [selectedNote, selectedCategory, selectedVariation, onSelect]);

  // Найти название вариации для отображения
  const getVariationName = () => {
    const variation = CATEGORIES[selectedCategory].variations.find(v => v.id === selectedVariation);
    return variation?.name || selectedVariation;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Первый уровень: Нота */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Основная нота
        </label>
        <select
          value={selectedNote}
          onChange={handleNoteChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     bg-white"
        >
          {availableNotes.map((note) => (
            <option key={note} value={note}>
              {NOTE_DISPLAY[note]}
            </option>
          ))}
        </select>
      </div>

      {/* Второй уровень: Категория */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Семейство
        </label>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     bg-white"
        >
          {getAvailableCategories().map((catId) => (
            <option key={catId} value={catId}>
              {CATEGORIES[catId].name}
            </option>
          ))}
        </select>
      </div>

      {/* Третий уровень: Вариация */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Вариация
        </label>
        <select
          key={selectedCategory} // Важно для сброса при смене категории
          value={selectedVariation}
          onChange={handleVariationChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     bg-white"
        >
          {availableVariations.map((variation) => (
            <option key={variation.id} value={variation.id}>
              {variation.name}
            </option>
          ))}
        </select>
      </div>

      {/* Отображение результата */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <span className="font-medium">Выбрано:</span>{' '}
          {NOTE_DISPLAY[selectedNote]} — {getVariationName()}
        </p>
        <p className="text-xs text-blue-600 mt-1">
          {selectedNote} {selectedVariation}
        </p>
      </div>
    </div>
  );
};


// Поиск по вариациям (для PRO тарифа)
{ tier === 'pro' && (
  <div className="relative">
    <input
      type="text"
      placeholder="Поиск вариации..."
      className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg"
    />
    <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" ... />
  </div>
)}

// Иконки для каждой категории
const CATEGORY_ICONS = {
  basic: '🎵',
  pentatonic: '🎸',
  blues: '🎷',
  church: '⛪',
  exotic: '🌍'
};