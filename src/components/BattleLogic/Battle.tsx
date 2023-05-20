import Dice from 'components/Dice';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import styles from '../../styles/Battle.module.css';
import { NPC, Characters, Spell, QuestsForCharacters, Quest } from '@prisma/client';
import { useSession } from 'next-auth/react';
import ResultScreen from './ResultScreen';
import { trpc } from 'utils/trpc';

const Battle = ({
  exitBattleHeroWin,
  exitBattleNpcWin,
  runFromBattle,
  heroInput,
  enemyInput,
  skillOne,
  skillTwo,
  skillthree,
}: {
  exitBattleHeroWin: (hero: Characters, npc: NPC) => void;
  exitBattleNpcWin: (hero: Characters, npc: NPC) => void;
  runFromBattle: (hero: Characters, npc: NPC) => void;
  heroInput: Characters;
  skillOne: Spell;
  skillTwo: Spell;
  skillthree: Spell;
  enemyInput: NPC;
}) => {
  const [luck, setLuck] = useState<number>(0);
  const [damage, setDamage] = useState({
    damage: 0,
    name: '',
    cooldown: 0,
    skill: 0,
  });
  const acceptedQuests = trpc.dbRouter.getAcceptedQuests.useMutation();
  const [questId, setQuestId] = useState<number>();
  const [rolled, setRolled] = useState(false);
  const combatlog = useRef<HTMLDivElement>(null);
  const [spellOne, setSpellOne] = useState<{
    name: string;
    id: number;
    description: string;
    damage: number;
    cooldown: number;
    remainingCD: number;
  }>({
    name: skillOne.name || '',
    id: skillOne.id || 0,
    description: skillOne.description || '',
    damage: skillOne.damage || 0,
    cooldown: skillOne.cooldown || 0,
    remainingCD: skillOne.cooldown || 0,
  });
  const [spellTwo, setSpellTwo] = useState<{
    name: string;
    id: number;
    description: string;
    damage: number;
    cooldown: number;
    remainingCD: number;
  }>({
    name: skillTwo.name || '',
    id: skillTwo.id || 0,
    description: skillTwo.description || '',
    damage: skillTwo.damage || 0,
    cooldown: skillTwo.cooldown || 0,
    remainingCD: skillTwo.cooldown || 0,
  });
  const [spellthree, setSpellthree] = useState<{
    name: string;
    id: number;
    description: string;
    damage: number;
    cooldown: number;
    remainingCD: number;
  }>({
    name: skillthree.name || '',
    id: skillthree.id || 0,
    description: skillthree.description || '',
    damage: skillthree.damage || 0,
    cooldown: skillthree.cooldown || 0,
    remainingCD: skillthree.cooldown || 0,
  });
  const skillArray = trpc.dbRouter.getSkills.useMutation();
  const completeQ = trpc.dbRouter.completeQuest.useMutation();
  const handleClickHeroWin = () => {
    if (questId)
      completeQ.mutate({ questId: questId, heroName: heroInput.name });
    exitBattleHeroWin(hero, enemy);
  };
  const handleClickNpcWin = () => {
    exitBattleNpcWin(hero, enemy);
  };
  const handleClickRetreat = () => {
    runFromBattle(hero, enemy);
  };

  const [enemy, setEnemy] = useState<NPC>(enemyInput);

  const [hero, setHero] = useState<Characters>(heroInput);
  useEffect(() => {
    skillArray.mutate(hero.class);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    acceptedQuests.mutate(heroInput.name);
  }, []);

  useEffect(() => {
    if (skillArray.data && skillArray.data[0].spell) {
      setSpellOne({
        name: skillArray.data[0].spell.name as string,
        id: skillArray.data[0].spell.id as number,
        description: skillArray.data[0].spell.description as string,
        damage: skillArray.data[0].spell.damage as number,
        cooldown: skillArray.data[0].spell.cooldown as number,
        remainingCD: 0,
      });
    }
    if (skillArray.data && skillArray.data[1].spell) {
      setSpellTwo({
        name: skillArray.data[1].spell.name as string,
        id: skillArray.data[1].spell.id as number,
        description: skillArray.data[1].spell.description as string,
        damage: skillArray.data[1].spell.damage as number,
        cooldown: skillArray.data[1].spell.cooldown as number,
        remainingCD: 0,
      });
    }
    if (skillArray.data && skillArray.data[2].spell) {
      setSpellthree({
        name: skillArray.data[2].spell.name as string,
        id: skillArray.data[2].spell.id as number,
        description: skillArray.data[2].spell.description as string,
        damage: skillArray.data[2].spell.damage as number,
        cooldown: skillArray.data[2].spell.cooldown as number,
        remainingCD: 0,
      });
    }
  }, [skillArray.data]);
  const combatProcderure = (inputdamage: {
    damage: number;
    name: string;
    cooldown: number;
    skill: number;
  }) => {
    setRolled(false);
    let heroDamage = 0;

    if (spellOne.remainingCD && spellOne.remainingCD > 0) {
      const devCooldown = spellOne.remainingCD - 1;
      setSpellOne((prev) => ({
        ...prev,
        remainingCD: devCooldown,
      }));
    }

    if (spellTwo.remainingCD && spellTwo.remainingCD > 0) {
      const devCooldown = spellTwo.remainingCD - 1;
      setSpellTwo((prev) => ({
        ...prev,
        remainingCD: devCooldown,
      }));
    }

    if (spellthree.remainingCD && spellthree.remainingCD > 0) {
      const devCooldown = spellthree.remainingCD - 1;
      setSpellthree((prev) => ({
        ...prev,
        remainingCD: devCooldown,
      }));
    }
    switch (inputdamage.skill) {
      case 1: {
        setSpellOne((prev) => ({
          ...prev,
          remainingCD: skillOne.cooldown as number,
        }));
        break;
      }
      case 2: {
        setSpellTwo((prev) => ({
          ...prev,
          remainingCD: skillTwo.cooldown as number,
        }));
        break;
      }
      case 3: {
        setSpellthree((prev) => ({
          ...prev,
          remainingCD: skillthree.cooldown as number,
        }));
        break;
      }
    }
    switch (luck) {
      case 1:
      case 2:
      case 3:
      case 4: {
        break;
      }
      case 17:
      case 18:
      case 19: {
        heroDamage = damage.damage;
        break;
      }
      case 20: {
        heroDamage = damage.damage * 2;
        break;
      }
      default: {
        heroDamage = Math.ceil(Math.random() * damage.damage);
        break;
      }
    }
    const enemyDamage: number = Math.ceil(
      Math.random() * enemy.dmg + enemy.power,
    );
    let heroHpAfterAttack = hero.currentHP - enemyDamage;
    let enemyHpAfterAttack: number = enemy.cur_hp - heroDamage;
    if (combatlog.current)
      combatlog.current.innerText +=
        ` ${hero.name} did: ` +
        heroDamage +
        ` damage\n` +
        `${enemy.name} did: ` +
        enemyDamage +
        ' damage\n';

    if (enemyHpAfterAttack < 0) {
      enemyHpAfterAttack = 0;
    }
    setEnemy((enemy) => {
      return { ...enemy, cur_hp: enemyHpAfterAttack };
    });

    if (heroHpAfterAttack < 0) {
      heroHpAfterAttack = 0;
    }
    if (enemyHpAfterAttack > 0) {
      setHero((hero) => {
        return { ...hero, currentHP: heroHpAfterAttack };
      });
    }
  };
  //solving end of the battle
  const [enemyDead, setEnemyDead] = useState(false);
  const [heroDead, setHeroDead] = useState(false);
  useEffect(() => {
    if (enemy.cur_hp === 0) {
      setEnemyDead(true);
    }
    if (hero.currentHP === 0) {
      setHeroDead(true);
    }
  }, [enemy.cur_hp, hero.currentHP]);

  useEffect(() => {
    if (luck > 0) {
      combatProcderure(damage);
      setDamage({
        damage: 0,
        name: '',
        cooldown: 0,
        skill: 0,
      });
    }
  }, [luck]);
  useEffect(() => {
    if (acceptedQuests.isSuccess && acceptedQuests.data) {
      const id = acceptedQuests.data
        .filter((e:{ quest: Quest; completed: boolean | null; }) => e.quest.objective == enemyInput.name)
        .map((e:{ quest: Quest; completed: boolean | null; }) => e.quest.id);
      setQuestId(id[0]);
    }
  }, [acceptedQuests.data]);

  // eslint-disable-next-line react-hooks/exhaustive-deps

  const roll = async (n: number) => {
    setTimeout(() => {
      setLuck(n);
    }, 2000);
  };
  const sessionData = useSession();

  return (
    <div key={sessionData.data?.user?.id} className={styles.container}>
      <div className={styles.enemy}>
        <div className={styles.enemystats}>
          <h1>fighting</h1>
          <h2>Name:{enemy.name}</h2>
          <h2>HP:{enemy.cur_hp}</h2>
          <progress
            value={enemy.cur_hp}
            className={styles.healthbar}
            max={enemy.hp}
          ></progress>
        </div>
        <Image
          src={enemy.img || '/npc/dragon.gif'}
          width="500"
          height="500"
          alt="/npc/dragon.gif"
        />
      </div>
      <div className={styles.abilitties}>
        <h2>Skills</h2>
        {skillArray.data && (
          <button
            title={`remaining cooldown: ${spellOne.remainingCD}, ${spellOne.description}`}
            onClick={() => setDamage({ ...spellOne, skill: 1 })}
            disabled={
              (spellOne.remainingCD as number) > 0 || heroDead || enemyDead
                ? true
                : false
            }
          >
            {spellOne.name}
          </button>
        )}
        <br />
        {skillArray.data && (
          <button
            title={`remaining cooldown: ${spellTwo.remainingCD} ,${spellTwo.description}`}
            onClick={() => setDamage({ ...spellTwo, skill: 2 })}
            disabled={
              spellTwo.remainingCD > 0 || heroDead || enemyDead ? true : false
            }
          >
            {spellTwo.name}
          </button>
        )}
        <br />
        {skillArray.data && (
          <button
            title={`remaining cooldown: ${spellthree.remainingCD}, ${spellthree.description}`}
            onClick={() => setDamage({ ...spellthree, skill: 3 })}
            disabled={
              spellthree.remainingCD > 0 || heroDead || enemyDead ? true : false
            }
          >
            {spellthree.name}
          </button>
        )}
      </div>
      <button
        disabled={heroDead || enemyDead ? true : false}
        className={styles.run}
        onClick={handleClickRetreat}
      >
        RUN!
      </button>
      <div className={styles.stats}>
        <h2>HP:{hero.currentHP}</h2>
        <progress
          value={hero.currentHP}
          className={styles.healthbar}
          max={hero.maxHP}
        >
          {hero.currentHP}/{hero.maxHP}
        </progress>
      </div>
      <div className={styles.hero}>
        <Image
          src="/npc/paladin.gif"
          width="200"
          height="200"
          alt="/paladin.png"
        />
      </div>
      <div className={styles.dice}>
        {damage.damage > 0 && (
          <Dice
            setLuck={roll}
            rolled={rolled}
            setRolled={() => setRolled(true)}
          />
        )}
      </div>
      <div className={styles.combatlog}>
        <h2>combat log</h2>
        <div className={styles.combattext} ref={combatlog}></div>
      </div>
      {heroDead && (
        <ResultScreen handleClick={handleClickNpcWin} whosIsDead={'hero'} />
      )}
      {enemyDead && (
        <ResultScreen handleClick={handleClickHeroWin} whosIsDead={'enemy'} />
      )}
    </div>
  );
};

export default Battle;
