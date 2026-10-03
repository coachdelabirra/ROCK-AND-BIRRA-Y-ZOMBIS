/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  PlayerState, 
  GameScreen, 
  ClassKey, 
  DifficultyKey, 
  ZoneKey, 
  ActiveEnemy, 
  CombatLog, 
  InventoryItem,
  PointAndClickHotspot 
} from './types/game';
import { 
  CHARACTER_CLASSES, 
  GAME_DIFFICULTIES, 
  ZONES_DATA, 
  INITIAL_ITEMS,
  BOSS_FERRO,
  BOSS_ALMA,
  FLAVOR_WALK_EVENTS 
} from './data/gameData';
import { sound } from './utils/audio';

import { HeaderHUD } from './components/HeaderHUD';
import { TitleScreen } from './components/TitleScreen';
import { CharacterSelect } from './components/CharacterSelect';
import { PointAndClickScene } from './components/PointAndClickScene';
import { CombatModal } from './components/CombatModal';
import { MapModal } from './components/MapModal';
import { InventoryModal } from './components/InventoryModal';
import { RadioModal } from './components/RadioModal';
import { StatsModal } from './components/StatsModal';
import { VictoryScreen } from './components/VictoryScreen';
import { GameOverScreen } from './components/GameOverScreen';

const SAVE_KEY = 'rock_and_birra_save_v1';

