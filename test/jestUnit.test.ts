import { test, expect } from '@jest/globals';
import { appRouter } from '../src/server/routers/_app';
import { Session } from 'next-auth';

test('Health check test', async () => {
  const caller = appRouter.createCaller({ session: null });
  const result = await caller.healthcheck();
  expect(result).toBe('yay!');
});

test('getSecretMessage test', async () => {
  const mockSession: Session = {
    expires: new Date().toISOString(),
    user: { id: 'test', emailVerified: true, premium: true },
  };
  const caller = appRouter.createCaller({
    session: mockSession,
  });
  const result = await caller.auth.getSecretMessage();
  expect(result).toBe('you can now see this secret message!');
});

test('verify email', async () => {
  const caller = appRouter.createCaller({
    session: null,
  });
  const result = await caller.backend.veryfiEmail({ token: '1232' });
  expect(result).toEqual({ message: 'Invalid token' });
});

test('getAllRaces', async () => {
  const caller = appRouter.createCaller({
    session: null,
  });
  const result = await caller.dbRouter.getAllRaces();
  expect(result).toEqual([
    {
      char: 0,
      con: 0,
      description:
        'Elves are a magical people of otherworldly grace, living in the world but not entirely part of it.',
      dex: 2,
      id: 1,
      int: 0,
      longer_desc:
        'I have never imagined such beauty existed,” Goldmoon said softly. The day’s march had been difficult, but the reward at the end was beyond their dreams. The companions stood on a high cliff over the fabled city of Qualinost.  Four slender spires rose from the city’s corners like glistening spindles, their brilliant white stone marbled with shining silver. Graceful arches, swooping from spire to spire, soared through the air.',
      name: 'elf',
      str: 0,
      wis: 0,
    },
    {
      char: 0,
      con: 1,
      description:
        'Humans are the most adaptable and ambitious people among the common races. Whatever drives them, humans are the innovators, the achievers, and the pioneers of the worlds.',
      dex: 1,
      id: 2,
      int: 1,
      longer_desc:
        'These were the stories of a restless people who long ago took to the seas and rivers in longboats, first to pillage and terrorize, then to settle. Yet there was an energy, a love of adventure, that sang from every page. Long into the night Liriel read, lighting candle after precious candle.  She’d never given much thought to humans, but these stories fascinated her. ',
      name: 'human',
      str: 1,
      wis: 1,
    },
    {
      char: 0,
      con: 0,
      description:
        'Dragonborn look very much like dragons standing erect in humanoid form, though they lack wings or a tail.',
      dex: 0,
      id: 3,
      int: 0,
      longer_desc:
        'Her father stood on the first of the three stairs that led down from the portal, unmoving. The scales of his face had grown paler around the edges, but Clanless Mehen still looked as if he could wrestle down a dire bear himself. His familiar well-worn armor was gone, replaced by violet-tinted scale armor with bright silvery tracings. There was a blazon on his arm as well, the mark of some foreign house. ',
      name: 'dragonborn',
      str: 2,
      wis: 0,
    },
    {
      char: 0,
      con: 2,
      description:
        'Bold and hardy, dwarves are known as skilled warriors, miners, and workers of stone and metal.',
      dex: 0,
      id: 4,
      int: 0,
      longer_desc:
        'Yer late, elf!” came the rough edge of a familiar voice. Bruenor Battlehammer walked up the back of his dead foe, disregarding the fact that the heavy monster lay on top of his elven friend. In spite of the added discomfort, the dwarf’s long, pointed, often-broken nose and gray-streaked though still-fiery red beard came as a welcome sight to Drizzt. “Knew I’d find ye in trouble if I came out an’ looked for ye!”',
      name: 'dwarf',
      str: 0,
      wis: 0,
    },
    {
      char: 0,
      con: 0,
      description:
        'A gnome’s energy and enthusiasm for living shines through every inch of his or her tiny body.',
      dex: 0,
      id: 5,
      int: 2,
      longer_desc:
        'Skinny and flaxen-haired, his skin walnut brown and his eyes a startling turquoise, Burgell stood half as tall as Aeron and had to climb up on a stool to look out the peephole. Like most habitations in Oeble, that particular tenement had been built for humans, and smaller residents coped with the resulting awkwardness as best they could.  But at least the relative largeness of the apartment gave Burgell room to pack in all his gnome-sized gear.',
      name: 'gnome',
      str: 0,
      wis: 0,
    },
    {
      char: 0,
      con: 0,
      description:
        'Half-elves combine what some say are the best qualities of their elf and human parents.',
      dex: 0,
      id: 6,
      int: 0,
      longer_desc:
        'Flint squinted into the setting sun. He thought he saw the figure of a man striding up the path. Standing, Flint drew back into the shadow of a tall pine to see better. The man’s walk was marked by an easy grace—an elvish grace, Flint would have said; yet the man’s body had the thickness and tight muscles of a human, while the facial hair was definitely humankind’s. All the dwarf could see of the man’s face beneath a green hood was tan skin and a brownish-red beard.',
      name: 'half-elf',
      str: 0,
      wis: 0,
    },
    {
      char: 0,
      con: 0,
      description:
        'The diminutive halflings survive in a world full of larger creatures by avoiding notice or, barring that, avoiding offense.',
      dex: 2,
      id: 7,
      int: 0,
      longer_desc:
        'Regis the halfling, the only one of his kind for hundreds of miles in any direction, locked his fingers behind his head and leaned back against the mossy blanket of the tree trunk. Regis was short, even by the standards of his diminutive race, with the fluff of his curly brown locks barely cresting the three-foot mark, but his belly was amply thickened by his love of a good meal, or several, as the opportunities presented themselves.',
      name: 'halfling',
      str: 0,
      wis: 0,
    },
    {
      char: 0,
      con: 1,
      description:
        'Some half-orcs rise to become proud leaders of orc communities. Some venture into the world to prove their worth. Many of these become adventurers, achieving greatness for their mighty deeds.',
      dex: 0,
      id: 8,
      int: 0,
      longer_desc:
        'The warchief Mhurren roused himself from his sleeping-furs and his women and pulled a short hauberk of heavy steel rings over his thick, well-muscled torso. He usually rose before most of his warriors, since he had a strong streak of human blood in him, and he found the daylight less bothersome than most of his tribe did. Among the Bloody Skulls, a warrior was judged by his strength, his fierceness, and his wits. Human ancestry was no blemish against a warrior',
      name: 'half-orc',
      str: 2,
      wis: 0,
    },
    {
      char: 0,
      con: 0,
      description:
        'To be greeted with stares and whispers, to suffer violence and insult on the street, to see mistrust and fear in every eye: this is the lot of the tiefling.',
      dex: 0,
      id: 9,
      int: 1,
      longer_desc:
        '“I know you have.” When she glared at him, he added, “It’s not as if I’m plumbing the depths of your mind, dear girl. That is the burden of every tiefling. Some break under it, some make it the millstone around their neck, some revel in it.” He tilted his head again, scrutinizing her, with that wicked glint in his eyes. “You fight it, don’t you? Like a little wildcat, I wager. Every little jab and comment just sharpens your claws.”',
      name: 'tiefling',
      str: 0,
      wis: 0,
    },
  ]);
});
