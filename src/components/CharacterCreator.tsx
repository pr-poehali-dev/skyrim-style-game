import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Icon from '@/components/ui/icon';

interface CharacterData {
  name: string;
  race: string;
  gender: string;
  classType: string;
}

interface CharacterCreatorProps {
  onComplete: (char: CharacterData & { icon: string; color: string }) => void;
}

const races = [
  { id: 'nord', name: 'Норд', bonus: '+10 к силе', icon: 'Snowflake' },
  { id: 'elf', name: 'Эльф', bonus: '+10 к магии', icon: 'Sparkles' },
  { id: 'argonian', name: 'Аргонианец', bonus: '+10 к ловкости', icon: 'Flame' }
];

const classes = [
  { id: 'warrior', name: 'Воин', icon: 'Sword', color: 'text-orange-500', description: 'Мастер ближнего боя' },
  { id: 'mage', name: 'Маг', icon: 'Wand2', color: 'text-purple-500', description: 'Повелитель стихий' },
  { id: 'rogue', name: 'Вор', icon: 'UserCircle', color: 'text-green-500', description: 'Мастер скрытности' }
];

export default function CharacterCreator({ onComplete }: CharacterCreatorProps) {
  const [step, setStep] = useState(1);
  const [character, setCharacter] = useState<CharacterData>({
    name: '',
    race: '',
    gender: '',
    classType: ''
  });

  const handleComplete = () => {
    const selectedClass = classes.find(c => c.id === character.classType);
    if (character.name && character.race && character.gender && selectedClass) {
      onComplete({
        ...character,
        icon: selectedClass.icon,
        color: selectedClass.color
      });
    }
  };

  const isStepComplete = () => {
    switch (step) {
      case 1: return character.name.length > 0;
      case 2: return character.race.length > 0;
      case 3: return character.gender.length > 0;
      case 4: return character.classType.length > 0;
      default: return false;
    }
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="text-2xl font-cinzel text-center">Создание персонажа</CardTitle>
        <CardDescription className="text-center">Шаг {step} из 4</CardDescription>
        <div className="flex gap-2 mt-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`flex-1 h-2 rounded-full transition-all ${
              i <= step ? 'bg-primary' : 'bg-muted'
            }`}></div>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div className="text-center mb-6">
              <Icon name="User" size={48} className="text-primary mx-auto mb-3" />
              <h3 className="text-xl font-bold font-cinzel">Как вас зовут, путник?</h3>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Имя персонажа</Label>
              <Input
                id="name"
                placeholder="Введите имя героя..."
                value={character.name}
                onChange={(e) => setCharacter({ ...character, name: e.target.value })}
                className="text-lg"
                autoFocus
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div className="text-center mb-6">
              <Icon name="Users" size={48} className="text-primary mx-auto mb-3" />
              <h3 className="text-xl font-bold font-cinzel">Выберите расу</h3>
            </div>
            <RadioGroup value={character.race} onValueChange={(val) => setCharacter({ ...character, race: val })}>
              <div className="space-y-3">
                {races.map((race) => (
                  <div key={race.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={race.id} id={race.id} />
                    <Label htmlFor={race.id} className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between p-3 border-2 rounded-lg hover:border-primary transition-colors">
                        <div className="flex items-center gap-3">
                          <Icon name={race.icon as any} size={24} className="text-primary" />
                          <div>
                            <div className="font-bold">{race.name}</div>
                            <div className="text-sm text-muted-foreground">{race.bonus}</div>
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div className="text-center mb-6">
              <Icon name="UserCircle" size={48} className="text-primary mx-auto mb-3" />
              <h3 className="text-xl font-bold font-cinzel">Укажите пол</h3>
            </div>
            <RadioGroup value={character.gender} onValueChange={(val) => setCharacter({ ...character, gender: val })}>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male" className="flex-1 cursor-pointer">
                    <div className="p-6 border-2 rounded-lg hover:border-primary transition-colors text-center">
                      <Icon name="User" size={40} className="text-primary mx-auto mb-2" />
                      <div className="font-bold">Мужской</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female" className="flex-1 cursor-pointer">
                    <div className="p-6 border-2 rounded-lg hover:border-primary transition-colors text-center">
                      <Icon name="UserCircle" size={40} className="text-primary mx-auto mb-2" />
                      <div className="font-bold">Женский</div>
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 animate-fade-in">
            <div className="text-center mb-6">
              <Icon name="Swords" size={48} className="text-primary mx-auto mb-3" />
              <h3 className="text-xl font-bold font-cinzel">Выберите класс</h3>
            </div>
            <RadioGroup value={character.classType} onValueChange={(val) => setCharacter({ ...character, classType: val })}>
              <div className="space-y-3">
                {classes.map((cls) => (
                  <div key={cls.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={cls.id} id={cls.id} />
                    <Label htmlFor={cls.id} className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between p-4 border-2 rounded-lg hover:border-primary transition-colors">
                        <div className="flex items-center gap-3">
                          <Icon name={cls.icon as any} size={32} className={cls.color} />
                          <div>
                            <div className="font-bold text-lg font-cinzel">{cls.name}</div>
                            <div className="text-sm text-muted-foreground">{cls.description}</div>
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
              <Icon name="ChevronLeft" size={20} className="mr-2" />
              Назад
            </Button>
          )}
          {step < 4 ? (
            <Button 
              onClick={() => setStep(step + 1)} 
              disabled={!isStepComplete()}
              className="flex-1"
            >
              Далее
              <Icon name="ChevronRight" size={20} className="ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleComplete} 
              disabled={!isStepComplete()}
              className="flex-1"
            >
              <Icon name="Play" size={20} className="mr-2" />
              Начать приключение
            </Button>
          )}
        </div>

        {step === 4 && character.name && (
          <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm animate-scale-in">
            <div className="font-bold text-center mb-3">Карточка персонажа</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <Icon name="User" size={14} />
                <span className="text-muted-foreground">Имя:</span>
                <span className="font-bold">{character.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Users" size={14} />
                <span className="text-muted-foreground">Раса:</span>
                <span className="font-bold">{races.find(r => r.id === character.race)?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="UserCircle" size={14} />
                <span className="text-muted-foreground">Пол:</span>
                <span className="font-bold">{character.gender === 'male' ? 'Мужской' : 'Женский'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Sword" size={14} />
                <span className="text-muted-foreground">Класс:</span>
                <span className="font-bold">{classes.find(c => c.id === character.classType)?.name}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
