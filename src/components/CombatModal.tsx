import React, { useState, useEffect } from 'react';
import { PlayerState, ActiveEnemy, TriviaQuestion, InventoryItem } from '../types/game';
import { TriviaModal } from './TriviaModal';
import { TRIVIA_DATABASE, CHARACTER_CLASSES } from '../data/gameData';
import { sound } from '../utils/audio';
import { 
  Heart, 
  Zap, 
  Shield, 
  Skull, 
  Flame, 
  Backpack, 
  RotateCcw, 
  Sparkles,
  AlertTriangle
} from 'lucide-react';

interface CombatModalProps {
  player: PlayerState;
  enemy: ActiveEnemy;
  onFinishCombat: (result: 'win' | 'lose' | 'fled') => void;
  onUseItem: (item: InventoryItem) => void;
}

export const CombatModal: React.FC<CombatModalProps> = ({
  player,
  enemy,
  onFinishCombat,
  onUseItem,
}) => {
  const [enemyHp, setEnemyHp] = useState(enemy.hp);
  const [playerHp, setPlayerHp] = useState(player.hp);
  const [playerEnergy, setPlayerEnergy] = useState(player.energy);
  
  const [combatLogs, setCombatLogs] = useState<string[]>([
    `¡Un ${enemy.name} sale entre los escombros con ganas de carne fresca!`,
    `Responde a las trivias de rock y cine para conectar golpes demoledores.`
  ]);

  const [activeTrivia, setActiveTrivia] = useState<TriviaQuestion | null>(null);
  const [isSpecialAttack, setIsSpecialAttack] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [turnCounter, setTurnCounter] = useState(1);
  const [isItemsOpen, setIsItemsOpen] = useState(false);

  // Boss Telegraphed Attack (Dodge QTE)
  const [dodgePrompt, setDodgePrompt] = useState<string | null>(null);
  const [isDodgeActive, setIsDodgeActive] = useState(false);

  const playerClass = CHARACTER_CLASSES.find(c => c.key === player.classKey)!;

  // Listen for keyboard 'E' to dodge
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'e' || e.key === 'E') && isDodgeActive) {
        handleDodgeSuccess();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDodgeActive]);

  const addLog = (msg: string) => {
    setCombatLogs(prev => [...prev.slice(-6), msg]);
  };

  // Helper to pick trivia question without repeating immediately
  const getTriviaQuestion = (isHard: boolean): TriviaQuestion => {
    const pool = TRIVIA_DATABASE.filter(q => q.isHard === isHard);
    const available = pool.filter(q => !player.usedTriviaQuestions.includes(q.id));
    const chosen = available.length > 0 
      ? available[Math.floor(Math.random() * available.length)]
      : pool[Math.floor(Math.random() * pool.length)];

    return chosen;
  };

  // Handle Player Basic Attack
  const handleAttackClick = () => {
    if (!isPlayerTurn) return;
    sound.playBlip();
    setIsSpecialAttack(false);
    setActiveTrivia(getTriviaQuestion(false));
  };

  // Handle Player Special Skill
  const handleSkillClick = () => {
    if (!isPlayerTurn) return;
    if (playerEnergy < playerClass.skillCost) {
      sound.playTriviaWrong();
      addLog(`¡Sin energía suficiente! Necesitas ${playerClass.skillCost} puntos.`);
      return;
    }
    sound.playBlip();
    setIsSpecialAttack(true);
    setActiveTrivia(getTriviaQuestion(true));
  };

  // Resolve Trivia Answer
  const handleTriviaAnswer = (isCorrect: boolean) => {
    setActiveTrivia(null);
    player.stats.currentStreak = isCorrect ? player.stats.currentStreak + 1 : 0;
    if (player.stats.currentStreak > player.stats.bestStreak) {
      player.stats.bestStreak = player.stats.currentStreak;
    }

    if (isCorrect) {
      player.stats.triviaCorrect++;
      if (isSpecialAttack) {
        // Special Skill hit
        setPlayerEnergy(prev => Math.max(0, prev - playerClass.skillCost));
        let damage = Math.round(player.attack * 2.2);
        if (player.classKey === 'punk') {
          damage += 6; // ignores defense bonus
          sound.playMolotovWhoosh();
        } else if (player.classKey === 'motoquero') {
          sound.playChainWhip();
        } else {
          sound.playRockPowerChord(293.66);
        }
        const finalHp = Math.max(0, enemyHp - damage);
        setEnemyHp(finalHp);
        addLog(`⚡ ¡HABILIDAD ${playerClass.skillName.toUpperCase()}! ${damage} de daño masivo.`);

        if (finalHp <= 0) {
          handleVictory();
          return;
        }
      } else {
        // Regular attack hit
        const baseDmg = player.attack + Math.floor(Math.random() * 4);
        const dmgReal = Math.max(2, baseDmg - enemy.defense);
        const finalHp = Math.max(0, enemyHp - dmgReal);
        setEnemyHp(finalHp);
        sound.playHit();
        addLog(`🎸 ¡Riff demoledor! Golpeas a ${enemy.name} por ${dmgReal} de daño.`);

        if (finalHp <= 0) {
          handleVictory();
          return;
        }
      }
    } else {
      player.stats.triviaFailed++;
      // Floppy hit on fail
      const weakDmg = Math.max(1, Math.floor(player.attack / 3));
      const finalHp = Math.max(0, enemyHp - weakDmg);
      setEnemyHp(finalHp);
      sound.playHit();
      addLog(`❌ Respuesta errada: golpe flojo por solo ${weakDmg} de daño.`);

      if (finalHp <= 0) {
        handleVictory();
        return;
      }
    }

    // Turn switches to Enemy
    setIsPlayerTurn(false);
    setTimeout(() => {
      handleEnemyTurn();
    }, 900);
  };

  // Enemy Turn
  const handleEnemyTurn = () => {
    // Check if Boss prepares special telegraphed move every 3 turns
    if (enemy.isBoss && turnCounter % 3 === 0) {
      triggerBossTelegraph();
      return;
    }

    executeEnemyStandardAttack();
  };

  const triggerBossTelegraph = () => {
    setIsDodgeActive(true);
    const isDrain = enemy.bossType === 'drenaje';
    const msg = isDrain 
      ? `⚠️ ¡ALMA ENTONA UN CANTO ROBAVIDAS! ¡ESQUIVA AHORA (TECLA E)!` 
      : `⚠️ ¡COMANDANTE FERRO PREPARA UN GOLPE DE BOINA ROJA! ¡ESQUIVA AHORA (TECLA E)!`;
    
    setDodgePrompt(msg);
    sound.playTriviaWrong();

    // 1.7 second window to dodge
    const timer = setTimeout(() => {
      if (isDodgeActive) {
        handleDodgeFailure();
      }
    }, 1700);

    return () => clearTimeout(timer);
  };

  const handleDodgeSuccess = () => {
    setIsDodgeActive(false);
    setDodgePrompt(null);
    sound.playDodge();
    addLog(`💨 ¡ESQUIVASTE EL ATAQUE ESPECIAL POR LOS PELOS! Cero daño recibido.`);
    
    // Regain 1 energy on successful dodge
    setPlayerEnergy(prev => Math.min(player.maxEnergy, prev + 2));
    finishEnemyTurn();
  };

  const handleDodgeFailure = () => {
    setIsDodgeActive(false);
    setDodgePrompt(null);
    sound.playDamage();

    if (enemy.bossType === 'drenaje') {
      const drainEnergy = Math.min(playerEnergy, 6);
      const healHp = drainEnergy * 2;
      setPlayerEnergy(prev => Math.max(0, prev - drainEnergy));
      setEnemyHp(prev => Math.min(enemy.maxHp, prev + healHp));
      addLog(`🩸 ¡No esquivaste! Alma te roba ${drainEnergy} de energía y se cura ${healHp} de vida.`);
    } else {
      const heavyDamage = Math.max(4, Math.round(enemy.attack * 2.1) - player.defense);
      const nextHp = Math.max(0, playerHp - heavyDamage);
      setPlayerHp(nextHp);
      addLog(`💥 ¡No llegaste a esquivar! El golpe de boina roja te revienta por ${heavyDamage} de daño.`);
      
      if (nextHp <= 0) {
        handleDefeat();
        return;
      }
    }

    finishEnemyTurn();
  };

  const executeEnemyStandardAttack = () => {
    sound.playZombieGrowl();
    const rawDamage = enemy.attack + Math.floor(Math.random() * 3);
    const damageReal = Math.max(1, rawDamage - player.defense);
    const nextHp = Math.max(0, playerHp - damageReal);
    setPlayerHp(nextHp);

    setTimeout(() => {
      sound.playDamage();
    }, 150);
    addLog(`🧟 ${enemy.name} te ataca vorazmente: recibes ${damageReal} de daño.`);

    // Player naturally regains 1 energy per round
    setPlayerEnergy(prev => Math.min(player.maxEnergy, prev + 1));

    if (nextHp <= 0) {
      handleDefeat();
      return;
    }

    finishEnemyTurn();
  };

  const finishEnemyTurn = () => {
    setTurnCounter(prev => prev + 1);
    setIsPlayerTurn(true);
  };

  // Player Flee Attempt
  const handleFlee = () => {
    if (!isPlayerTurn) return;
    if (enemy.isBoss) {
      sound.playTriviaWrong();
      addLog(`¡No puedes huir de un Jefe de zona! Tienes que pelear por la pizza y la cerveza.`);
      return;
    }

    if (Math.random() > 0.45) {
      sound.playConfirm();
      addLog(`¡Escapas corriendo entre los callejones! Salvaste el pellejo.`);
      setTimeout(() => onFinishCombat('fled'), 800);
    } else {
      sound.playHit();
      addLog(`¡Intentaste huir pero te trabaste con un carrito oxidado! Pierdes el turno.`);
      setIsPlayerTurn(false);
      setTimeout(handleEnemyTurn, 800);
    }
  };

  // Use Item in Combat
  const handleUseCombatItem = (item: InventoryItem) => {
    sound.playConfirm();
    if (item.type === 'health') {
      const healed = Math.min(player.maxHp - playerHp, item.value);
      setPlayerHp(prev => Math.min(player.maxHp, prev + item.value));
      addLog(`🩹 Usas ${item.name}: recuperas ${healed} puntos de vida.`);
    } else if (item.type === 'energy') {
      const restored = Math.min(player.maxEnergy - playerEnergy, item.value);
      setPlayerEnergy(prev => Math.min(player.maxEnergy, prev + item.value));
      addLog(`🔋 Usas ${item.name}: recuperas ${restored} puntos de energía.`);
    }
    onUseItem(item);
    setIsItemsOpen(false);

    // Using an item passes the turn to enemy
    setIsPlayerTurn(false);
    setTimeout(handleEnemyTurn, 800);
  };

  const handleVictory = () => {
    sound.playLevelUp();
    addLog(`🎉 ¡DERROTASTE A ${enemy.name.toUpperCase()}!`);
    setTimeout(() => {
      onFinishCombat('win');
    }, 1200);
  };

  const handleDefeat = () => {
    sound.playGameOver();
    addLog(`💀 Tu cuerpo cae inerte sobre el asfalto. Te quedaste sin vida.`);
    setTimeout(() => {
      onFinishCombat('lose');
    }, 1400);
  };

  const enemyHpPercent = Math.max(0, Math.min(100, (enemyHp / enemy.maxHp) * 100));
  const playerHpPercent = Math.max(0, Math.min(100, (playerHp / player.maxHp) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl nes-box p-4 md:p-6 bg-stone-950 border-4 border-red-600 text-stone-100 shadow-[10px_10px_0px_#000] relative max-h-[95vh] overflow-y-auto">
        
        {/* Combat Title Banner */}
        <div className="flex items-center justify-between border-b-2 border-red-700/60 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Skull className="w-6 h-6 text-red-500 animate-bounce" />
            <h2 className="font-bungee text-lg md:text-xl text-red-500">
              ¡COMBATE ZOMBI: {enemy.name.toUpperCase()}!
            </h2>
          </div>
          <span className="font-pixel text-xs text-stone-400">
            TURNO #{turnCounter} · {isPlayerTurn ? 'TU TURNO' : 'TURNO RIVAL'}
          </span>
        </div>

        {/* Both Combatants Gauges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          
          {/* Player Card */}
          <div className="nes-box p-3 bg-stone-900 border-2 border-emerald-500/60">
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-bungee text-xs text-emerald-400">
                {player.name}
              </span>
              <span className="font-pixel text-xs text-stone-400">
                Nv.{player.level}
              </span>
            </div>

            {/* HP */}
            <div className="mb-2">
              <div className="flex justify-between text-xs font-pixel text-stone-300 mb-0.5">
                <span>VIDA</span>
                <span>{playerHp}/{player.maxHp}</span>
              </div>
              <div className="w-full h-3 bg-stone-950 border border-stone-700 rounded overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${playerHpPercent}%` }}
                />
              </div>
            </div>

            {/* Energy */}
            <div>
              <div className="flex justify-between text-xs font-pixel text-stone-300 mb-0.5">
                <span>ENERGÍA</span>
                <span>{playerEnergy}/{player.maxEnergy}</span>
              </div>
              <div className="w-full h-2.5 bg-stone-950 border border-stone-700 rounded overflow-hidden">
                <div 
                  className="h-full bg-amber-400 transition-all duration-300"
                  style={{ width: `${(playerEnergy / player.maxEnergy) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Enemy Card */}
          <div className="nes-box p-3 bg-stone-900 border-2 border-red-500/60">
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-bungee text-xs text-red-400">
                {enemy.name}
              </span>
              {enemy.isBoss && (
                <span className="bg-red-950 text-red-300 border border-red-700 font-pixel text-[10px] px-1.5 py-0.5 rounded font-bold">
                  JEFE DE ZONA
                </span>
              )}
            </div>

            {/* Enemy HP */}
            <div className="mb-2">
              <div className="flex justify-between text-xs font-pixel text-stone-300 mb-0.5">
                <span>SALUD DEL ZOMBI</span>
                <span>{enemyHp}/{enemy.maxHp}</span>
              </div>
              <div className="w-full h-3 bg-stone-950 border border-stone-700 rounded overflow-hidden">
                <div 
                  className="h-full bg-red-600 transition-all duration-300"
                  style={{ width: `${enemyHpPercent}%` }}
                />
              </div>
            </div>

            <div className="text-[11px] font-pixel text-stone-400 flex justify-between">
              <span>Ataque: {enemy.attack}</span>
              <span>Defensa: {enemy.defense}</span>
              <span>Recompensa: 🔩 {enemy.caps}</span>
            </div>
          </div>

        </div>

        {/* BOSS TELEGRAPH QUICK-TIME-EVENT DODGE BANNER */}
        {isDodgeActive && dodgePrompt && (
          <div className="mb-4 bg-red-600 p-3 rounded-lg border-2 border-black animate-pulse flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[4px_4px_0px_#000]">
            <div className="text-black font-bungee text-xs sm:text-sm text-center sm:text-left flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{dodgePrompt}</span>
            </div>
            <button
              onClick={handleDodgeSuccess}
              className="nes-btn px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bungee text-xs whitespace-nowrap cursor-pointer rounded shadow-[3px_3px_0px_#000]"
            >
              ¡ESQUIVAR YA! (E)
            </button>
          </div>
        )}

        {/* Combat Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          <button
            disabled={!isPlayerTurn || isDodgeActive}
            onClick={handleAttackClick}
            className="nes-btn p-3 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-black font-bungee text-xs rounded cursor-pointer flex flex-col items-center justify-center gap-1 shadow-[3px_3px_0px_#000]"
          >
            <span className="text-lg">🎸</span>
            <span>ATACAR</span>
            <span className="text-[10px] font-pixel font-normal">(Trivia)</span>
          </button>

          <button
            disabled={!isPlayerTurn || isDodgeActive || playerEnergy < playerClass.skillCost}
            onClick={handleSkillClick}
            className="nes-btn p-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bungee text-xs rounded cursor-pointer flex flex-col items-center justify-center gap-1 shadow-[3px_3px_0px_#000]"
          >
            <span className="text-lg">⚡</span>
            <span>HABILIDAD</span>
            <span className="text-[10px] font-pixel">({playerClass.skillCost} Energía)</span>
          </button>

          <button
            disabled={!isPlayerTurn || isDodgeActive || player.inventory.length === 0}
            onClick={() => {
              if (!isItemsOpen) sound.playBackpack();
              setIsItemsOpen(!isItemsOpen);
            }}
            className="nes-btn p-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bungee text-xs rounded cursor-pointer flex flex-col items-center justify-center gap-1 shadow-[3px_3px_0px_#000]"
          >
            <span className="text-lg">🎒</span>
            <span>OBJETOS</span>
            <span className="text-[10px] font-pixel">({player.inventory.length})</span>
          </button>

          <button
            disabled={!isPlayerTurn || isDodgeActive || enemy.isBoss}
            onClick={handleFlee}
            className="nes-btn p-3 bg-stone-800 hover:bg-stone-700 disabled:opacity-30 text-stone-200 font-bungee text-xs rounded cursor-pointer flex flex-col items-center justify-center gap-1 shadow-[3px_3px_0px_#000]"
          >
            <span className="text-lg">🏃</span>
            <span>HUIR</span>
            <span className="text-[10px] font-pixel">{enemy.isBoss ? 'Bloqueado' : '50% éxito'}</span>
          </button>
        </div>

        {/* Quick Item Drawer in Combat */}
        {isItemsOpen && (
          <div className="nes-box p-3 bg-stone-900 border-2 border-emerald-500 mb-4 animate-fadeIn">
            <span className="font-bungee text-xs text-emerald-400 block mb-2">
              SELECCIONA UN OBJETO PARA USAR:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto">
              {player.inventory.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleUseCombatItem(item)}
                  className="nes-btn p-2 bg-stone-800 hover:bg-stone-700 text-left rounded text-xs flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    <span className="font-pixel text-stone-200">{item.name}</span>
                  </div>
                  <span className="font-pixel text-emerald-400 font-bold">Usar</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Combat Bitácora / Live Logs */}
        <div className="nes-box p-3 bg-black border-2 border-stone-800 font-pixel text-xs space-y-1">
          <div className="font-bungee text-[11px] text-stone-400 mb-1 border-b border-stone-900 pb-0.5">
            REGISTRO DE BATALLA:
          </div>
          {combatLogs.map((log, index) => (
            <div key={index} className="text-stone-300">
              {log}
            </div>
          ))}
        </div>

        {/* Trivia Popup Modal Trigger */}
        {activeTrivia && (
          <TriviaModal
            question={activeTrivia}
            onAnswer={handleTriviaAnswer}
          />
        )}

      </div>
    </div>
  );
};
