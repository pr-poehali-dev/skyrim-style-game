import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface WorldMapProps {
  open: boolean;
  onClose: () => void;
}

const locations = [
  { 
    id: 'whiterun', 
    name: 'Вайтран', 
    x: 45, 
    y: 35, 
    icon: 'Castle',
    description: 'Столица Скайрима, город торговцев и воинов',
    quests: 3,
    level: 1
  },
  { 
    id: 'frostcave', 
    name: 'Морозная пещера', 
    x: 70, 
    y: 20, 
    icon: 'Mountain',
    description: 'Логово древнего ледяного дракона',
    quests: 2,
    level: 15
  },
  { 
    id: 'darkforest', 
    name: 'Тёмный лес', 
    x: 25, 
    y: 60, 
    icon: 'Trees',
    description: 'Таинственный лес, полный древней магии',
    quests: 4,
    level: 8
  },
  { 
    id: 'dwemer', 
    name: 'Руины Двемеров', 
    x: 65, 
    y: 70, 
    icon: 'Landmark',
    description: 'Забытые подземелья древней цивилизации',
    quests: 5,
    level: 12
  },
  { 
    id: 'tower', 
    name: 'Башня Мага', 
    x: 80, 
    y: 50, 
    icon: 'Sparkles',
    description: 'Академия магии и древних знаний',
    quests: 3,
    level: 10
  }
];

export default function WorldMap({ open, onClose }: WorldMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<typeof locations[0] | null>(null);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-cinzel">Карта мира Скайрим</DialogTitle>
          <DialogDescription>Выберите локацию для путешествия</DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative border-4 border-amber-900 rounded-lg overflow-hidden shadow-2xl" style={{
            background: 'linear-gradient(135deg, #f4e4c1 0%, #e8d4a8 50%, #d4c4a0 100%)',
            minHeight: '500px'
          }}>
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(139, 69, 19, 0.1) 10px, rgba(139, 69, 19, 0.1) 11px),
                               repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(139, 69, 19, 0.1) 10px, rgba(139, 69, 19, 0.1) 11px)`
            }}></div>

            <div className="absolute top-4 left-4 right-4 text-center">
              <h3 className="text-2xl font-cinzel text-amber-900 border-b-2 border-amber-900 pb-2 inline-block px-6" style={{
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
              }}>
                TERRA SKYRIM
              </h3>
            </div>

            <svg className="absolute inset-0 w-full h-full" style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))' }}>
              <path d="M 100 150 Q 150 100, 250 120 T 400 180 Q 350 250, 300 300 T 150 280 Q 120 220, 100 150 Z" 
                    fill="#8B7355" 
                    stroke="#5D4E37" 
                    strokeWidth="3" 
                    opacity="0.3" />
              <path d="M 200 200 L 250 180 L 280 220 L 300 250 L 270 280 L 220 270 Z" 
                    fill="#6B5D4F" 
                    stroke="#5D4E37" 
                    strokeWidth="2" 
                    opacity="0.2" />
              <path d="M 150 350 Q 200 320, 280 340 T 380 400 L 350 450 Q 250 440, 180 420 T 150 350 Z" 
                    fill="#7A6A4F" 
                    stroke="#5D4E37" 
                    strokeWidth="2" 
                    opacity="0.25" />
            </svg>

            {locations.map((loc) => (
              <div
                key={loc.id}
                className="absolute cursor-pointer transition-all hover:scale-110 group"
                style={{ left: `${loc.x}%`, top: `${loc.y}%`, transform: 'translate(-50%, -50%)' }}
                onClick={() => setSelectedLocation(loc)}
              >
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    selectedLocation?.id === loc.id 
                      ? 'bg-primary scale-125 shadow-lg' 
                      : 'bg-amber-900 group-hover:bg-amber-800'
                  } border-4 border-amber-700 shadow-xl`}>
                    <Icon name={loc.icon as any} size={24} className="text-amber-100" />
                  </div>
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <div className="bg-amber-900 text-amber-100 px-2 py-1 rounded text-xs font-bold shadow-lg border border-amber-700">
                      {loc.name}
                    </div>
                  </div>
                  <div className="absolute top-0 left-0 w-full h-full animate-ping opacity-0 group-hover:opacity-30">
                    <div className="w-12 h-12 rounded-full bg-primary"></div>
                  </div>
                </div>
              </div>
            ))}

            <div className="absolute bottom-4 right-4 bg-amber-900/80 border-2 border-amber-700 rounded px-3 py-2 text-amber-100 text-xs">
              <Icon name="Compass" size={16} className="inline mr-1" />
              <span className="font-bold">Легенда карты</span>
            </div>
          </div>

          <div>
            {selectedLocation ? (
              <Card className="border-2 border-primary">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon name={selectedLocation.icon as any} size={28} className="text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-cinzel">{selectedLocation.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Icon name="Target" size={14} />
                        Рекомендуемый уровень: {selectedLocation.level}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{selectedLocation.description}</p>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="Scroll" size={16} className="text-primary" />
                    <span className="font-bold">Доступно квестов:</span>
                    <span className="text-primary">{selectedLocation.quests}</span>
                  </div>

                  <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
                    <div className="font-bold text-sm flex items-center gap-2">
                      <Icon name="MapPin" size={16} className="text-primary" />
                      Особенности локации:
                    </div>
                    {selectedLocation.id === 'whiterun' && (
                      <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                        <li>• Магазины оружия и брони</li>
                        <li>• Гильдия воинов</li>
                        <li>• Безопасная зона для отдыха</li>
                      </ul>
                    )}
                    {selectedLocation.id === 'frostcave' && (
                      <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                        <li>• Опасно! Требуется группа</li>
                        <li>• Ледяной дракон (босс)</li>
                        <li>• Легендарная добыча</li>
                      </ul>
                    )}
                    {selectedLocation.id === 'darkforest' && (
                      <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                        <li>• Волки и дикие звери</li>
                        <li>• Алхимические ингредиенты</li>
                        <li>• Древние руны</li>
                      </ul>
                    )}
                    {selectedLocation.id === 'dwemer' && (
                      <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                        <li>• Древние механизмы</li>
                        <li>• Технологические артефакты</li>
                        <li>• Лабиринты и ловушки</li>
                      </ul>
                    )}
                    {selectedLocation.id === 'tower' && (
                      <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                        <li>• Обучение магии</li>
                        <li>• Библиотека заклинаний</li>
                        <li>• Магические артефакты</li>
                      </ul>
                    )}
                  </div>

                  <Button className="w-full hover-scale" size="lg">
                    <Icon name="MapPin" size={20} className="mr-2" />
                    Отправиться в {selectedLocation.name}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="h-full flex items-center justify-center border-2 border-dashed border-border rounded-lg p-8 text-center">
                <div>
                  <Icon name="Map" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Выберите локацию на карте, чтобы узнать подробности
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
