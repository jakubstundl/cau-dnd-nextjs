import { NextApiRequest, NextApiResponse } from "next"
import { trpcClient } from "utils/trpc"

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const {user, password} = req.body;
    
    if( user === 'Admin' && password === 'veryComplicatedPasswordAndHardToHack' ) {
        try {
            const result = await trpcClient.dbRouter.deleteTestingUnit.mutate()
            res.status(200).send({body: result})
        } catch (error: any) {
            res.status(500).send({body: error.message})
        }
    }
    else res.status(401)
}