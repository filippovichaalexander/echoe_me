СТРАНИЦА ЛИЧНОГО КАБИНЕТА: ПОЛНЫЙ АНАЛИЗ И ФУНКЦИОНАЛ
🎯 КОНЦЕПЦИЯ ЛИЧНОГО КАБИНЕТА
Личный кабинет — это не просто профиль с настройками, а зеркало музыкальной души пользователя. Здесь он видит, как его аватар растет, меняется и понимает его все лучше.

📊 КЛЮЧЕВЫЕ РАЗДЕЛЫ ЛИЧНОГО КАБИНЕТА
1. 🎭 ОБЗОР АВАТАРА (Главная страница кабинета)
typescript
interface AvatarDashboard {
  // Визуальное представление
  avatar_visualization: {
    type: 'vector_sphere' | 'taste_flower' | 'mood_cloud';
    data: any; // 3D или 2D визуализация
  };
  
  // Краткая статистика
  quick_stats: {
    days_active: number;
    total_generations: number;
    favorite_genre: string;
    current_mood: string;
    avatar_age_days: number;
    last_active: string;
  };
  
  // Инсайты аватара
  avatar_insights: {
    message: string; // "Я заметил, что ты чаще всего грустишь по вечерам"
    confidence: number;
    actionable: boolean; // Можно ли что-то сделать с этим инсайтом
  }[];
  
  // Прогресс понимания
  understanding_progress: {
    overall: number; // 0-100% насколько аватар понимает пользователя
    by_category: {
      genre: number;
      mood: number;
      style: number;
      context: number;
    };
  };
}
UI Реализация:

tsx
// frontend/app/profile/page.tsx
export default function ProfileDashboard() {
  return (
    <div className="space-y-8">
      {/* Визуализация аватара */}
      <section className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-3xl p-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Твой музыкальный аватар
            </h2>
            <p className="text-purple-200">
              Аватар изучает тебя уже {stats.days_active} дней
            </p>
          </div>
          <div className="bg-white/10 rounded-full px-4 py-2">
            <span className="text-white">
              Понимание: {understanding}%
            </span>
          </div>
        </div>
        
        {/* 3D Визуализация вектора вкуса */}
        <AvatarVisualizer3D 
          vector={tasteVector}
          className="h-64 my-8"
        />
        
        {/* Текущий инсайт */}
        <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
          <p className="text-white">
            💭 {currentInsight}
          </p>
        </div>
      </section>

      {/* Быстрая статистика */}
      <QuickStats stats={stats} />
    </div>
  );
}
2. 📜 ИСТОРИЯ ВЗАИМОДЕЙСТВИЙ
typescript
interface InteractionHistory {
  // Фильтры
  filters: {
    date_range: [Date, Date];
    type: 'all' | 'generations' | 'modifications' | 'analyses';
    mood: string[];
    genre: string[];
  };
  
  // Записи
  entries: {
    id: string;
    timestamp: Date;
    type: 'generate' | 'modify' | 'analyze' | 'feedback';
    
    // Что было на входе
    input: {
      type: 'text' | 'voice' | 'audio' | 'midi';
      preview: string; // Текст промпта или название файла
      duration?: number;
    };
    
    // Что получилось
    output: {
      type: 'track' | 'stem' | 'modification';
      url: string;
      duration: number;
      genre?: string;
      mood?: string;
      tempo?: number;
    };
    
    // Реакция пользователя
    feedback?: {
      rating: 1-5;
      comment?: string;
      saved_to_library: boolean;
    };
    
    // Что аватар понял из этого
    avatar_learning: {
      insight: string; // "Тебе понравились струнные в этом треке"
      confidence: number;
    };
    
    // Контекст
    context: {
      mood_before?: string;
      time_of_day: string;
      location?: string;
      device: string;
    };
  }[];
}
UI Реализация:

