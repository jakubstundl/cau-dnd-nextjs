import { NextApiRequest, NextApiResponse } from "next";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2022-11-15'
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { quantity } = req.body
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{            
            price: process.env.PRICE_ID, 
            quantity: quantity,
        }],
        mode: "payment",
        success_url: `${process.env.APP_URL}/payment_result?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.APP_URL}/payment_result?session_id={CHECKOUT_SESSION_ID}`
    })
    res.status(200).json({ sessionId: session.id })
}