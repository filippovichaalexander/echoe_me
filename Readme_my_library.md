Моя библиотека — это личное творческое пространство пользователя, где хранятся все созданные и обработанные материалы. Это не просто файловое хранилище, а интерактивная творческая среда с иерархической структурой, метаданными и интеграцией с аватаром.

📁 СТРУКТУРА БИБЛИОТЕКИ
Базовая иерархия:
text
Моя библиотека/
├── 📀 Альбомы/
│   ├── Альбом 1/
│   │   ├── 01_Трек_1.wav
│   │   ├── 02_Трек_2.wav
│   │   ├── обложка.jpg
│   │   └── заметки.txt
│   └── Альбом 2/
│
├── 🎵 Композиции/
│   ├── Композиция А/
│   │   ├── композиция_полная.wav
│   │   ├── стем_вокал.wav
│   │   ├── стем_гитара.wav
│   │   ├── стем_барабаны.wav
│   │   └── описание.md
│   └── Композиция Б/
│
├── 🎹 Сэмплы/
│   ├── ударные/
│   │   ├── клэп_01.wav
│   │   ├── клэп_02.wav
│   │   └── бочка_deep.wav
│   ├── басы/
│   └── мелодии/
│
├── 📝 Черновики/
│   ├── идея_для_песни.txt
│   ├── наброски_аккордов.mid
│   └── текст_для_вокала.rtf
│
└── 🏷️ Теги/
    └── (виртуальная структура по тегам)
🏗️ МОДЕЛЬ ДАННЫХ ДЛЯ БИБЛИОТЕКИ
python
# backend/models/library.py
from datetime import datetime
from typing import List, Optional, Dict
from pydantic import BaseModel, Field
from enum import Enum

class FileType(str, Enum):
    AUDIO = "audio"
    MIDI = "midi"
    TEXT = "text"
    IMAGE = "image"
    PROJECT = "project"

class AudioFileType(str, Enum):
    FULL_TRACK = "full_track"
    STEM = "stem"
    SAMPLE = "sample"
    LOOP = "loop"
    MASTER = "master"

class LibraryItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    parent_id: Optional[str] = None  # ID папки/альбома/композиции
    
    # Основные поля
    name: str
    type: FileType
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    size_bytes: int
    duration_seconds: Optional[float] = None
    
    # Путь в иерархии
    path: str  # full/path/to/item
    
    # Метаданные
    metadata: Dict = {
        'bitrate': None,
        'sample_rate': None,
        'channels': None,
        'format': None,
        'bpm': None,
        'key': None,
        'genre': None,
        'mood': None,
        'instruments': [],
        'tags': [],
    }
    
    # Связи с другими элементами
    belongs_to: Optional[str] = None  # ID родительской композиции/альбома
    children_ids: List[str] = []  # Для папок/композиций (стемы)
    
    # Создано с помощью аватара
    avatar_metadata: Optional[Dict] = {
        'generation_prompt': None,
        'context_at_creation': None,
        'avatar_version': None,
        'vector_snapshot': None,
    }
    
    # Заметки пользователя
    notes: Optional[str] = None
    lyrics: Optional[str] = None  # Для вокальных треков
    
    # Версионирование
    version: int = 1
    previous_versions: List[str] = []  # ID предыдущих версий
    
    # Статистика
    play_count: int = 0
    last_played: Optional[datetime] = None
    favorite: bool = False
    
    # Обложка/превью
    cover_image_id: Optional[str] = None  # ID изображения в библиотеке

class Album(BaseModel):
    id: str
    user_id: str
    name: str
    description: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    # Треки в альбоме (порядок важен)
    tracks: List[Dict] = []  # [{'track_id': str, 'order': int, 'name': str}]
    
    # Обложка
    cover_image_id: Optional[str] = None
    
    # Метаданные альбома
    genre: Optional[str] = None
    mood: Optional[str] = None
    year: Optional[int] = None
    
    # Заметки к альбому
    notes: Optional[str] = None
    
    # Статистика
    total_duration: float = 0.0
    track_count: int = 0
    play_count: int = 0
    
    # Коллаборация (для будущего)
    collaborators: List[str] = []  # ID других пользователей

