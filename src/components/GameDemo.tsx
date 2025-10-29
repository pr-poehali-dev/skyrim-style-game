import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import CharacterCreator from './CharacterCreator';

interface Position {
  x: number;
  y: number;
}

interface Character {
  id: string;
  name: string;
  icon: string;
  color: string;
  race?: string;
  gender?: string;
  speed?: number;
  damage?: number;
  special?: string;
}

const characters: Character[] = [
  { id: 'warrior', name: 'Воин', icon: 'Sword', color: 'text-orange-500' },
  { id: 'mage', name: 'Маг', icon: 'Wand2', color: 'text-purple-500' },
  { id: 'rogue', name: 'Вор', icon: 'UserCircle', color: 'text-green-500' }
];

const GRID_SIZE = 15;
const CELL_SIZE = 40;

const obstacles = [
  { x: 3, y: 3, type: 'tree' }, { x: 4, y: 3, type: 'tree' }, { x: 5, y: 3, type: 'rock' },
  { x: 8, y: 5, type: 'tree' }, { x: 9, y: 5, type: 'tree' }, { x: 10, y: 5, type: 'tree' },
  { x: 2, y: 8, type: 'rock' }, { x: 3, y: 8, type: 'tree' },
  { x: 11, y: 9, type: 'tree' }, { x: 12, y: 9, type: 'rock' }, { x: 13, y: 9, type: 'tree' },
  { x: 6, y: 11, type: 'tree' }, { x: 7, y: 11, type: 'rock' }
];

const traps = [
  { x: 5, y: 7 },
  { x: 10, y: 3 },
  { x: 7, y: 13 },
  { x: 2, y: 5 }
];

const treasures = [
  { x: 13, y: 2, collected: false },
  { x: 1, y: 12, collected: false },
  { x: 12, y: 13, collected: false }
];

const animals = [
  { x: 6, y: 4, type: 'deer', direction: 1 },
  { x: 4, y: 10, type: 'bird', direction: -1 }
];

