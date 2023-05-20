import { router, publicProcedure } from '../trpc';
import { prisma } from '../db/client'

import { sendEmailVerificationToken } from './mail';
import { hashToken } from '../../pages/api/auth/jwt';

import { z } from 'zod';

import { User } from 'next-auth';


type UserPassword = { password: string } 

export const userSettRouter = router({
    passwordCheck: publicProcedure
        .input(z.object({ 
            userId: z.string(),
        }))
        .query(async({input }) => {      
            try {
                const userPass = await prisma.user.findUnique({
                    where: { id: input.userId } ,
                    select: { password: true }
                }) as UserPassword    
                    return userPass.password
            } catch (e) {
                return `Cannot acces data from database, error:${e}`
            }
        }),

    userImage: publicProcedure 
        .input(z.object({
            userId: z.string(),
        }))
        .mutation(async( {input} ) => {
            try {
                const getUserImage = await prisma.user.findUnique({
                    where: {
                        id: input.userId
                    },
                    select: {
                        image: true
                    }
                })
                return getUserImage?.image
            } catch (e) {
                return `Cannot acces database, error: ${e}`
            }
        }),

    changeUserImage: publicProcedure
        .input(z.object({
            newImage: z.string(),
            userId: z.string(),
        }))    
        .mutation(async({input}) => {
            try {
                await prisma.user.update({
                    where: {
                        id: input.userId
                    },
                    data: {
                        image: input.newImage
                    }
                })
                return 'succesfully changed image'
            } catch (e) {
                return `Cannot update database, Error: ${e}`
            }
        }),
        passwordChange: publicProcedure
        .input(z.object({ 
            newPassword: z.string(),
            userId: z.string(),
        }))
        .mutation(async({ input }) => {      
            try {          
                    await prisma.user.update({
                        where: { 
                            id: input.userId
                        },
                        data: {
                            password: input.newPassword
                        }  
                    }) as User
                    return `Succesfully changed password`
            } catch (e) {
                return `Cannot acces data from database, error:${e}`
            }
        }),
        getEmail: publicProcedure
        .input(z.string())
        .query(async({input}) => {
            try {
                const email = await prisma.user.findUnique({
                    where: {
                        email: input
                    },
                    select: {
                        emailVerified: true
                    }
                })
                if(email?.emailVerified){
                    return true                       
                } else {
                    return false
                }
            } catch (e) {
                return `Error:${e}`
            }
        }),
        passwordResetToken: publicProcedure
        .input(z.string())
        .mutation(async({input}) => {
            const timeOfExpiration = new Date();
            timeOfExpiration.setMinutes(timeOfExpiration.getMinutes() + 10);
            let pasResToken = ''
            for(let index = 0; index < 10; index++){
                const pasResTokenGen = String.fromCharCode(Math.floor(Math.random()*26) + 97)
                pasResToken += pasResTokenGen
            }
            try {
                const deleteAllPrevTokens = await prisma.forgotenPassword.deleteMany({
                    where: {
                        email: input
                    }
                })

                const passResetToken = await prisma.forgotenPassword.create({
                    data: {
                        expiration: timeOfExpiration,
                        token: pasResToken,
                        email: input
                    }
                })

                const message = process.env.HOST + `/resetPassword/?passwordToken=${pasResToken}`


                sendEmailVerificationToken(
                    input as string,
                  'Reset your password here',
                  message,
                );

                return passResetToken
            } catch(e){
                return `Error: ${e}`
            }}),
        getEmailForgotPassword: publicProcedure
            .input(z.string())
            .query( async({ input }) => {
                try {
                    const getEmailForgotPassword = await prisma.forgotenPassword.findFirst({
                        where: {
                            token: input
                        },
                        select: {
                            email: true,
                            expiration: true
                        }
                    })
                    return {
                        email: getEmailForgotPassword?.email,
                        expiration: getEmailForgotPassword?.expiration,
                        error: false
                    }
                } catch(e){
                    return {
                        email: '',
                        expiration: '',
                        error: e
                    }
                }
        }),
        changePassByEmail: publicProcedure
        .input(z.object({
            email: z.string(),
            newPassword: z.string()
        }))
            .mutation(async({input}) => {
                try {
                    const changePassWithEmail = await prisma.user.update({
                        where: {
                            email: input.email
                        },
                        data: {
                            password: hashToken(input.newPassword)
                        }
                    })

                    const getId = await prisma.forgotenPassword.findFirst({
                        where: {
                            email: input.email
                        },
                        select: {
                            id: true
                        }
                    })

                    const deleteResetPassToken = await prisma.forgotenPassword.delete({
                        where: {
                           id: getId?.id
                        }
                    })
                    return 'succesfully changed password' 
                } catch(e) {
                    return 'Error:' + e
                }
            })

})        