class Project(BaseModel):
    """
    Композиция со всеми стемами и материалами
    """
    id: str
    user_id: str
    name: str
    description: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    # Основной микс
    master_track_id: Optional[str] = None
    
    # Стемы
    stems: List[str] = []  # ID файлов (вокал, гитара, бас и т.д.)
    
    # MIDI и ноты
    midi_files: List[str] = []  # ID MIDI файлов
    
    # Текст
    lyrics: Optional[str] = None
    
    # Аккорды и структура
    chords: Optional[str] = None
    structure: Optional[Dict] = {
        'intro': '0:00-0:30',
        'verse': '0:30-1:00',
        'chorus': '1:00-1:30',
    }
    
    # Параметры создания
    creation_prompt: Optional[str] = None
    avatar_version: Optional[str] = None
    
    # Версионирование
    version_history: List[Dict] = []  # Снимки проекта
    
    # Обложка
    cover_image_id: Optional[str] = None


    💾 ЛИМИТЫ ПО ТАРИФАМ
python
# backend/models/subscription.py
from enum import Enum

class UserTier(str, Enum):
    FREE = "free"
    PREMIUM = "premium"
    PRO = "pro"

class StorageLimits:
    TIER_LIMITS = {
        UserTier.FREE: {
            'total_storage_mb': 100,  # 100 MB
            'max_file_size_mb': 10,    # 10 MB
            'max_tracks': 10,
            'max_projects': 3,
            'max_albums': 1,
            'max_samples': 20,
            'version_history_days': 7,  # Хранить версии 7 дней
            'can_export': False,
        },
        UserTier.PREMIUM: {
            'total_storage_mb': 1024,   # 1 GB
            'max_file_size_mb': 50,     # 50 MB
            'max_tracks': 100,
            'max_projects': 30,
            'max_albums': 10,
            'max_samples': 200,
            'version_history_days': 30,  # Хранить версии 30 дней
            'can_export': True,
            'export_formats': ['mp3', 'wav'],
        },
        UserTier.PRO: {
            'total_storage_mb': 10240,  # 10 GB
            'max_file_size_mb': 200,    # 200 MB
            'max_tracks': 1000,
            'max_projects': 'unlimited',
            'max_albums': 'unlimited',
            'max_samples': 'unlimited',
            'version_history_days': 365,  # Хранить версии год
            'can_export': True,
            'export_formats': ['mp3', 'wav', 'flac', 'aiff'],
            'can_collaborate': True,
        }
    }

    @classmethod
    def check_quota(cls, user_tier: UserTier, current_usage: Dict) -> Dict:
        """
        Проверяет, не превышает ли пользователь лимиты
        """
        limits = cls.TIER_LIMITS[user_tier]
        warnings = []
        exceeded = []
        
        for key, value in current_usage.items():
            if key in limits:
                limit = limits[key]
                if limit != 'unlimited' and value > limit:
                    exceeded.append(key)
                    warnings.append(f"Превышен лимит {key}: {value}/{limit}")
        
        return {
            'within_limits': len(exceeded) == 0,
            'exceeded': exceeded,
            'warnings': warnings,
            'current_usage': current_usage,
            'limits': limits
        }




        🎨 UI КОМПОНЕНТЫ ДЛЯ БИБЛИОТЕКИ
1. Главная страница библиотеки
tsx
// frontend/app/library/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useLibrary } from '@/lib/hooks/useLibrary';
import { useSubscription } from '@/lib/hooks/useSubscription';
import FolderTree from '@/components/library/FolderTree';
import FileGrid from '@/components/library/FileGrid';
import StorageQuota from '@/components/library/StorageQuota';
import CreateMenu from '@/components/library/CreateMenu';

