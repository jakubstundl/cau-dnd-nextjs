import { Spell } from '@prisma/client'

export const spellOne: Spell = {
  name: 'Soul chain',
  id: 1,
  description: 'fucing badass chain with souls',
  damage: 50,
  cooldown: 5,
};

export const spellTwo: Spell = {
  name: 'fireball',
  id: 2,
  description: 'fucking little candle',
  damage: 20,
  cooldown: 0,
};

export const spellthree: Spell = {
  name: 'immolation',
  id: 3,
  description: 'flames wreathe one creature you can see within your range',
  damage: 15,
  cooldown: 3,
};