export default function GameDemo() {
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);
  const [position, setPosition] = useState<Position>({ x: 1, y: 1 });
  const [collectedTreasures, setCollectedTreasures] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [maxHealth, setMaxHealth] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animalPositions, setAnimalPositions] = useState(animals);
  const [showTrapWarning, setShowTrapWarning] = useState(false);
  const [showCharCreator, setShowCharCreator] = useState(true);
  const [specialCooldown, setSpecialCooldown] = useState(0);
  const [mana, setMana] = useState(100);

  const isObstacle = (x: number, y: number) => {
    return obstacles.some(obs => obs.x === x && obs.y === y);
  };

  const isTrap = (x: number, y: number) => {
    return traps.some(trap => trap.x === x && trap.y === y);
  };

  const checkTrap = useCallback((x: number, y: number) => {
    if (isTrap(x, y)) {
      setHealth(prev => Math.max(0, prev - 20));
      setShowTrapWarning(true);
      setTimeout(() => setShowTrapWarning(false), 2000);
    }
  }, []);

  const checkTreasure = useCallback((x: number, y: number) => {
    const treasureKey = `${x}-${y}`;
    if (!collectedTreasures.has(treasureKey)) {
      const treasure = treasures.find(t => t.x === x && t.y === y);
      if (treasure) {
        setCollectedTreasures(prev => new Set(prev).add(treasureKey));
        setScore(prev => prev + 100);
      }
    }
  }, [collectedTreasures]);

  const moveCharacter = useCallback((dx: number, dy: number) => {
    if (!isPlaying) return;
    
    setPosition(prev => {
      const newX = Math.max(0, Math.min(GRID_SIZE - 1, prev.x + dx));
      const newY = Math.max(0, Math.min(GRID_SIZE - 1, prev.y + dy));
      
      if (isObstacle(newX, newY)) {
        return prev;
      }
      
      checkTreasure(newX, newY);
      checkTrap(newX, newY);
      return { x: newX, y: newY };
    });
  }, [isPlaying, checkTreasure, checkTrap]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          moveCharacter(0, -1);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          moveCharacter(0, 1);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          moveCharacter(-1, 0);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          moveCharacter(1, 0);
          break;
        case ' ':
          e.preventDefault();
          useSpecialAbility();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, moveCharacter, useSpecialAbility]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setAnimalPositions(prev => prev.map(animal => {
        const newX = animal.x + animal.direction;
        if (newX < 1 || newX > GRID_SIZE - 2) {
          return { ...animal, direction: -animal.direction };
        }
        if (isObstacle(newX, animal.y)) {
          return { ...animal, direction: -animal.direction };
        }
        return { ...animal, x: newX };
      }));
    }, 1500);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const startGame = (char: Character) => {
    const baseHealth = char.id === 'warrior' ? 150 : char.id === 'mage' ? 80 : 100;
    setSelectedChar(char);
    setPosition({ x: 1, y: 1 });
    setCollectedTreasures(new Set());
    setScore(0);
    setHealth(baseHealth);
    setMaxHealth(baseHealth);
    setMana(char.id === 'mage' ? 150 : 50);
    setAnimalPositions(animals);
    setIsPlaying(true);
  };
  
  const useSpecialAbility = useCallback(() => {
    if (specialCooldown > 0 || !selectedChar) return;
    
    if (selectedChar.id === 'warrior') {
      setHealth(prev => Math.min(maxHealth, prev + 30));
      setScore(prev => prev + 50);
      setSpecialCooldown(5);
    } else if (selectedChar.id === 'mage' && mana >= 30) {
      const treasureNearby = treasures.find(t => 
        Math.abs(t.x - position.x) <= 3 && Math.abs(t.y - position.y) <= 3
      );
      if (treasureNearby) {
        setPosition({ x: treasureNearby.x, y: treasureNearby.y });
        checkTreasure(treasureNearby.x, treasureNearby.y);
      }
      setMana(prev => prev - 30);
      setSpecialCooldown(3);
    } else if (selectedChar.id === 'rogue') {
      const newX = Math.min(GRID_SIZE - 1, position.x + 2);
      const newY = Math.min(GRID_SIZE - 1, position.y + 2);
      if (!isObstacle(newX, newY)) {
        setPosition({ x: newX, y: newY });
        checkTreasure(newX, newY);
      }
      setSpecialCooldown(4);
    }
  }, [specialCooldown, selectedChar, mana, position, maxHealth, checkTreasure]);
  
  useEffect(() => {
    if (specialCooldown > 0) {
      const timer = setTimeout(() => setSpecialCooldown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [specialCooldown]);
  
  useEffect(() => {
    if (selectedChar?.id === 'mage' && mana < 150) {
      const timer = setTimeout(() => setMana(prev => Math.min(150, prev + 5)), 1000);
      return () => clearTimeout(timer);
    }
  }, [mana, selectedChar]);

  const resetGame = () => {
    setIsPlaying(false);
    setSelectedChar(null);
    setPosition({ x: 1, y: 1 });
    setCollectedTreasures(new Set());
    setScore(0);
    setHealth(100);
    setShowCharCreator(true);
  };

  useEffect(() => {
    if (health <= 0) {
      setTimeout(() => {
        alert('Вы погибли! Попробуйте снова.');
        resetGame();
      }, 500);
    }
  }, [health]);

  if (showCharCreator && !isPlaying) {
    return <CharacterCreator onComplete={(charData) => {
      const fullChar: Character = {
        id: charData.classType,
        name: charData.name,
        icon: charData.icon,
        color: charData.color,
        race: charData.race,
        gender: charData.gender
      };
      setShowCharCreator(false);
      startGame(fullChar);
    }} />;
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-cinzel flex items-center gap-2">
              <Icon name={selectedChar?.icon as any} size={24} className={selectedChar?.color} />
              {selectedChar?.name}
            </CardTitle>
            <CardDescription>Управление: WASD или стрелки</CardDescription>
          </div>
          <div className="text-right space-y-2">
            <div className="text-2xl font-bold text-primary">Очки: {score}</div>
            <div className="text-sm text-muted-foreground">
              Сокровищ: {collectedTreasures.size}/{treasures.length}
            </div>
            <div className="flex items-center gap-2 justify-end">
              <Icon name="Heart" size={16} className={health > (maxHealth * 0.3) ? "text-red-500" : "text-red-700 animate-pulse"} />
              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    health > (maxHealth * 0.6) ? 'bg-green-500' : health > (maxHealth * 0.3) ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${(health / maxHealth) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-bold">{health}/{maxHealth}</span>
            </div>
            {selectedChar?.id === 'mage' && (
              <div className="flex items-center gap-2 justify-end">
                <Icon name="Sparkles" size={16} className="text-blue-500" />
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300" 
                       style={{ width: `${(mana / 150) * 100}%` }}></div>
                </div>
                <span className="text-sm font-bold">{mana}/150</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showTrapWarning && (
          <div className="bg-red-500/20 border-2 border-red-500 rounded-lg p-4 mb-4 animate-pulse">
            <div className="flex items-center gap-2 text-red-500 font-bold">
              <Icon name="AlertTriangle" size={24} />
              <span>Вы попали в ловушку! -20 HP</span>
            </div>
          </div>
        )}

        <div 
          className="relative mx-auto border-2 border-border rounded-lg overflow-hidden shadow-2xl"
          style={{ 
            width: GRID_SIZE * CELL_SIZE,
            height: GRID_SIZE * CELL_SIZE,
            background: 'linear-gradient(135deg, #1a4d2e 0%, #2d5016 50%, #1a3a1a 100%)'
          }}
        >
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(100, 180, 100, 0.1) 2px, rgba(100, 180, 100, 0.1) 4px),
                             repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(100, 180, 100, 0.1) 2px, rgba(100, 180, 100, 0.1) 4px)`
          }}></div>
          
          <div className="absolute inset-0" style={{ 
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(50, 205, 50, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, rgba(34, 139, 34, 0.1) 0%, transparent 50%)`
          }}></div>

          {obstacles.map((obs, idx) => (
            <div
              key={`obs-${idx}`}
              className="absolute transition-all"
              style={{
                left: obs.x * CELL_SIZE,
                top: obs.y * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE,
                zIndex: obs.type === 'tree' ? 5 : 1
              }}
            >
              {obs.type === 'tree' ? (
                <div className="relative w-full h-full flex items-end justify-center">
                  <div className="absolute bottom-3 w-2 h-6 bg-gradient-to-b from-amber-900 to-amber-950 rounded-sm"></div>
                  <div className="absolute bottom-6 w-8 h-10 bg-gradient-to-b from-green-700 to-green-900 rounded-full shadow-lg" style={{
                    clipPath: 'polygon(50% 0%, 0% 60%, 20% 60%, 0% 100%, 40% 100%, 50% 80%, 60% 100%, 100% 100%, 80% 60%, 100% 60%)'
                  }}></div>
                  <div className="absolute bottom-8 w-6 h-8 bg-gradient-to-b from-green-600 to-green-800 rounded-full opacity-80" style={{
                    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
                  }}></div>
                  <div className="absolute -bottom-1 w-10 h-3 bg-black/20 rounded-full blur-sm"></div>
                </div>
              ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="w-8 h-7 bg-gradient-to-br from-gray-500 to-gray-700 rounded-lg shadow-lg border-2 border-gray-800/50" style={{
                    clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
                  }}></div>
                  <div className="absolute top-1 left-2 w-2 h-2 bg-gray-400/50 rounded-full"></div>
                  <div className="absolute -bottom-1 w-10 h-2 bg-black/30 rounded-full blur-sm"></div>
                </div>
              )}
            </div>
          ))}

          {traps.map((trap, idx) => {
            const isPlayerOnTrap = position.x === trap.x && position.y === trap.y;
            return (
              <div
                key={`trap-${idx}`}
                className="absolute flex items-center justify-center"
                style={{
                  left: trap.x * CELL_SIZE,
                  top: trap.y * CELL_SIZE,
                  width: CELL_SIZE,
                  height: CELL_SIZE
                }}
              >
                <div className={`w-6 h-6 rounded-sm transition-all ${
                  isPlayerOnTrap ? 'bg-red-600 scale-125' : 'bg-red-900/40'
                } border border-red-700/50`} style={{
                  boxShadow: isPlayerOnTrap ? '0 0 20px rgba(239, 68, 68, 0.8)' : 'none'
                }}>
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon name="Zap" size={12} className="text-red-300" />
                  </div>
                </div>
              </div>
            );
          })}

          {animalPositions.map((animal, idx) => (
            <div
              key={`animal-${idx}`}
              className="absolute flex items-center justify-center transition-all duration-1000 ease-linear"
              style={{
                left: animal.x * CELL_SIZE,
                top: animal.y * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE,
                transform: animal.direction < 0 ? 'scaleX(-1)' : 'scaleX(1)'
              }}
            >
              {animal.type === 'deer' ? (
                <div className="text-2xl animate-bounce" style={{ animationDuration: '2s' }}>🦌</div>
              ) : (
                <div className="text-xl animate-pulse">🦅</div>
              )}
            </div>
          ))}

          {treasures.map((treasure, idx) => {
            const key = `${treasure.x}-${treasure.y}`;
            if (collectedTreasures.has(key)) return null;
            
            return (
              <div
                key={`treasure-${idx}`}
                className="absolute flex items-center justify-center animate-pulse"
                style={{
                  left: treasure.x * CELL_SIZE,
                  top: treasure.y * CELL_SIZE,
                  width: CELL_SIZE,
                  height: CELL_SIZE
                }}
              >
                <Icon name="Gem" size={24} className="text-yellow-500" />
              </div>
            );
          })}

          <div
            className="absolute flex items-center justify-center transition-all duration-100 z-10"
            style={{
              left: position.x * CELL_SIZE,
              top: position.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE
            }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-md"></div>
              <Icon name={selectedChar?.icon as any} size={32} className={`${selectedChar?.color} relative z-10`} />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-muted/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Icon name="User" size={20} />
                Карточка персонажа
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Имя:</span><span className="font-bold">{selectedChar?.name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Раса:</span><span className="font-bold">{selectedChar?.race || 'Не указано'}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Пол:</span><span className="font-bold">{selectedChar?.gender === 'male' ? 'Мужской' : selectedChar?.gender === 'female' ? 'Женский' : 'Не указано'}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Класс:</span><span className="font-bold">{selectedChar?.name}</span></div>
            </CardContent>
          </Card>
          
          <Card className="bg-muted/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Icon name="Zap" size={20} />
                Способность (Space)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={useSpecialAbility} 
                disabled={specialCooldown > 0 || (selectedChar?.id === 'mage' && mana < 30)}
                className="w-full"
                variant={specialCooldown > 0 ? "secondary" : "default"}
              >
                {specialCooldown > 0 ? (
                  <span>Перезарядка: {specialCooldown}с</span>
                ) : (
                  <>
                    {selectedChar?.id === 'warrior' && <><Icon name="Heart" size={16} className="mr-2" />Боевой клич (+30 HP)</>}
                    {selectedChar?.id === 'mage' && <><Icon name="Sparkles" size={16} className="mr-2" />Телепорт к сокровищу</>}
                    {selectedChar?.id === 'rogue' && <><Icon name="Zap" size={16} className="mr-2" />Рывок вперёд</>}
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {selectedChar?.id === 'warrior' && 'Восстанавливает здоровье и даёт очки'}
                {selectedChar?.id === 'mage' && `Телепортирует к ближайшему сокровищу (30 маны)`}
                {selectedChar?.id === 'rogue' && 'Быстрый рывок через препятствия'}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={resetGame} className="hover-scale">
            <Icon name="RotateCcw" size={20} className="mr-2" />
            Выбрать другого
          </Button>
          {collectedTreasures.size === treasures.length && (
            <div className="flex items-center gap-2 text-primary font-bold animate-scale-in">
              <Icon name="Trophy" size={24} />
              <span>Победа! Все сокровища собраны!</span>
            </div>
          )}
        </div>

        <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Icon name="Info" size={16} className="text-primary" />
            <span className="font-bold">Подсказки:</span>
          </div>
          <ul className="space-y-1 text-muted-foreground ml-6">
            <li>• Используйте WASD или стрелки для движения</li>
            <li>• Нажмите Space для использования особой способности</li>
            <li>• Собирайте жёлтые сокровища (💎) за 100 очков</li>
            <li>• Обходите деревья 🌲 и камни 🪨</li>
            <li>• Избегайте красные ловушки ⚡ (-20 HP)</li>
            <li>• Наблюдайте за животными 🦌🦅</li>
            <li>• Воин: больше здоровья (150 HP)</li>
            <li>• Маг: меньше здоровья (80 HP), но есть мана</li>
            <li>• Вор: стандартное здоровье (100 HP)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}