export default function LibraryPage() {
  const { items, folders, currentPath, navigateTo, createFolder, uploadFiles } = useLibrary();
  const { tier, quota, usage } = useSubscription();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Шапка библиотеки */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">📚 Моя библиотека</h1>
            
            <div className="flex items-center gap-4">
              {/* Индикатор хранилища */}
              <StorageQuota usage={usage} limits={quota} tier={tier} />
              
              {/* Кнопки действий */}
              <button 
                onClick={() => createFolder()}
                className="bg-gray-700 hover:bg-gray-600 rounded-lg px-4 py-2"
              >
                📁 Новая папка
              </button>
              
              <CreateMenu onSelect={handleCreate} />
              
              <button
                onClick={() => uploadFiles()}
                className="bg-purple-600 hover:bg-purple-500 rounded-lg px-4 py-2"
              >
                ⬆️ Загрузить
              </button>
            </div>
          </div>
          
          {/* Хлебные крошки */}
          <BreadCrumbs path={currentPath} onNavigate={navigateTo} />
        </div>
      </div>
      
      {/* Основной контент */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Левая панель - дерево папок */}
          <div className="col-span-3">
            <FolderTree 
              folders={folders}
              currentPath={currentPath}
              onSelect={navigateTo}
              onCreateFolder={createFolder}
            />
          </div>
          
          {/* Правая панель - файлы */}
          <div className="col-span-9">
            {/* Переключатель вида */}
            <div className="flex justify-end mb-4">
              <ViewToggle mode={viewMode} onChange={setViewMode} />
            </div>
            
            {/* Сетка файлов */}
            <FileGrid 
              items={items}
              viewMode={viewMode}
              selectedItems={selectedItems}
              onSelect={setSelectedItems}
              onItemClick={handleItemClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
2. Компонент для работы с композицией/проектом
tsx
// frontend/app/library/project/[id]/page.tsx
'use client';

import { useState } from 'react';
import { useProject } from '@/lib/hooks/useProject';
import Waveform from '@/components/audio/Waveform';
import StemTrack from '@/components/library/StemTrack';
import NotesEditor from '@/components/library/NotesEditor';
import VersionHistory from '@/components/library/VersionHistory';

export default function ProjectPage({ params }: { params: { id: string } }) {
  const { project, stems, updateProject, addStem, removeStem } = useProject(params.id);
  const [activeTab, setActiveTab] = useState<'stems' | 'notes' | 'versions'>('stems');
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Шапка проекта */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <input
              type="text"
              value={project.name}
              onChange={(e) => updateProject({ name: e.target.value })}
              className="text-3xl font-bold bg-transparent border-b border-gray-700 focus:border-purple-500 outline-none pb-2"
            />
            <p className="text-gray-400 mt-2">
              Создано {formatDate(project.created_at)}
            </p>
          </div>
          
          <div className="flex gap-3">
            <button className="bg-gray-700 hover:bg-gray-600 rounded-lg px-4 py-2">
              🔄 Экспорт
            </button>
            <button className="bg-purple-600 hover:bg-purple-500 rounded-lg px-4 py-2">
              💾 Сохранить
            </button>
          </div>
        </div>
        
        {/* Основной микс */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Основной микс</h2>
          {project.master_track ? (
            <div>
              <Waveform url={project.master_track.url} />
              <div className="flex gap-2 mt-4">
                <button className="bg-gray-700 hover:bg-gray-600 rounded px-3 py-1 text-sm">
                  🔄 Обновить микс
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 rounded px-3 py-1 text-sm">
                  📊 Анализ мастеринга
                </button>
              </div>
            </div>
          ) : (
            <button className="w-full py-8 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-purple-500 hover:text-purple-400 transition">
              + Создать микс из стемов
            </button>
          )}
        </div>
        
        {/* Табы */}
        <div className="border-b border-gray-700 mb-6">
          <nav className="flex gap-6">
            <button
              onClick={() => setActiveTab('stems')}
              className={`pb-3 px-1 ${activeTab === 'stems' ? 'border-b-2 border-purple-500 text-white' : 'text-gray-400'}`}
            >
              Стемы ({stems.length})
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`pb-3 px-1 ${activeTab === 'notes' ? 'border-b-2 border-purple-500 text-white' : 'text-gray-400'}`}
            >
              Заметки и текст
            </button>
            <button
              onClick={() => setActiveTab('versions')}
              className={`pb-3 px-1 ${activeTab === 'versions' ? 'border-b-2 border-purple-500 text-white' : 'text-gray-400'}`}
            >
              Версии
            </button>
          </nav>
        </div>
        
        {/* Контент табов */}
        <div>
          {activeTab === 'stems' && (
            <div className="space-y-4">
              {stems.map(stem => (
                <StemTrack 
                  key={stem.id}
                  stem={stem}
                  onDelete={() => removeStem(stem.id)}
                  onUpdate={(updates) => updateStem(stem.id, updates)}
                />
              ))}
              
              <button className="w-full py-4 border-2 border-dashed border-gray-700 rounded-lg text-gray-500 hover:border-purple-500 hover:text-purple-400 transition">
                + Добавить стем
              </button>
            </div>
          )}
          
          {activeTab === 'notes' && (
            <NotesEditor
              initialNotes={project.notes}
              initialLyrics={project.lyrics}
              onSave={(notes, lyrics) => updateProject({ notes, lyrics })}
            />
          )}
          
          {activeTab === 'versions' && (
            <VersionHistory
              versions={project.version_history}
              onRestore={(versionId) => restoreVersion(versionId)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
3. Компонент для альбома
tsx
// frontend/app/library/album/[id]/page.tsx
'use client';

import { useState } from 'react';
import { useAlbum } from '@/lib/hooks/useAlbum';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function AlbumPage({ params }: { params: { id: string } }) {
  const { album, tracks, updateTrackOrder, addTrack, removeTrack } = useAlbum(params.id);
  const [editing, setEditing] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Шапка альбома */}
        <div className="flex gap-8 mb-8">
          {/* Обложка */}
          <div className="w-48 h-48 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
            {album.cover_image ? (
              <img src={album.cover_image.url} alt="Cover" />
            ) : (
              <span className="text-6xl">💿</span>
            )}
          </div>
          
          <div className="flex-1">
            <input
              type="text"
              value={album.name}
              onChange={(e) => updateAlbum({ name: e.target.value })}
              className="text-4xl font-bold bg-transparent border-b border-gray-700 focus:border-purple-500 outline-none pb-2 w-full"
            />
            
            <p className="text-gray-400 mt-2">{tracks.length} треков • {formatDuration(album.total_duration)}</p>
            
            <textarea
              placeholder="Описание альбома..."
              value={album.description}
              onChange={(e) => updateAlbum({ description: e.target.value })}
              className="mt-4 w-full bg-gray-800 rounded-lg p-3 text-gray-300"
              rows={3}
            />
          </div>
        </div>
        
        {/* Трек-лист */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Трек-лист</h2>
          
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tracks">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {tracks.map((track, index) => (
                    <Draggable key={track.id} draggableId={track.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="flex items-center gap-4 p-3 bg-gray-700 rounded-lg mb-2"
                        >
                          <span className="text-gray-400 w-8">{index + 1}</span>
                          <div className="flex-1">
                            <input
                              type="text"
                              value={track.custom_name || track.original_name}
                              onChange={(e) => updateTrackName(track.id, e.target.value)}
                              className="bg-transparent font-medium"
                            />
                            <div className="text-sm text-gray-400">
                              {track.duration} • {track.metadata.genre || 'No genre'}
                            </div>
                          </div>
                          <button className="text-gray-400 hover:text-red-400">
                            🗑️
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          
          <button className="w-full mt-4 py-3 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-purple-500 hover:text-purple-400">
            + Добавить трек в альбом
          </button>
        </div>
        
        {/* Заметки к альбому */}
        <div className="mt-6 bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">📝 Заметки к альбому</h2>
          <textarea
            value={album.notes}
            onChange={(e) => updateAlbum({ notes: e.target.value })}
            placeholder="Идеи, концепция, вдохновение..."
            className="w-full bg-gray-700 rounded-lg p-4 min-h-[150px]"
          />
        </div>
      </div>
    </div>
  );
}
4. Компонент управления хранилищем
tsx
// frontend/components/library/StorageQuota.tsx
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function StorageQuota({ usage, limits, tier }) {
  const percentUsed = (usage.total / limits.total_storage_mb) * 100;
  
  const formatSize = (mb: number) => {
    if (mb < 1024) return `${mb} MB`;
    return `${(mb / 1024).toFixed(1)} GB`;
  };
  
  return (
    <div className="relative group">
      <button className="flex items-center gap-2 bg-gray-700 rounded-lg px-3 py-2">
        <CircularProgressbar
          value={percentUsed}
          strokeWidth={10}
          styles={buildStyles({
            pathColor: percentUsed > 90 ? '#ef4444' : '#8b5cf6',
            trailColor: '#374151',
            strokeLinecap: 'round',
            pathTransitionDuration: 0.5,
          })}
          className="w-5 h-5"
        />
        <span>{formatSize(usage.total)} / {formatSize(limits.total_storage_mb)}</span>
      </button>
      
      {/* Детальная информация при наведении */}
      <div className="absolute right-0 top-full mt-2 w-80 bg-gray-800 rounded-xl shadow-xl p-4 hidden group-hover:block z-50">
        <h4 className="font-bold mb-3">Использование хранилища</h4>
        
        <div className="space-y-2 mb-4">
          <StorageBar
            label="Треки и проекты"
            used={usage.tracks}
            total={limits.max_tracks}
            unit="шт"
          />
          <StorageBar
            label="Сэмплы"
            used={usage.samples}
            total={limits.max_samples}
            unit="шт"
          />
          <StorageBar
            label="Альбомы"
            used={usage.albums}
            total={limits.max_projects}
            unit="шт"
          />
        </div>
        
        <div className="text-sm text-gray-400 border-t border-gray-700 pt-3">
          <p>Тариф: <span className="text-purple-400 font-medium capitalize">{tier}</span></p>
          <p className="mt-1">
            {percentUsed > 90 ? '⚠️ Почти заполнено' : '✅ Есть место'}
          </p>
          <button className="mt-3 w-full bg-purple-600 hover:bg-purple-500 rounded-lg py-2 text-sm">
            Улучшить тариф
          </button>
        </div>
      </div>
    </div>
  );
}

const StorageBar = ({ label, used, total, unit }) => {
  if (total === 'unlimited') {
    return (
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span>{used} {unit}</span>
      </div>
    );
  }
  
  const percent = (used / total) * 100;
  
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span>{used}/{total} {unit}</span>
      </div>
      <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-purple-500 rounded-full transition-all"
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </div>
  );
};
5. Компонент для заметок/текстов
tsx
// frontend/components/library/NotesEditor.tsx
import { useState } from 'react';
import Editor from 'react-simple-wysiwyg';
import { Bold, Italic, List, Link, Image } from 'lucide-react';

export default function NotesEditor({ initialNotes, initialLyrics, onSave }) {
  const [notes, setNotes] = useState(initialNotes || '');
  const [lyrics, setLyrics] = useState(initialLyrics || '');
  const [activeTab, setActiveTab] = useState<'notes' | 'lyrics'>('notes');
  
  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('notes')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'notes' ? 'bg-purple-600' : 'bg-gray-700'
          }`}
        >
          📝 Общие заметки
        </button>
        <button
          onClick={() => setActiveTab('lyrics')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'lyrics' ? 'bg-purple-600' : 'bg-gray-700'
          }`}
        >
          🎤 Текст (лирика)
        </button>
      </div>
      
      {activeTab === 'notes' ? (
        <div>
          <Editor
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            containerProps={{
              style: {
                background: '#1f2937',
                color: 'white',
                borderRadius: '0.5rem',
                minHeight: '300px',
              }
            }}
          />
          
          <div className="mt-4 flex gap-2">
            <button className="bg-gray-700 hover:bg-gray-600 rounded px-4 py-2">
              📎 Прикрепить файл
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 rounded px-4 py-2">
              🔗 Ссылка на референс
            </button>
          </div>
        </div>
      ) : (
        <div>
          <textarea
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            placeholder="Введите текст песни..."
            className="w-full h-64 bg-gray-700 rounded-lg p-4 font-mono"
          />
          
          <div className="mt-4 grid grid-cols-4 gap-2">
            <button className="bg-gray-700 hover:bg-gray-600 rounded p-2">
              [Куплет]
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 rounded p-2">
              [Припев]
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 rounded p-2">
              [Бридж]
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 rounded p-2">
              [Аутро]
            </button>
          </div>
        </div>
      )}
      
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => onSave(notes, lyrics)}
          className="bg-purple-600 hover:bg-purple-500 rounded-lg px-6 py-2"
        >
          💾 Сохранить
        </button>
      </div>
    </div>
  );
}
6. Компонент для сэмплов
tsx
// frontend/components/library/SampleBrowser.tsx
import { useState } from 'react';
import SampleCard from './SampleCard';
import SampleFilters from './SampleFilters';

export default function SampleBrowser() {
  const [samples, setSamples] = useState([]);
  const [filters, setFilters] = useState({
    type: 'all',
    bpm: null,
    key: null,
    tags: []
  });
  const [view, setView] = useState<'grid' | 'waveform'>('grid');
  
  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">🎹 Мои сэмплы</h2>
        
        <div className="flex gap-2">
          <button className="bg-gray-700 hover:bg-gray-600 rounded-lg px-4 py-2">
            📁 Импорт сэмплов
          </button>
          <button className="bg-purple-600 hover:bg-purple-500 rounded-lg px-4 py-2">
            🎵 Создать из генерации
          </button>
        </div>
      </div>
      
      {/* Фильтры */}
      <SampleFilters filters={filters} onChange={setFilters} />
      
      {/* Переключатель вида */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setView('grid')}
          className={`p-2 ${view === 'grid' ? 'text-purple-400' : 'text-gray-400'}`}
        >
          ▦ Сетка
        </button>
        <button
          onClick={() => setView('waveform')}
          className={`p-2 ${view === 'waveform' ? 'text-purple-400' : 'text-gray-400'}`}
        >
          📊 Волны
        </button>
      </div>
      
      {/* Сетка сэмплов */}
      <div className={`grid ${view === 'grid' ? 'grid-cols-4' : 'grid-cols-1'} gap-4`}>
        {samples.map(sample => (
          <SampleCard key={sample.id} sample={sample} view={view} />
        ))}
      </div>
      
      {/* Пагинация */}
      <div className="mt-6 flex justify-center gap-2">
        <button className="w-10 h-10 bg-gray-700 rounded-lg">1</button>
        <button className="w-10 h-10 bg-gray-700 rounded-lg">2</button>
        <button className="w-10 h-10 bg-gray-700 rounded-lg">3</button>
      </div>
    </div>
  );
}
🔄 ИНТЕГРАЦИЯ С АВАТАРОМ
python
# backend/core/avatar_library_integration.py
class AvatarLibraryIntegration:
    """
    Связывает библиотеку с аватаром для улучшения рекомендаций
    """
    
    def __init__(self, avatar, library):
        self.avatar = avatar
        self.library = library
    
    def analyze_library_for_insights(self, user_id: str) -> Dict:
        """
        Анализирует библиотеку пользователя и добавляет инсайты в аватар
        """
        library_items = self.library.get_user_items(user_id)
        
        insights = {
            'favorite_genres': self._analyze_genres(library_items),
            'favorite_keys': self._analyze_keys(library_items),
            'tempo_preferences': self._analyze_tempo(library_items),
            'instrumentation_patterns': self._analyze_instruments(library_items),
            'most_used_samples': self._find_most_used_samples(library_items),
            'project_completion_rate': self._calculate_completion_rate(library_items),
        }
        
        # Обновляем аватар этими инсайтами
        self.avatar.memory['global']['library_insights'] = insights
        
        return insights
    
    def recommend_based_on_library(self, user_id: str, context: Dict) -> List[Dict]:
        """
        Рекомендует создание на основе того, что уже есть в библиотеке
        """
        library = self.library.get_user_library_summary(user_id)
        
        recommendations = []
        
        # Если есть незавершенные проекты
        if library['unfinished_projects']:
            recommendations.append({
                'type': 'continue_project',
                'project_id': library['unfinished_projects'][0]['id'],
                'message': "У вас есть незавершенный проект. Продолжить работу?"
            })
        
        # Если есть похожие сэмплы
        if context and 'current_mood' in context:
            similar_samples = self._find_samples_by_mood(
                library['samples'], 
                context['current_mood']
            )
            if similar_samples:
                recommendations.append({
                    'type': 'use_samples',
                    'samples': similar_samples[:3],
                    'message': f"У вас есть сэмплы подходящие под {context['current_mood']}"
                })
        
        return recommendations
    
    def generate_from_library_item(self, user_id: str, item_id: str, modifications: Dict):
        """
        Генерирует новый материал на основе существующего в библиотеке
        """
        source_item = self.library.get_item(item_id)
        
        # Извлекаем характеристики
        features = self._extract_features(source_item)
        
        # Добавляем запрошенные модификации
        modified_features = self._apply_modifications(features, modifications)
        
        # Генерируем через Stable Audio
        generated = self._generate_from_features(modified_features)
        
        # Сохраняем в библиотеку
        new_item = self.library.save_item(
            user_id=user_id,
            name=f"{source_item.name} (вариация)",
            type='stem',
            file=generated['audio'],
            metadata={
                'source_item': item_id,
                'modifications': modifications,
                'generation_prompt': modified_features
            }
        )
        
        # Записываем действие в аватар
        self.avatar.add_action({
            'type': 'generate_from_library',
            'input': {'source_item': item_id, 'modifications': modifications},
            'output': {'new_item_id': new_item.id},
            'context': context
        })
        
        return new_item
