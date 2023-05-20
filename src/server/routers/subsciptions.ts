import { observable } from '@trpc/server/observable';
import { prisma } from '../db/client';
import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import { Subject } from 'rxjs';
import { Characters } from '@prisma/client';
import { pg } from './playground';

const subject = new Subject<string>();
const chatMsg = new Subject<string>();
const online = new Subject<string>();
const onlineChars = new Subject<any>();
const playerToRemove = new Subject<string>();
const startGame = new Subject<any>();

export const wsRouter = router({
  sub: protectedProcedure.subscription(() => {
    console.log('subscribed');
    return observable<string>((emit) => {
      subject.subscribe((x: string) => {
        emit.next(x);
      });
    });
  }),

  input: protectedProcedure
    .input(z.object({ typing: z.string() }))
    .mutation(async ({ input }) => {
      subject.next(input.typing);
    }),

  sendMessage: protectedProcedure
    .input(z.object({ typing: z.string() }))
    .mutation(async ({ input, ctx }) => {
      console.log('-----', input.typing);

      chatMsg.next(`${ctx.session.user.name}: ${input.typing}`);
    }),

  recieveMessage: protectedProcedure.subscription(() => {
    return observable<string>((emit) => {
      chatMsg.subscribe((x: string) => {
        emit.next(x);
      });
    });
  }),
  imOnline: protectedProcedure.mutation(async ({ ctx }) => {
    online.next(ctx.session.user.name as string);
  }),

  onlinePlayers: protectedProcedure.subscription(() => {
    return observable<string>((emit) => {
      online.subscribe((x: string) => {
        emit.next(x);
      });
    });
  }),
  onlinePlayersWithChars: protectedProcedure
    .input(z.object({ char_id: z.number(), ready: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      const result = await prisma.characters.findFirst({
        where: { id: input.char_id, owner_id: ctx.session.user.id },
      });
      onlineChars.next({
        char_id: input.char_id,
        name: ctx.session.user.name,
        hero_name: result?.name,
        class: result?.class,
        race: result?.race,
        ready: input.ready,
      });
    }),
  onlinePlayersAfterLogin: protectedProcedure.subscription(() => {
    return observable<any>((emit) => {
      onlineChars.subscribe((x: any) => {
        emit.next(x);
      });
    });
  }),
  inGameRecieveMessage: protectedProcedure.subscription(() => {
    return observable<string>((emit) => {
      chatMsg.subscribe((x: string) => {
        emit.next(x);
      });
    });
  }),
  inGameSendMessage: protectedProcedure
    .input(z.object({ typing: z.string() }))
    .mutation(async ({ input, ctx }) => {
      chatMsg.next(`${ctx.session.user.name}: ${input.typing}`);
    }),

  removePlayer: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input }) => {
      playerToRemove.next(input.name);
    }),

  sendRemovedPlayer: protectedProcedure.subscription(() => {
    return observable<string>((emit) => {
      playerToRemove.subscribe((x: string) => {
        emit.next(x);
      });
    });
  }),

  sendStart: protectedProcedure.input(z.any()).mutation(async ({ input }) => {
    const chars: Characters[] = [];
    for (const player in input) {
      input[player].char_id;
      const playableChar = await prisma.characters.findUniqueOrThrow({
        where: { id: input[player].char_id },
      });
      chars.push(playableChar);
    }

    pg.setPlayers(chars);

    startGame.next(true);
  }),
  startGame: protectedProcedure.subscription(() => {
    return observable<boolean>((emit) => {
      startGame.subscribe((x: boolean) => {
        emit.next(x);
      });
    });
  }),
});
