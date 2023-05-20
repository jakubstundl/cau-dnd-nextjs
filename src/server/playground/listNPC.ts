export const listNPC: listNPCinterface = {
    demon: {
      name: 'demon',
      img: '/npc/demon2.svg',
      hp: 500,
      cur_hp: 500,
      dmg: 3500,
      pwr: 20,
      exp: 500,
    },
    zombie: {
      name: 'zombie',
      img: '/npc/zombie1.svg',
      hp: 20,
      cur_hp: 20,
      dmg: 3,
      pwr: 1,
      exp: 10,
    },
    bandit: {
      name: 'skaven',
      img: '/npc/skaven2.svg',
      hp: 50,
      cur_hp: 50,
      dmg: 7,
      pwr: 2,
      exp: 20,
    },
    sheep: {
      name: 'Innocent_Ales',
      img: '/npc/sheep.svg',
      hp: 1,
      cur_hp: 1,
      dmg: 0,
      pwr: 0,
      exp: 0,
    }
};

export interface listNPCinterface {
    demon: specificNPC;
    zombie: specificNPC;
    bandit: specificNPC;
    sheep: specificNPC;
}

export interface specificNPC {
    name: string;
    img: string;
    hp: number;
    cur_hp: number;
    dmg: number;
    pwr: number;
    exp: number;
}