📊 API ЭНДПОЙНТЫ ДЛЯ БИБЛИОТЕКИ
python
# backend/api/endpoints/library.py
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from ...services.library_service import LibraryService
from ...models.library import LibraryItem, Album, Project
from ...dependencies import get_current_user, get_library_service

router = APIRouter(prefix="/api/library", tags=["library"])

# ========== ОБЩИЕ ОПЕРАЦИИ ==========

@router.get("/")
async def get_library_contents(
    path: str = "/",
    user = Depends(get_current_user),
    service: LibraryService = Depends(get_library_service)
):
    """Получить содержимое библиотеки по пути"""
    return await service.get_contents(user.id, path)

@router.post("/folder")
async def create_folder(
    name: str,
    parent_path: str = "/",
    user = Depends(get_current_user),
    service: LibraryService = Depends(get_library_service)
):
    """Создать новую папку"""
    return await service.create_folder(user.id, name, parent_path)

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    parent_path: str = "/",
    user = Depends(get_current_user),
    service: LibraryService = Depends(get_library_service)
):
    """Загрузить файл в библиотеку"""
    # Проверяем лимиты
    quota_check = await service.check_upload_quota(user.id, file.size)
    if not quota_check['within_limits']:
        raise HTTPException(400, quota_check['warnings'])
    
    return await service.save_uploaded_file(user.id, file, parent_path)

