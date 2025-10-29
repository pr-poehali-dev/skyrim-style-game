import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Position {
  x: number;
  y: number;
}

interface Character {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const characters: Character[] = [
  { id: 'warrior', name: 'Воин', icon: 'Sword', color: 'text-orange-500' },
  { id: 'mage', name: 'Маг', icon: 'Wand2', color: 'text-purple-500' },
  { id: 'rogue', name: 'Вор', icon: 'UserCircle', color: 'text-green-500' }
];

const GRID_SIZE = 15;
const CELL_SIZE = 40;

const obstacles = [
  { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 },
  { x: 8, y: 5 }, { x: 9, y: 5 }, { x: 10, y: 5 },
  { x: 2, y: 8 }, { x: 3, y: 8 },
  { x: 11, y: 9 }, { x: 12, y: 9 }, { x: 13, y: 9 },
  { x: 6, y: 11 }, { x: 7, y: 11 }
];

const treasures = [
  { x: 13, y: 2, collected: false },
  { x: 1, y: 12, collected: false },
  { x: 12, y: 13, collected: false }
];

export default function GameDemo() {
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);
  const [position, setPosition] = useState<Position>({ x: 1, y: 1 });
  const [collectedTreasures, setCollectedTreasures] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const isObstacle = (x: number, y: number) => {
    return obstacles.some(obs => obs.x === x && obs.y === y);
  };

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
      return { x: newX, y: newY };
    });
  }, [isPlaying, checkTreasure]);

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
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, moveCharacter]);

  const startGame = (char: Character) => {
    setSelectedChar(char);
    setPosition({ x: 1, y: 1 });
    setCollectedTreasures(new Set());
    setScore(0);
    setIsPlaying(true);
  };

  const resetGame = () => {
    setIsPlaying(false);
    setSelectedChar(null);
    setPosition({ x: 1, y: 1 });
    setCollectedTreasures(new Set());
    setScore(0);
  };

  if (!isPlaying && !selectedChar) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-2xl font-cinzel text-center">Выберите персонажа</CardTitle>
          <CardDescription className="text-center">Управление: WASD или стрелки. Соберите все сокровища!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {characters.map((char) => (
              <Button
                key={char.id}
                variant="outline"
                className="h-32 flex flex-col gap-3 hover-scale border-2 hover:border-primary"
                onClick={() => startGame(char)}
              >
                <Icon name={char.icon as any} size={40} className={char.color} />
                <span className="font-cinzel text-lg">{char.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
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
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">Очки: {score}</div>
            <div className="text-sm text-muted-foreground">
              Сокровищ: {collectedTreasures.size}/{treasures.length}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
          className="relative mx-auto border-2 border-border rounded-lg overflow-hidden"
          style={{ 
            width: GRID_SIZE * CELL_SIZE,
            height: GRID_SIZE * CELL_SIZE,
            background: 'radial-gradient(circle at 30% 30%, hsl(var(--muted)) 0%, hsl(var(--background)) 100%)'
          }}
        >
          <div className="absolute inset-0 grid" style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`
          }}>
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => (
              <div key={idx} className="border border-border/20"></div>
            ))}
          </div>

          {obstacles.map((obs, idx) => (
            <div
              key={`obs-${idx}`}
              className="absolute bg-muted border-2 border-border rounded flex items-center justify-center transition-all"
              style={{
                left: obs.x * CELL_SIZE,
                top: obs.y * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE
              }}
            >
              <Icon name="Mountain" size={20} className="text-muted-foreground" />
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
            <li>• Собирайте жёлтые сокровища (💎)</li>
            <li>• Обходите препятствия (⛰️)</li>
            <li>• Соберите все 3 сокровища для победы!</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
