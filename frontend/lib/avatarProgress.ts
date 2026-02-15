/** Общая логика уровня и прогресса аватара (главная страница + личный кабинет). */
const ACTIONS_PER_LEVEL = 5;

export function getAvatarLevelProgress(totalActions: number): {
  level: number;
  progressPercent: number;
  actionsInCurrentLevel: number;
  actionsToNextLevel: number;
} {
  const total = Math.max(0, totalActions);
  const level = Math.floor(total / ACTIONS_PER_LEVEL) + 1;
  const actionsInCurrentLevel = total % ACTIONS_PER_LEVEL;
  const progressPercent = (actionsInCurrentLevel / ACTIONS_PER_LEVEL) * 100;
  const actionsToNextLevel = ACTIONS_PER_LEVEL - actionsInCurrentLevel;
  return {
    level,
    progressPercent,
    actionsInCurrentLevel,
    actionsToNextLevel,
  };
}