@router.delete("/item/{item_id}")
async def delete_item(
    item_id: str,
    user = Depends(get_current_user),
    service: LibraryService = Depends(get_library_service)
):
    """Удалить элемент из библиотеки"""
    return await service.delete_item(user.id, item_id)

# ========== ПРОЕКТЫ ==========

@router.post("/project")
async def create_project(
    name: str,
    user = Depends(get_current_user),
    service: LibraryService = Depends(get_library_service)
):
    """Создать новый проект (композицию)"""
    return await service.create_project(user.id, name)

@router.get("/project/{project_id}")
async def get_project(
    project_id: str,
    user = Depends(get_current_user),
    service: LibraryService = Depends(get_library_service)
):
    """Получить информацию о проекте"""
    return await service.get_project(user.id, project_id)

@router.post("/project/{project_id}/stem")
async def add_stem_to_project(
    project_id: str,
    stem_file: UploadFile = File(...),
    stem_type: str = None,
    user = Depends(get_current_user),
    service: LibraryService = Depends(get_library_service)
):
    """Добавить стем в проект"""
    return await service.add_stem(user.id, project_id, stem_file, stem_type)

@router.post("/project/{project_id}/mix")
async def generate_mix(
    project_id: str,
    user = Depends(get_current_user),
    service: LibraryService = Depends(get_library_service)
):
    """Сгенерировать микс из стемов"""
    return await service.generate_project_mix(user.id, project_id)

