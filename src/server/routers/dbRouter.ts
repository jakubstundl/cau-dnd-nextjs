import { router, publicProcedure } from '../trpc';
import { prisma } from '../db/client';
import { z } from 'zod';

export const dbRouter = router({
  getCharacters: publicProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const characters =
        (await prisma.characters.findMany({
          where: {
            owner_id: input,
          },
        })) || [];
      return characters;
    }),
  getRace: publicProcedure.input(z.string()).query(async ({ input }) => {
    const race = await prisma.race.findFirst({
      where: {
        name: input,
      },
    });
    return race;
  }),
  getAllRaces: publicProcedure.query(async () => {
    const races = await prisma?.race.findMany();
    return races;
  }),
  getClass: publicProcedure.input(z.string()).query(async ({ input }) => {
    const classDetail = await prisma.class.findFirst({
      where: {
        name: input,
      },
    });
    return classDetail;
  }),
  getAllClasses: publicProcedure.query(async () => {
    const classes = await prisma?.class.findMany();
    return classes;
  }),
  getUserById: publicProcedure.input(z.string()).query(async ({ input }) => {
    try {
      const foundUser = await prisma.user.findUnique({
        where: {
          id: input,
        },
      });
      return foundUser;
    } catch (error: any) {
      return `No user with id ${input} was found`;
    }
  }),
  deleteUser: publicProcedure.input(z.string()).mutation(async ({ input }) => {
    try {
      const deletedUser = await prisma.user.delete({
        where: {
          id: input,
        },
      });
      return deletedUser;
    } catch (error: any) {
      return `Unable to delete user with id ${input}`;
    }
  }),
  deleteCharacter: publicProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      try {
        const deletedCharacter = await prisma.characters.delete({
          where: {
            id: input,
          },
        });
        return deletedCharacter;
      } catch (error: any) {
        return `Unable to delete character with id ${input}`;
      }
    }),
  createPremium: publicProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      try {
        const newPremium = await prisma.premium_Membership.create({
          data: {
            userId: input,
            paidDate: new Date(),
            status: 'active',
          },
        });
        return newPremium;
      } catch (error) {
        return 'error has occured';
      }
    }),
  deleteTestingUnit: publicProcedure.mutation(async () => {
    try {
      await prisma.user.delete({
        where: {
          email: 'test@test.cz',
        },
      });
      return 'success';
    } catch (error: any) {
      return `Unable to delete tester`;
    }
  }),
  getCharacter: publicProcedure
    .input(
      z.object({
        charId: z.number(),
      }),
    )
    .mutation(async (input) => {
      const response = await prisma.characters.findFirst({
        where: {
          id: input.input.charId,
        },
      });

      return response;
    }),
  getNpc: publicProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(async (input) => {
      const response = await prisma.nPC.findFirst({
        where: {
          name: input.input.name,
        },
      });

      return response;
    }),

  getSkills: publicProcedure.input(z.string()).mutation(async (input) => {
    const respo = await prisma.spellsForClasses.findMany({
      where: {
        class: {
          name: input.input,
        },
      },
      select: {
        spell: true,
      },
    });
    return respo;
  }),
  getQuests: publicProcedure.mutation(async () => {
    const response = await prisma.quest.findMany({where:{NOT:{id:2}}});
    return response;
  }),
  acceptQuest: publicProcedure
    .input(z.object({ questId: z.number(), heroName: z.string() }))
    .mutation(async (input) => {
      const id = await prisma.characters.findFirst({
        where: { name: input.input.heroName },
        select: { id: true },
      });
      if (id) {
        const response = await prisma.questsForCharacters.create({
          data: {
            quest: {
              connect: { id: input.input.questId },
            },
            character: {
              connect: { id: id.id },
            },
            completed:false
          },
        });
        return response;
      }
    }),
    getAcceptedQuests:publicProcedure
      .input(z.string())
      .mutation(async(input)=>{

          const response = await prisma.questsForCharacters.findMany({
            where: {
              character: {
                name: input.input,
              },
            },
            select: {
              quest: true,
              completed:true
            },
          });
          return response
        }
      ),
      completeQuest: publicProcedure
        .input(z.object({heroName:z.string(),questId:z.number()}))
        .mutation(async(input)=>{
          const id = await prisma.characters.findFirst({
            where: { name: input.input.heroName },
            select: { id: true },
          });
          if (id){
          const complete = await prisma.questsForCharacters.update({
            where :{
              questId_charId:{questId:input.input.questId,charId:id.id}
            },
            data:{completed:true}
          }
          )
        }})
});