export default function App() {
  const [screen, setScreen] = useState<GameScreen>('TITLE');
  const [player, setPlayer] = useState<PlayerState | null>(null);
  const [hasSavedGame, setHasSavedGame] = useState<boolean>(false);
  const [scanlines, setScanlines] = useState<boolean>(true);

  // Active Modals
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isRadioOpen, setIsRadioOpen] = useState(false);

  // Active Combat
  const [activeEnemy, setActiveEnemy] = useState<ActiveEnemy | null>(null);

  // Bitácora / Game Logs
  const [logs, setLogs] = useState<CombatLog[]>([
    {
      id: 'l1',
      text: '📻 Rock and Birra Radio sintonizado. Esta vaina se jodió... hay que sobrevivir.',
      type: 'system'
    },
    {
      id: 'l2',
      text: '🍕🍺 Misión inicial: consigue pizzas y cervezas antes de que el Apocalipsis llegue al 100%.',
      type: 'system'
    }
  ]);

  // Check saved game on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        setHasSavedGame(true);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const addLog = (text: string, type: CombatLog['type'] = 'system') => {
    setLogs(prev => [...prev.slice(-30), { id: Math.random().toString(), text, type }]);
  };

  // Start new game
  const handleStartNewGame = (name: string, classKey: ClassKey, diffKey: DifficultyKey) => {
    const cls = CHARACTER_CLASSES.find(c => c.key === classKey)!;
    const diff = GAME_DIFFICULTIES.find(d => d.key === diffKey)!;

    const newPlayer: PlayerState = {
      name,
      classKey,
      difficultyKey: diffKey,
      level: 1,
      exp: 0,
      expNext: 25,
      hp: cls.maxHp,
      maxHp: cls.maxHp,
      energy: cls.maxEnergy,
      maxEnergy: cls.maxEnergy,
      attack: cls.attack,
      defense: cls.defense,
      caps: 10,
      currentZone: 'bunker',
      pizzas: 0,
      pizzasRequired: diff.pizzasRequired,
      beers: 0,
      beersRequired: diff.beersRequired,
      apocalypse: 0,
      apocalypseMax: 100,
      inventory: [
        { ...INITIAL_ITEMS.bebida_energetica },
        { ...INITIAL_ITEMS.vendaje }
      ],
      bossFerroDefeated: false,
      bossAlmaDefeated: false,
      secretRefugeLooted: false,
      lootedHotspots: [],
      usedTriviaQuestions: [],
      stats: {
        triviaCorrect: 0,
        triviaFailed: 0,
        bestStreak: 0,
        currentStreak: 0,
        zombiesDefeated: 0,
        itemsFound: 2,
        pizzasFound: 0,
        beersFound: 0
      }
    };

    setPlayer(newPlayer);
    setScreen('EXPLORING');
    sound.startRadio(0);
    addLog(`🎸 ¡Bienvenido al apocalipsis, ${name}! Tu refugio está en el Búnker del Barrio.`);
    addLog(`🎯 Debes traer ${diff.pizzasRequired} pizzas y ${diff.beersRequired} cervezas para declarar la victoria.`);
  };

  // Continue saved game
  const handleContinueGame = () => {
    try {
      const dataStr = localStorage.getItem(SAVE_KEY);
      if (dataStr) {
        const savedPlayer: PlayerState = JSON.parse(dataStr);
        setPlayer(savedPlayer);
        setScreen('EXPLORING');
        sound.startRadio(0);
        addLog(`📂 Partida restaurada con éxito. ¡Bienvenido de nuevo, ${savedPlayer.name}!`);
      }
    } catch {
      addLog(`⚠️ Error al leer los datos de guardado.`);
    }
  };

  // Save game in bunker
  const handleSaveGame = () => {
    if (!player) return;
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(player));
      setHasSavedGame(true);
      addLog(`💾 Partida guardada con éxito en el búnker. Tu progreso está a salvo.`, 'item');
    } catch {
      addLog(`⚠️ No se pudo guardar la partida.`);
    }
  };

  // Advance Apocalypse clock
  const advanceApocalypse = (amount: number) => {
    if (!player) return;
    const diff = GAME_DIFFICULTIES.find(d => d.key === player.difficultyKey)!;
    const scaled = Math.max(1, Math.round(amount * diff.apocalypseMult));
    const nextApoc = Math.min(player.apocalypseMax, player.apocalypse + scaled);

    setPlayer(prev => prev ? { ...prev, apocalypse: nextApoc } : null);

    if (nextApoc >= 80 && player.apocalypse < 80) {
      addLog(`⚠️ El cielo toma un color violeta tóxico. ¡El apocalipsis está cerca de consumarse!`, 'enemy');
    }

    if (nextApoc >= player.apocalypseMax) {
      sound.playGameOver();
      setScreen('APOCALYPSE_OVER');
    }
  };

  // Travel between zones
  const handleMoveToZone = (targetZoneKey: ZoneKey) => {
    if (!player) return;
    const targetZone = ZONES_DATA[targetZoneKey];

    // Advance apocalypse on travel (3 to 7%)
    advanceApocalypse(Math.floor(Math.random() * 5) + 3);

    setPlayer(prev => prev ? { ...prev, currentZone: targetZoneKey } : null);
    addLog(`🚶 Llegas a: ${targetZone.name}.`);

    // Check boss encounter in Gasolinera
    if (targetZoneKey === 'gasolinera' && !player.bossFerroDefeated) {
      startBossEncounter(BOSS_FERRO);
      return;
    }

    // Check boss encounter in Bar El Aullido
    if (targetZoneKey === 'bar' && !player.bossAlmaDefeated) {
      startBossEncounter(BOSS_ALMA);
      return;
    }

    // Random encounter check
    const diff = GAME_DIFFICULTIES.find(d => d.key === player.difficultyKey)!;
    if (targetZone.templates.length > 0 && Math.random() < targetZone.enemyEncounterRate * diff.enemyMult) {
      startRandomEncounter(targetZone);
    } else {
      // Small chance of random street flavor event
      if (Math.random() < 0.35) {
        triggerFlavorWalkEvent();
      }
    }
  };

  // Random street event
  const triggerFlavorWalkEvent = () => {
    if (!player) return;
    const ev = FLAVOR_WALK_EVENTS[Math.floor(Math.random() * FLAVOR_WALK_EVENTS.length)];
    if (ev.caps) {
      sound.playCapsPickup();
      setPlayer(p => p ? { ...p, caps: p.caps + ev.caps } : null);
      addLog(`🔩 Encuentras ${ev.caps} chapitas tiradas entre el asfalto roto.`, 'item');
    } else if (ev.item) {
      sound.playBackpack();
      const item = { ...INITIAL_ITEMS[ev.item] };
      setPlayer(p => p ? { ...p, inventory: [...p.inventory, item] } : null);
      addLog(`🎒 ¡Un sobreviviente te arroja un ${item.name}!`, 'item');
    } else if (ev.damage) {
      const nextHp = Math.max(1, player.hp - ev.damage);
      setPlayer(p => p ? { ...p, hp: nextHp } : null);
      sound.playDamage();
      addLog(`⚠️ Pisaste una trampa de alambre de púas: pierdes ${ev.damage} de vida.`, 'enemy');
    } else {
      addLog(ev.text, 'system');
    }
  };

  // Start Enemy Encounter
  const startRandomEncounter = (zone: typeof ZONES_DATA[string]) => {
    if (!player) return;
    const diff = GAME_DIFFICULTIES.find(d => d.key === player.difficultyKey)!;
    const template = zone.templates[Math.floor(Math.random() * zone.templates.length)];
    const scale = 1 + (player.level - 1) * 0.2;

    const enemy: ActiveEnemy = {
      name: template.name,
      maxHp: Math.round(template.hp * scale * diff.enemyMult),
      hp: Math.round(template.hp * scale * diff.enemyMult),
      attack: Math.round(template.attack * scale * diff.enemyMult),
      defense: template.defense,
      exp: Math.round(template.exp * scale),
      caps: Math.round(template.caps * scale),
      isBoss: false
    };

    setActiveEnemy(enemy);
    sound.playZombieGrowl();
    addLog(`⚔️ ¡Un ${enemy.name} se interpone en tu camino! A pelear.`);
  };

  // Start Boss Encounter
  const startBossEncounter = (bossTemplate: typeof BOSS_FERRO) => {
    if (!player) return;
    const diff = GAME_DIFFICULTIES.find(d => d.key === player.difficultyKey)!;
    const scale = 1 + (player.level - 1) * 0.25;

    const enemy: ActiveEnemy = {
      name: bossTemplate.name,
      maxHp: Math.round(bossTemplate.hp * scale * diff.enemyMult),
      hp: Math.round(bossTemplate.hp * scale * diff.enemyMult),
      attack: Math.round(bossTemplate.attack * scale * diff.enemyMult),
      defense: bossTemplate.defense,
      exp: Math.round(bossTemplate.exp * scale),
      caps: Math.round(bossTemplate.caps * scale),
      isBoss: true,
      bossType: bossTemplate.bossType
    };

    setActiveEnemy(enemy);
    sound.playZombieGrowl();
    setTimeout(() => sound.playRockPowerChord(164.81), 250);
    addLog(`☠️ ¡EL JEFE ${enemy.name.toUpperCase()} APARECE!`, 'crit');
    addLog(`Atento: prepara ataques especiales periódicos que deberás esquivar con la tecla E.`);
  };

  // Explore rubble action
  const handleExploreRubble = () => {
    if (!player) return;
    const currentZone = ZONES_DATA[player.currentZone];
    if (currentZone.templates.length === 0) {
      addLog(`Aquí en el búnker no hay escombros que revisar.`);
      return;
    }

    advanceApocalypse(2);
    startRandomEncounter(currentZone);
  };

  // Finish Combat
  const handleFinishCombat = (result: 'win' | 'lose' | 'fled') => {
    if (!player || !activeEnemy) {
      setActiveEnemy(null);
      return;
    }

    if (result === 'lose') {
      setActiveEnemy(null);
      setScreen('GAME_OVER');
      return;
    }

    if (result === 'fled') {
      setActiveEnemy(null);
      addLog(`🏃 Huiste de la batalla. Tu dignidad quedó en el piso, pero sigues vivo.`);
      return;
    }

    if (result === 'win') {
      const zone = ZONES_DATA[player.currentZone];
      let newPizzas = player.pizzas;
      let newBeers = player.beers;
      const extraItems: InventoryItem[] = [];

      // Check drops
      if (Math.random() < zone.pizzaChance) {
        newPizzas++;
        sound.playPizzaFound();
        addLog(`🍕 ¡ENCONTRASTE UNA PORCIÓN DE PIZZA! (${newPizzas}/${player.pizzasRequired})`, 'crit');
      }

      if (Math.random() < zone.beerChance) {
        newBeers++;
        sound.playBeerSound();
        addLog(`🍺 ¡ENCONTRASTE UNA CERVEZA ARTESANAL HELADA! (${newBeers}/${player.beersRequired})`, 'crit');
      }

      // Check boss flags
      let ferroDefeated = player.bossFerroDefeated;
      let almaDefeated = player.bossAlmaDefeated;

      if (activeEnemy.name.includes('Ferro')) {
        ferroDefeated = true;
        newPizzas = Math.min(player.pizzasRequired, newPizzas + 1);
        sound.playPizzaFound();
        addLog(`🏆 ¡El Comandante Ferro ha caído! Aseguras pizza de la camioneta blindada.`, 'crit');
      }

      if (activeEnemy.name.includes('Alma')) {
        almaDefeated = true;
        newBeers = Math.min(player.beersRequired, newBeers + 1);
        sound.playBeerSound();
        addLog(`🏆 ¡Alma la Sirena ha sido derrotada! El Bar El Aullido queda liberado.`, 'crit');
      }

      // Secret zone hint if both defeated
      if (ferroDefeated && almaDefeated && (!player.bossFerroDefeated || !player.bossAlmaDefeated)) {
        addLog(`🔐 ¡SECRET REVEALED! Has desbloqueado el acceso al "Refugio Secreto de Alma y Ferro".`, 'crit');
      }

      // Experience & Level Up
      let nextExp = player.exp + activeEnemy.exp;
      let nextLevel = player.level;
      let nextMaxHp = player.maxHp;
      let nextHp = player.hp;
      let nextAtk = player.attack;
      let nextDef = player.defense;
      let nextMaxEnergy = player.maxEnergy;
      let nextEnergy = player.energy;
      let nextExpReq = player.expNext;

      if (nextExp >= player.expNext) {
        nextExp -= player.expNext;
        nextLevel += 1;
        nextMaxHp += 8;
        nextHp = nextMaxHp;
        nextAtk += 2;
        nextDef += 1;
        nextMaxEnergy += 2;
        nextEnergy = nextMaxEnergy;
        nextExpReq = Math.round(nextExpReq * 1.5);
        sound.playLevelUp();
        addLog(`🎉 ¡SUBISTE DE NIVEL! Ahora eres Nv.${nextLevel} (Vida y Energía recargadas).`, 'crit');
      }

      if (activeEnemy.caps > 0) {
        setTimeout(() => sound.playCapsPickup(), 200);
      }

      setPlayer({
        ...player,
        caps: player.caps + activeEnemy.caps,
        pizzas: newPizzas,
        beers: newBeers,
        exp: nextExp,
        expNext: nextExpReq,
        level: nextLevel,
        maxHp: nextMaxHp,
        hp: nextHp,
        attack: nextAtk,
        defense: nextDef,
        maxEnergy: nextMaxEnergy,
        energy: nextEnergy,
        bossFerroDefeated: ferroDefeated,
        bossAlmaDefeated: almaDefeated,
        inventory: [...player.inventory, ...extraItems],
        stats: {
          ...player.stats,
          zombiesDefeated: player.stats.zombiesDefeated + 1,
          pizzasFound: newPizzas,
          beersFound: newBeers
        }
      });

      addLog(`✨ Recompensas: 🔩 ${activeEnemy.caps} chapas y ${activeEnemy.exp} EXP ganadas.`, 'item');
      setActiveEnemy(null);
    }
  };

  // Rest in Bunker
  const handleRestInBunker = () => {
    if (!player) return;
    if (player.caps < 5) {
      sound.playTriviaWrong();
      addLog(`❌ No tienes 5 chapas para pagar el descanso en el búnker.`);
      return;
    }

    sound.playRestSigh();
    advanceApocalypse(2);

    setPlayer({
      ...player,
      caps: player.caps - 5,
      hp: player.maxHp,
      energy: player.maxEnergy
    });

    addLog(`🛏️ Te tiras en el colchón del búnker. Recuperas el 100% de tu salud y energía.`, 'player');
  };

  // Loot Hotspot in Scene
  const handleInteractHotspot = (hs: PointAndClickHotspot) => {
    if (!player) return;

    if (hs.actionType === 'radio') {
      sound.playMapStatic();
      setIsRadioOpen(true);
      addLog(hs.flavorText, 'item');
      return;
    }

    if (hs.actionType === 'rest') {
      handleRestInBunker();
      return;
    }

    if (hs.actionType === 'inspect') {
      sound.playBlip();
      addLog(`🔍 ${hs.label}: ${hs.flavorText}`);
      return;
    }

    if (hs.actionType === 'loot') {
      if (player.lootedHotspots.includes(hs.id)) {
        addLog(`Ya has revisado este lugar.`);
        return;
      }

      if (hs.capsReward) {
        sound.playCapsPickup();
      } else if (hs.itemReward) {
        sound.playBackpack();
      } else {
        sound.playConfirm();
      }

      const updatedLooted = [...player.lootedHotspots, hs.id];
      let updatedInv = [...player.inventory];
      let updatedCaps = player.caps;

      if (hs.itemReward && INITIAL_ITEMS[hs.itemReward]) {
        updatedInv.push({ ...INITIAL_ITEMS[hs.itemReward] });
        addLog(`🎁 ${hs.flavorText} (Obtienes: ${INITIAL_ITEMS[hs.itemReward].name})`, 'item');
      }

      if (hs.capsReward) {
        updatedCaps += hs.capsReward;
        addLog(`🔩 ${hs.flavorText} (+${hs.capsReward} chapas)`, 'item');
      }

      setPlayer({
        ...player,
        caps: updatedCaps,
        inventory: updatedInv,
        lootedHotspots: updatedLooted
      });
    }

    if (hs.actionType === 'secret') {
      handleLootSecretRefuge();
    }
  };

  // Loot Secret Refuge VIP Safe
  const handleLootSecretRefuge = () => {
    if (!player || player.secretRefugeLooted) return;

    sound.playSafeUnlock();
    setTimeout(() => sound.playCapsPickup(), 250);
    setTimeout(() => sound.playPizzaFound(), 550);
    setTimeout(() => sound.playBeerSound(), 850);

    const safeItems = [
      { ...INITIAL_ITEMS.botiquin_militar },
      { ...INITIAL_ITEMS.birra_artesanal }
    ];

    setPlayer({
      ...player,
      caps: player.caps + 25,
      pizzas: Math.min(player.pizzasRequired, player.pizzas + 1),
      beers: Math.min(player.beersRequired, player.beers + 1),
      secretRefugeLooted: true,
      inventory: [...player.inventory, ...safeItems]
    });

    addLog(`🎁 ¡ABRISTE LA CAJA FUERTE VIP! Obtienes 25 chapas de oro, 1 Pizza, 1 Cerveza y Botiquín Completo.`, 'crit');
  };

  // Use Item from backpack
  const handleUseItem = (item: InventoryItem) => {
    if (!player) return;

    sound.playConfirm();
    let nextHp = player.hp;
    let nextEnergy = player.energy;

    if (item.type === 'health') {
      nextHp = Math.min(player.maxHp, player.hp + item.value);
      if (item.id === 'birra_artesanal') {
        sound.playBeerSound();
      }
      addLog(`🩹 Consumes ${item.name}: recuperas vida (${nextHp}/${player.maxHp}).`, 'item');
    } else if (item.type === 'energy') {
      nextEnergy = Math.min(player.maxEnergy, player.energy + item.value);
      addLog(`⚡ Consumes ${item.name}: recuperas energía (${nextEnergy}/${player.maxEnergy}).`, 'item');
    }

    // Remove first instance from inventory
    const idx = player.inventory.findIndex(i => i.id === item.id);
    const nextInv = [...player.inventory];
    if (idx !== -1) {
      nextInv.splice(idx, 1);
    }

    setPlayer({
      ...player,
      hp: nextHp,
      energy: nextEnergy,
      inventory: nextInv
    });
  };

  // Declare Victory
  const handleDeclareVictory = () => {
    sound.stopRadio();
    setScreen('VICTORY');
  };

  // Absurd black-comedy decision (part of core game loop)
  const handleStupidDecision = () => {
    if (!player) return;
    advanceApocalypse(1);

    const outcomes = [
      {
        text: '🤪 DECISIÓN ESTÚPIDA: Le ofreces una IPA artesanal con demasiado lúpulo a un zombi. El zombi la huele, hace arcadas y se aleja horrorizado dejándote 6 chapitas.',
        apply: (p: PlayerState) => {
          sound.playCapsPickup();
          return { ...p, caps: p.caps + 6 };
        },
        type: 'item' as const,
      },
      {
        text: '🤪 DECISIÓN ESTÚPIDA: Pones tu solo de guitarra favorito a todo volumen por un megáfono roto. La onda expansiva distrae a la horda y descubres una porción de pizza.',
        apply: (p: PlayerState) => {
          sound.playPizzaFound();
          return { ...p, pizzas: p.pizzas + 1 };
        },
        type: 'crit' as const,
      },
      {
        text: '🤪 DECISIÓN ESTÚPIDA: Te pones a discutir con un maniquí sobre si Bon Scott era mejor que Brian Johnson. Te muerde un zombi distraído por la espalda (-3 HP), pero escapas riéndote.',
        apply: (p: PlayerState) => {
          sound.playDamage();
          return { ...p, hp: Math.max(1, p.hp - 3) };
        },
        type: 'enemy' as const,
      },
      {
        text: '🤪 DECISIÓN ESTÚPIDA: Das un trago a una botella sin etiqueta que flotaba en un charco. ¡Era licor casero de un rockero! La adrenalina te recarga 6 puntos de energía.',
        apply: (p: PlayerState) => {
          sound.playConfirm();
          return { ...p, energy: Math.min(p.maxEnergy, p.energy + 6) };
        },
        type: 'player' as const,
      },
      {
        text: '🤪 DECISIÓN ESTÚPIDA: Desafías a un zombi a una pulseada por una remera de Iron Maiden. Al zombi se le desprende el brazo y encuentras un vendaje limpio en su bolsillo.',
        apply: (p: PlayerState) => {
          sound.playBackpack();
          return { ...p, inventory: [...p.inventory, { ...INITIAL_ITEMS.vendaje }] };
        },
        type: 'item' as const,
      },
      {
        text: '🤪 DECISIÓN ESTÚPIDA: Intentas saltar sobre un auto oxidado cantando "Jump" de Van Halen. Aterrizas justo frente a un zombi furioso.',
        apply: (p: PlayerState) => {
          const currentZone = ZONES_DATA[p.currentZone];
          if (currentZone.templates.length > 0) {
            startRandomEncounter(currentZone);
          }
          return p;
        },
        type: 'enemy' as const,
      }
    ];

    const pick = outcomes[Math.floor(Math.random() * outcomes.length)];
    addLog(pick.text, pick.type);
    setPlayer(prev => prev ? pick.apply(prev) : null);
  };

  return (
    <div className="min-h-screen bg-black text-stone-100 flex flex-col font-body relative overflow-x-hidden">
      
      {/* Scanlines CRT Retro filter overlay */}
      {scanlines && <div className="scanlines fixed inset-0 z-50 pointer-events-none" />}

      {/* Persistent Top Navigation HUD when in active game */}
      {player && screen === 'EXPLORING' && (
        <HeaderHUD
          player={player}
          onOpenMap={() => setIsMapOpen(true)}
          onOpenInventory={() => setIsInventoryOpen(true)}
          onOpenStats={() => setIsStatsOpen(true)}
          onOpenRadio={() => setIsRadioOpen(true)}
          scanlines={scanlines}
          onToggleScanlines={() => setScanlines(!scanlines)}
        />
      )}

      {/* Screen Router */}
      <main className="flex-1 flex flex-col">
        {screen === 'TITLE' && (
          <TitleScreen
            hasSavedGame={hasSavedGame}
            onNewGame={() => {
              sound.playConfirm();
              setScreen('CLASS_SELECT');
            }}
            onContinueGame={handleContinueGame}
            onOpenStats={() => setIsStatsOpen(true)}
            onOpenRadio={() => setIsRadioOpen(true)}
          />
        )}

        {screen === 'CLASS_SELECT' && (
          <CharacterSelect
            onBack={() => setScreen('TITLE')}
            onStartGame={handleStartNewGame}
          />
        )}

        {screen === 'EXPLORING' && player && (
          <PointAndClickScene
            player={player}
            logs={logs}
            onMoveToZone={handleMoveToZone}
            onExploreRubble={handleExploreRubble}
            onRestInBunker={handleRestInBunker}
            onSaveGame={handleSaveGame}
            onDeclareVictory={handleDeclareVictory}
            onLootSecretRefuge={handleLootSecretRefuge}
            onInteractHotspot={handleInteractHotspot}
            onStupidDecision={handleStupidDecision}
            onOpenMap={() => setIsMapOpen(true)}
            onOpenInventory={() => setIsInventoryOpen(true)}
            onOpenRadio={() => setIsRadioOpen(true)}
          />
        )}

        {screen === 'VICTORY' && player && (
          <VictoryScreen
            player={player}
            onPlayAgain={() => {
              sound.stopRadio();
              setScreen('TITLE');
            }}
          />
        )}

        {screen === 'GAME_OVER' && player && (
          <GameOverScreen
            player={player}
            reason="combat"
            onTryAgain={() => {
              sound.stopRadio();
              setScreen('TITLE');
            }}
          />
        )}

        {screen === 'APOCALYPSE_OVER' && player && (
          <GameOverScreen
            player={player}
            reason="apocalypse"
            onTryAgain={() => {
              sound.stopRadio();
              setScreen('TITLE');
            }}
          />
        )}
      </main>

      {/* Combat Modal */}
      {activeEnemy && player && (
        <CombatModal
          player={player}
          enemy={activeEnemy}
          onFinishCombat={handleFinishCombat}
          onUseItem={handleUseItem}
        />
      )}

      {/* Map Modal */}
      {isMapOpen && player && (
        <MapModal
          player={player}
          onClose={() => setIsMapOpen(false)}
          onTravelToZone={handleMoveToZone}
        />
      )}

      {/* Inventory Modal */}
      {isInventoryOpen && player && (
        <InventoryModal
          player={player}
          onClose={() => setIsInventoryOpen(false)}
          onUseItem={handleUseItem}
        />
      )}

      {/* Radio Modal */}
      {isRadioOpen && (
        <RadioModal onClose={() => setIsRadioOpen(false)} />
      )}

      {/* Stats Modal */}
      {isStatsOpen && player && (
        <StatsModal
          player={player}
          onClose={() => setIsStatsOpen(false)}
        />
      )}

    </div>
  );
}