# ========== АЛЬБОМЫ ==========

@router.post("/album")
async def create_album(
    name: str,
    user = Depends(get_current_user),
    service: LibraryService = Depends(get_library_service)
):
    """Создать новый альбом"""
    return await service.create_album(user.id, name)

@router.post("/album/{album_id}/track")
async def add_track_to_album(
    album_id: str,
    track_id: str,
    order: int,
    user = Depends(get_current_user),
    service: LibraryService = Depends(get_library_service)
):
    """Добавить трек в альбом"""
    return await service.add_track_to_album(user.id, album_id, track_id, order)

# ========== ЗАМЕТКИ ==========

@router.put("/item/{item_id}/notes")
async def update_notes(
    item_id: str,
    notes: dict,
    user = Depends(get_current_user),
    service: LibraryService = Depends(get_library_service)
):
    """Обновить заметки к элементу"""
    return await service.update_item_notes(user.id, item_id, notes)
💡 КЛЮЧЕВЫЕ ОСОБЕННОСТИ БИБЛИОТЕКИ
1. Умная организация
Автоматическая категоризация по типу (треки, стемы, сэмплы)

Тегирование и поиск

Связи между элементами (какой стем к какому треку)

2. Интеграция с аватаром
Аватар анализирует библиотеку и дает инсайты