tsx
const InteractionHistory = () => {
  return (
    <section className="bg-gray-800 rounded-2xl p-6">
      <h3 className="text-2xl font-bold mb-6">📜 История взаимодействий</h3>
      
      {/* Фильтры */}
      <div className="flex gap-4 mb-6">
        <DateRangePicker onChange={setDateRange} />
        <TypeFilter value={typeFilter} onChange={setTypeFilter} />
        <MoodFilter value={moodFilter} onChange={setMoodFilter} />
      </div>
      
      {/* Таймлайн */}
      <div className="space-y-4">
        {historyEntries.map(entry => (
          <InteractionCard key={entry.id} entry={entry} />
        ))}
      </div>
      
      {/* Кнопка загрузить еще */}
      {hasMore && (
        <button className="w-full mt-6 py-3 bg-gray-700 rounded-lg hover:bg-gray-600">
          Загрузить еще
        </button>
      )}
    </section>
  );
};

const InteractionCard = ({ entry }) => {
  return (
    <div className="bg-gray-700 rounded-xl p-4 hover:bg-gray-650 transition">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <TypeIcon type={entry.type} />
          <div>
            <div className="text-sm text-gray-400">
              {formatDate(entry.timestamp)}
            </div>
            <div className="font-medium">
              {entry.input.preview}
            </div>
          </div>
        </div>
        
        {entry.feedback && (
          <RatingStars rating={entry.feedback.rating} />
        )}
      </div>
      
      {/* Что аватар понял */}
      {entry.avatar_learning && (
        <div className="mt-3 bg-purple-900/30 rounded-lg p-3 text-sm">
          <span className="text-purple-300">🤖 Я понял: </span>
          {entry.avatar_learning.insight}
        </div>
      )}
      
      {/* Аудио плеер */}
      <AudioPlayer url={entry.output.url} className="mt-3" />
      
      {/* Действия */}
      <div className="flex gap-2 mt-3">
        <button className="text-sm text-gray-400 hover:text-white">
          🔄 Похожее
        </button>
        <button className="text-sm text-gray-400 hover:text-white">
          💾 В библиотеку
        </button>
        <button className="text-sm text-gray-400 hover:text-white">
          ℹ️ Подробнее
        </button>
      </div>
    </div>
  );
};
3. 📈 АНАЛИТИКА И СТАТИСТИКА
typescript
interface UserAnalytics {
  // Общая статистика
  totals: {
    generations: number;
    modifications: number;
    analyses: number;
    total_time_listened: number; // в секундах
    favorite_time_of_day: string;
    average_session_duration: number;
  };
  
  // По жанрам
  genre_distribution: {
    [genre: string]: {
      count: number;
      percentage: number;
      trend: 'up' | 'down' | 'stable';
      last_week_change: number;
    };
  };
  
  // По настроению
  mood_timeline: {
    date: Date;
    mood: string;
    intensity: number;
    trigger?: string;
    music_created: number;
  }[];
  
  // Временные паттерны
  time_patterns: {
    by_hour: { [hour: string]: number };
    by_weekday: { [day: string]: number };
    by_season: { [season: string]: number };
  };
  
  // Эволюция вкуса
  taste_evolution: {
    date: Date;
    genres: string[];
    complexity: number;
    energy_level: number;
    top_instruments: string[];
  }[];
  
  // Прогресс обучения аватара
  avatar_learning_progress: {
    date: Date;
    accuracy: number; // Насколько точно предсказывает выбор
    insights_generated: number;
    patterns_discovered: number;
  }[];
}
UI Реализация:

tsx
const AnalyticsDashboard = () => {
  return (
    <section className="bg-gray-800 rounded-2xl p-6">
      <h3 className="text-2xl font-bold mb-6">📊 Твоя музыкальная аналитика</h3>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <MetricCard
          label="Всего генераций"
          value={totals.generations}
          trend="+12%"
          icon="🎵"
        />
        <MetricCard
          label="Любимый жанр"
          value={topGenre}
          subtext={`${topGenrePercentage}%`}
          icon="🎸"
        />
        <MetricCard
          label="Активность"
          value={`${averagePerDay}/день`}
          subtext="Пик: вечер"
          icon="⏰"
        />
        <MetricCard
          label="Точность аватара"
          value={`${avatarAccuracy}%`}
          trend="+5%"
          icon="🤖"
        />
      </div>
      
      {/* Графики */}
      <Tabs defaultValue="genres">
        <TabsList>
          <TabsTrigger value="genres">Жанры</TabsTrigger>
          <TabsTrigger value="mood">Настроение</TabsTrigger>
          <TabsTrigger value="time">Время</TabsTrigger>
          <TabsTrigger value="evolution">Эволюция</TabsTrigger>
        </TabsList>
        
        <TabsContent value="genres">
          <GenreChart data={genreDistribution} />
        </TabsContent>
        
        <TabsContent value="mood">
          <MoodTimeline data={moodTimeline} />
        </TabsContent>
        
        <TabsContent value="time">
          <TimeHeatmap data={timePatterns} />
        </TabsContent>
        
        <TabsContent value="evolution">
          <EvolutionGraph data={tasteEvolution} />
        </TabsContent>
      </Tabs>
    </section>
  );
};
4. 🧠 ИНСАЙТЫ АВАТАРА
typescript
interface AvatarInsights {
  // Текущие наблюдения
  current_observations: {
    id: string;
    type: 'pattern' | 'preference' | 'change' | 'suggestion';
    title: string;
    description: string;
    confidence: number;
    evidence: string[]; // Конкретные примеры
    actionable: boolean;
    created_at: Date;
  }[];
  
  // Открытия о пользователе
  discoveries: {
    title: string;
    description: string;
    discovered_at: Date;
    confirmed_by_user: boolean;
    example_actions: string[];
  }[];
  
  // Предсказания
  predictions: {
    what: string;
    probability: number;
    based_on: string[];
    timeframe: string;
  }[];
  
  // Советы
  recommendations: {
    type: 'try' | 'avoid' | 'explore';
    title: string;
    description: string;
    action?: {
      label: string;
      handler: () => void;
    };
  }[];
}
UI Реализация:

tsx
const AvatarInsights = () => {
  return (
    <section className="bg-gray-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">🧠 Что я о тебе узнал</h3>
        <button className="text-sm text-purple-400 hover:text-purple-300">
          Обновить
        </button>
      </div>
      
      {/* Текущее наблюдение (выделенное) */}
      {currentInsight && (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl">✨</div>
            <div>
              <h4 className="font-bold text-lg mb-2">{currentInsight.title}</h4>
              <p className="text-purple-100 mb-4">{currentInsight.description}</p>
              <div className="flex gap-3">
                <button className="bg-white/20 rounded-lg px-4 py-2 hover:bg-white/30">
                  👍 Подтвердить
                </button>
                <button className="bg-white/10 rounded-lg px-4 py-2 hover:bg-white/20">
                  🤔 Не совсем
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Список наблюдений */}
      <div className="space-y-3">
        {observations.map(obs => (
          <InsightCard key={obs.id} insight={obs} />
        ))}
      </div>
      
      {/* Предсказания */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <h4 className="font-bold mb-4">🔮 Мои предсказания</h4>
        <div className="grid grid-cols-2 gap-4">
          {predictions.map(pred => (
            <PredictionCard prediction={pred} />
          ))}
        </div>
      </div>
    </section>
  );
};

const InsightCard = ({ insight }) => {
  const typeColors = {
    pattern: 'blue',
    preference: 'green',
    change: 'yellow',
    suggestion: 'purple'
  };
  
  return (
    <div className={`bg-gray-700 rounded-lg p-4 border-l-4 border-${typeColors[insight.type]}-500`}>
      <div className="flex items-start justify-between">
        <div>
          <h5 className="font-medium">{insight.title}</h5>
          <p className="text-sm text-gray-400 mt-1">{insight.description}</p>
          
          {/* Доказательства */}
          {insight.evidence && (
            <div className="mt-2 flex gap-2">
              {insight.evidence.map(ev => (
                <span className="text-xs bg-gray-600 rounded-full px-2 py-1">
                  {ev}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-400">
            Уверенность: {insight.confidence}%
          </div>
          {insight.actionable && (
            <button className="mt-2 text-xs text-purple-400 hover:text-purple-300">
              Действие →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
5. 🎨 БИБЛИОТЕКА СОЗДАННОГО
typescript
interface MusicLibrary {
  // Треки
  tracks: {
    id: string;
    title: string;
    created_at: Date;
    duration: number;
    genre: string;
    mood: string;
    prompt: string;
    tags: string[];
    plays: number;
    last_played?: Date;
    url: string;
    waveform: number[];
    
    // Метаданные аватара
    avatar_notes: {
      why_created: string;
      what_it_says_about_user: string;
      similar_to: string[];
    };
  }[];
  
  // Плейлисты
  playlists: {
    id: string;
    name: string;
    description: string;
    tracks: string[]; // ID треков
    created_at: Date;
    mood?: string;
    occasion?: string;
    cover_art?: string;
  }[];
  
  // Стемы/семплы
  stems: {
    id: string;
    type: 'vocal' | 'drums' | 'bass' | 'melody' | 'fx';
    source_track?: string;
    isolated_at: Date;
    duration: number;
    url: string;
  }[];
}
6. ⚙️ НАСТРОЙКИ АВАТАРА
typescript
interface AvatarSettings {
  // Параметры обучения
  learning_preferences: {
    learning_speed: 'slow' | 'normal' | 'fast'; // Как быстро обновлять профиль
    context_sensitivity: number; // 0-1 насколько учитывать контекст
    serendipity_level: number; // 0-1 уровень случайности
    forget_old_data: boolean; // Забывать старые предпочтения
  };
  
  // Источники данных
  data_sources: {
    voice_analysis: boolean;
    time_tracking: boolean;
    location_tracking: boolean;
    device_tracking: boolean;
    mood_input: boolean;
  };
  
  // Предпочтения генерации
  generation_defaults: {
    preferred_duration: 30 | 60 | 120 | 300; // секунды
    preferred_complexity: 1-5;
    default_instruments: string[];
    default_genres: string[];
    default_moods: string[];
  };
  
  // Приватность
  privacy: {
    share_anonymized_data: boolean;
    allow_insights_generation: boolean;
    save_interactions: boolean;
    auto_delete_history_days?: number;
  };
  
  // Уведомления
  notifications: {
    new_insight: boolean;
    weekly_report: boolean;
    suggestion_ready: boolean;
    avatar_milestone: boolean;
  };
}
UI Реализация:

tsx
const AvatarSettings = () => {
  return (
    <section className="bg-gray-800 rounded-2xl p-6">
      <h3 className="text-2xl font-bold mb-6">⚙️ Настройки аватара</h3>
      
      <Tabs defaultValue="learning">
        <TabsList className="mb-6">
          <TabsTrigger value="learning">Обучение</TabsTrigger>
          <TabsTrigger value="sources">Источники</TabsTrigger>
          <TabsTrigger value="generation">Генерация</TabsTrigger>
          <TabsTrigger value="privacy">Приватность</TabsTrigger>
        </TabsList>
        
        <TabsContent value="learning">
          <div className="space-y-4">
            <SliderSetting
              label="Скорость обучения"
              value={settings.learning_speed}
              min={0}
              max={1}
              step={0.1}
              description="Как быстро аватар обновляет свои представления о тебе"
            />
            
            <SliderSetting
              label="Чувствительность к контексту"
              value={settings.context_sensitivity}
              min={0}
              max={1}
              step={0.1}
              description="Насколько сильно время/настроение влияют на рекомендации"
            />
            
            <SliderSetting
              label="Уровень экспериментов"
              value={settings.serendipity_level}
              min={0}
              max={0.5}
              step={0.05}
              description="Как часто предлагать что-то новое (серендипити)"
            />
            
            <ToggleSetting
              label="Забывать старые предпочтения"
              value={settings.forget_old_data}
              description="Автоматически уделять меньше внимания действиям старше месяца"
            />
          </div>
        </TabsContent>
        
        {/* Другие вкладки */}
      </Tabs>
    </section>
  );
};
7. 🌱 ЭВОЛЮЦИЯ АВАТАРА (РОСТ И РАЗВИТИЕ)
typescript
interface AvatarEvolution {
  // Уровни развития
  level: number;
  experience: number;
  next_level_at: number;
  
  // Вехи развития
  milestones: {
    level: number;
    title: string;
    description: string;
    achieved_at?: Date;
    icon: string;
    unlocked_features: string[];
  }[];
  
  // Достижения
  achievements: {
    id: string;
    title: string;
    description: string;
    progress: number; // 0-100
    completed_at?: Date;
    icon: string;
    reward?: string;
  }[];
  
  // Статистика по периодам
  periods: {
    week: {
      date: Date;
      activity_level: number;
      new_discoveries: number;
      mood_variety: number;
      genre_exploration: number;
    }[];
  };
}
UI Реализация:

tsx
const AvatarEvolution = () => {
  return (
    <section className="bg-gray-800 rounded-2xl p-6">
      <h3 className="text-2xl font-bold mb-6">🌱 Эволюция аватара</h3>
      
      {/* Уровень и прогресс */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-amber-100 text-sm mb-1">Уровень {level}</div>
            <div className="text-3xl font-bold mb-2">{levelTitle}</div>
            <div className="text-amber-100">
              До следующего уровня: {nextLevelExp - experience} XP
            </div>
          </div>
          <div className="text-6xl">🌟</div>
        </div>
        
        <ProgressBar value={experience} max={nextLevelExp} className="mt-4" />
      </div>
      
      {/* Недавние вехи */}
      <h4 className="font-bold mb-4">🏆 Недавние достижения</h4>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {recentMilestones.map(m => (
          <MilestoneCard key={m.id} milestone={m} />
        ))}
      </div>
      
      {/* Прогресс по категориям */}
      <h4 className="font-bold mb-4">📊 Прогресс понимания</h4>
      <div className="space-y-3">
        <ProgressCategory 
          label="Понимание жанров"
          progress={genreProgress}
          icon="🎵"
        />
        <ProgressCategory 
          label="Эмоциональный интеллект"
          progress={moodProgress}
          icon="😊"
        />
        <ProgressCategory 
          label="Контекстная чувствительность"
          progress={contextProgress}
          icon="⏰"
        />
        <ProgressCategory 
          label="Креативность предложений"
          progress={creativityProgress}
          icon="💡"
        />
      </div>
    </section>
  );
};
8. 🔍 ИССЛЕДОВАТЕЛЬ ВЕКТОРОВ
typescript
interface VectorExplorer {
  // Текущий вектор
  current_vector: number[];
  
  // Визуализация
  visualization: {
    type: '2d' | '3d' | 'radar';
    data: any;
    
    // История движения вектора
    path: {
      point: [number, number, number];
      timestamp: Date;
      label?: string;
    }[];
    
    // Кластеры похожих пользователей
    clusters?: {
      id: string;
      center: [number, number, number];
      users_count: number;
      description: string;
    }[];
  };
  
  // Управление серендипити
  serendipity_mode: {
    enabled: boolean;
    strength: number;
    last_exploration?: {
      from: number[];
      to: number[];
      result: string;
      liked: boolean;
    };
  };
  
  // "Что если" сценарии
  what_if: {
    scenarios: {
      name: string;
      vector_modification: (v: number[]) => number[];
      description: string;
    }[];
    current_simulation?: number[];
  };
}
UI Реализация:

tsx
const VectorExplorer = () => {
  return (
    <section className="bg-gray-800 rounded-2xl p-6">
      <h3 className="text-2xl font-bold mb-6">🔍 Исследователь векторов</h3>
      
      <div className="grid grid-cols-2 gap-6">
        {/* 3D Визуализация */}
        <div className="bg-gray-900 rounded-xl p-4">
          <Vector3DVisualizer 
            vector={currentVector}
            history={vectorHistory}
            className="h-80"
          />
          
          <div className="flex justify-center gap-4 mt-4">
            <button className="text-sm bg-gray-700 px-3 py-1 rounded-full">
              🎯 Центрировать
            </button>
            <button className="text-sm bg-gray-700 px-3 py-1 rounded-full">
              🔄 Автовращение
            </button>
          </div>
        </div>
        
        {/* Управление */}
        <div className="space-y-4">
          <div className="bg-gray-900 rounded-xl p-4">
            <h4 className="font-bold mb-3">Серендипити режим</h4>
            <Toggle 
              label="Разрешить эксперименты"
              value={serendipityEnabled}
              onChange={setSerendipityEnabled}
            />
            <Slider 
              label="Сила экспериментов"
              value={serendipityStrength}
              min={0}
              max={0.5}
              step={0.05}
              disabled={!serendipityEnabled}
            />
            
            {lastExploration && (
              <div className="mt-4 bg-purple-900/30 rounded-lg p-3">
                <p className="text-sm mb-2">Последний эксперимент:</p>
                <p className="text-xs text-gray-300">{lastExploration.result}</p>
                <div className="flex gap-2 mt-2">
                  <button className="text-xs bg-green-600 px-2 py-1 rounded">
                    👍 Понравилось
                  </button>
                  <button className="text-xs bg-red-600 px-2 py-1 rounded">
                    👎 Не очень
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-gray-900 rounded-xl p-4">
            <h4 className="font-bold mb-3">Что если...</h4>
            {whatIfScenarios.map(scenario => (
              <button
                key={scenario.name}
                className="w-full text-left bg-gray-800 hover:bg-gray-700 rounded-lg p-3 mb-2"
                onClick={() => simulateScenario(scenario)}
              >
                <div className="font-medium">{scenario.name}</div>
                <div className="text-xs text-gray-400">{scenario.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
📱 ПОЛНАЯ СТРУКТУРА СТРАНИЦЫ ЛИЧНОГО КАБИНЕТА
tsx
// frontend/app/profile/page.tsx
export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Шапка профиля */}
      <ProfileHeader user={user} />
      
      {/* Навигация по вкладкам */}
      <Tabs defaultValue="dashboard" className="container mx-auto px-4 py-8">
        <TabsList className="mb-8">
          <TabsTrigger value="dashboard">🎭 Обзор</TabsTrigger>
          <TabsTrigger value="history">📜 История</TabsTrigger>
          <TabsTrigger value="analytics">📊 Аналитика</TabsTrigger>
          <TabsTrigger value="insights">🧠 Инсайты</TabsTrigger>
          <TabsTrigger value="library">🎨 Библиотека</TabsTrigger>
          <TabsTrigger value="evolution">🌱 Эволюция</TabsTrigger>
          <TabsTrigger value="explorer">🔍 Исследователь</TabsTrigger>
          <TabsTrigger value="settings">⚙️ Настройки</TabsTrigger>
        </TabsList>
        
        {/* Контент вкладок */}
        <TabsContent value="dashboard">
          <AvatarDashboard />
        </TabsContent>
        
        <TabsContent value="history">
          <InteractionHistory />
        </TabsContent>
        
        <TabsContent value="analytics">
          <AnalyticsDashboard />
        </TabsContent>
        
        <TabsContent value="insights">
          <AvatarInsights />
        </TabsContent>
        
        <TabsContent value="library">
          <MusicLibrary />
        </TabsContent>
        
        <TabsContent value="evolution">
          <AvatarEvolution />
        </TabsContent>
        
        <TabsContent value="explorer">
          <VectorExplorer />
        </TabsContent>
        
        <TabsContent value="settings">
          <AvatarSettings />
          <UserSettings /> {/* Имя, почта, пароль */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
🎯 КЛЮЧЕВЫЕ ИНСАЙТЫ ДЛЯ ПОЛЬЗОВАТЕЛЯ
Каждый раздел должен отвечать на вопросы пользователя:

Раздел	Что пользователь узнает
Обзор	"Кто я в музыке сегодня?"
История	"Что я создавал и как реагировал?"
Аналитика	"Какие у меня паттерны и привычки?"
Инсайты	"Что аватар понял обо мне нового?"
Библиотека	"Что из созданного мне действительно нравится?"
Эволюция	"Как я расту как музыкант/слушатель?"
Исследователь	"Что если я попробую что-то другое?"
Настройки	"Как я хочу, чтобы аватар меня понимал?"
Главная магия личного кабинета — пользователь видит не просто статистику, а историю своих отношений с музыкой, рассказанную аватаром, который становится все более понимающим компаньоном.