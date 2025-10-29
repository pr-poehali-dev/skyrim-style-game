import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GameDemo from '@/components/GameDemo';

const Index = () => {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const classes = [
    {
      id: 'warrior',
      name: 'Воин',
      icon: 'Sword',
      description: 'Мастер ближнего боя, использует мощное оружие и тяжёлую броню',
      stats: { strength: 95, magic: 30, agility: 60 }
    },
    {
      id: 'mage',
      name: 'Маг',
      icon: 'Wand2',
      description: 'Повелитель стихий, использует разрушительную магию огня и льда',
      stats: { strength: 40, magic: 95, agility: 50 }
    },
    {
      id: 'rogue',
      name: 'Вор',
      icon: 'UserCircle',
      description: 'Мастер скрытности, использует ловкость и критические удары',
      stats: { strength: 60, magic: 45, agility: 95 }
    }
  ];

  const locations = [
    { name: 'Вайтран', description: 'Столица, город торговцев', icon: 'Castle' },
    { name: 'Морозная пещера', description: 'Логово ледяного дракона', icon: 'Mountain' },
    { name: 'Тёмный лес', description: 'Таинственный лес с древней магией', icon: 'Trees' },
    { name: 'Руины Двемеров', description: 'Забытые подземелья', icon: 'Landmark' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-lg border-b border-border z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Icon name="Swords" size={28} className="text-primary" />
            <h1 className="text-2xl font-bold font-cinzel">SKYRIM LEGENDS</h1>
          </div>
          <div className="hidden md:flex gap-6">
            <a href="#home" className="story-link hover:text-primary transition-colors">Главная</a>
            <a href="#characters" className="story-link hover:text-primary transition-colors">Персонажи</a>
            <a href="#gameplay" className="story-link hover:text-primary transition-colors">Геймплей</a>
            <a href="#world" className="story-link hover:text-primary transition-colors">Мир</a>
            <a href="#demo" className="story-link hover:text-primary transition-colors">Демо</a>
          </div>
          <Button className="hidden md:flex">Играть</Button>
        </div>
      </nav>

      <section id="home" className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent opacity-50"></div>
        <div className="container mx-auto text-center relative z-10 animate-fade-in">
          <h2 className="text-6xl md:text-8xl font-bold font-cinzel mb-6 bg-gradient-to-r from-primary via-purple-400 to-primary bg-clip-text text-transparent">
            Легенды Скайрима
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Отправляйтесь в эпическое путешествие по миру драконов, магии и древних тайн
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="text-lg hover-scale" onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}>
              <Icon name="Play" size={20} className="mr-2" />
              Начать игру
            </Button>
            <Button size="lg" variant="outline" className="text-lg hover-scale" onClick={() => document.getElementById('characters')?.scrollIntoView({ behavior: 'smooth' })}>
              <Icon name="BookOpen" size={20} className="mr-2" />
              Узнать больше
            </Button>
          </div>
        </div>
        <div className="mt-16 flex justify-center gap-12 text-center">
          <div className="animate-scale-in">
            <div className="text-4xl font-bold text-primary">50+</div>
            <div className="text-muted-foreground">Локаций</div>
          </div>
          <div className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <div className="text-4xl font-bold text-primary">100+</div>
            <div className="text-muted-foreground">Квестов</div>
          </div>
          <div className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="text-4xl font-bold text-primary">∞</div>
            <div className="text-muted-foreground">Приключений</div>
          </div>
        </div>
      </section>

      <section id="characters" className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <h3 className="text-5xl font-bold font-cinzel text-center mb-4">Выберите свой путь</h3>
          <p className="text-center text-muted-foreground mb-12 text-lg">Три уникальных класса с разными стилями игры</p>
          <div className="grid md:grid-cols-3 gap-8">
            {classes.map((cls) => (
              <Card key={cls.id} className="hover-scale cursor-pointer border-2 hover:border-primary transition-all">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name={cls.icon as any} size={40} className="text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-cinzel">{cls.name}</CardTitle>
                  <CardDescription className="text-base">{cls.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Сила</span>
                        <span className="text-primary">{cls.stats.strength}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-orange-500 to-red-500" style={{ width: `${cls.stats.strength}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Магия</span>
                        <span className="text-primary">{cls.stats.magic}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500" style={{ width: `${cls.stats.magic}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Ловкость</span>
                        <span className="text-primary">{cls.stats.agility}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500" style={{ width: `${cls.stats.agility}%` }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="gameplay" className="py-20 px-6">
        <div className="container mx-auto">
          <h3 className="text-5xl font-bold font-cinzel text-center mb-16">Геймплей</h3>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex gap-4 items-start animate-fade-in">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="Swords" size={24} className="text-primary" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Динамичные сражения</h4>
                  <p className="text-muted-foreground">Реалистичная боевая система с комбо-атаками, блоками и уклонениями</p>
                </div>
              </div>
              <div className="flex gap-4 items-start animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="Sparkles" size={24} className="text-primary" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Система магии</h4>
                  <p className="text-muted-foreground">Более 50 заклинаний стихий: огонь, лёд, молния и тёмная магия</p>
                </div>
              </div>
              <div className="flex gap-4 items-start animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="Users" size={24} className="text-primary" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Живой мир NPC</h4>
                  <p className="text-muted-foreground">Тысячи уникальных персонажей с собственными историями и квестами</p>
                </div>
              </div>
              <div className="flex gap-4 items-start animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="Crown" size={24} className="text-primary" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Свобода выбора</h4>
                  <p className="text-muted-foreground">Ваши решения влияют на сюжет и отношения с фракциями</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-lg flex items-center justify-center border-2 border-border">
                <Icon name="Gamepad2" size={80} className="text-primary/50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="world" className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <h3 className="text-5xl font-bold font-cinzel text-center mb-4">Исследуйте мир</h3>
          <p className="text-center text-muted-foreground mb-12 text-lg">Огромный открытый мир, полный тайн и опасностей</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {locations.map((loc, idx) => (
              <Card key={idx} className="hover-scale cursor-pointer hover:border-primary transition-all">
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name={loc.icon as any} size={32} className="text-primary" />
                  </div>
                  <CardTitle className="text-center font-cinzel">{loc.name}</CardTitle>
                  <CardDescription className="text-center">{loc.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-6">Каждая локация — уникальный опыт с собственными квестами, врагами и сокровищами</p>
            <Button variant="outline" size="lg" className="hover-scale">
              <Icon name="Map" size={20} className="mr-2" />
              Открыть карту мира
            </Button>
          </div>
        </div>
      </section>

      <section id="demo" className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <h3 className="text-5xl font-bold font-cinzel text-center mb-4">Попробуйте демо</h3>
          <p className="text-center text-muted-foreground mb-12 text-lg">Выберите персонажа и исследуйте мир!</p>
          
          <GameDemo />
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-border bg-muted/30">
        <div className="container mx-auto text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Icon name="Swords" size={24} className="text-primary" />
            <span className="text-xl font-bold font-cinzel">SKYRIM LEGENDS</span>
          </div>
          <p className="text-muted-foreground">Эпическая RPG-игра в открытом мире</p>
          <div className="flex justify-center gap-6 pt-4">
            <Button variant="ghost" size="icon" className="hover-scale">
              <Icon name="Twitter" size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="hover-scale">
              <Icon name="Youtube" size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="hover-scale">
              <Icon name="MessageCircle" size={20} />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground pt-6">© 2024 Skyrim Legends. Демо-версия</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;