Рекомендации на основе сохраненного

"Вам может понравиться этот сэмпл, потому что..."

3. Версионирование
История изменений каждого файла

Возможность вернуться к предыдущей версии

Сравнение версий

4. Коллаборация (для Pro)
Расшаривание папок с другими пользователями

Совместная работа над проектами

Комментарии к файлам

5. Экспорт
Различные форматы (MP3, WAV, FLAC)

Экспорт альбома как ZIP

Интеграция с внешними сервисами

🚀 ПРИМЕР ИСПОЛЬЗОВАНИЯ В ИНТЕРФЕЙСЕ
tsx
// Пример: Создание альбома из созданных треков
const CreateAlbumFlow = () => {
  const { tracks } = useLibrary();
  const { createAlbum, addTrack } = useAlbums();
  
  const handleCreateAlbum = async (selectedTracks) => {
    // 1. Создаем альбом
    const album = await createAlbum({
      name: "Мой первый альбом",
      description: "Экспериментальная электроника"
    });
    
    // 2. Добавляем треки в правильном порядке
    for (let i = 0; i < selectedTracks.length; i++) {
      await addTrack(album.id, selectedTracks[i].id, i);
    }
    
    // 3. Аватар анализирует альбом
    await avatar.analyzeAlbum(album.id);
    
    // 4. Получаем инсайт
    const insight = await avatar.getInsight(
      "Что говорит этот альбом о моем музыкальном развитии?"
    );
    
    // 5. Сохраняем инсайт как заметку к альбому
    await updateAlbumNotes(album.id, {
      avatar_insight: insight
    });
  };
  
  return (
    <AlbumCreationWizard 
      tracks={tracks}
      onCreate={handleCreateAlbum}
    />
  );
};
Библиотека становится не просто хранилищем, а интерактивным портфолио музыкального развития пользователя, где каждый файл имеет историю и смысл, а аватар помогает структурировать и понимать эту коллекцию.

