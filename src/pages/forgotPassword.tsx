
import { useRef, useState } from "react"
import { trpc, trpcClient } from "utils/trpc"
import Link from "next/link"

type ResultEmail = boolean | string 
type ResultToken = { id: number, token: string, expiration: Date, email: string} 

const ForgotPassword = () => {
    const [message, setMessage] = useState<string>()
    const email = useRef<HTMLInputElement>(null)
    const genToken = trpc.userSettings.passwordResetToken.useMutation()

    const handleClick = async () => {
        setMessage('If email exist, we have sended email for reseting password')
        const verifiedEmail: ResultEmail = await trpcClient.userSettings.getEmail.query(email.current?.value as string)
        if(verifiedEmail){
            const token =  await genToken.mutateAsync(email.current?.value as string)
        }
    }

    
    
    return(
        <>
            <input type='email' ref={email} placeholder='Your email'/>
            <button onClick={handleClick} >send verification email</button>
            <Link className="text-2xl p-2 text-black " href='/'>Home</Link>
            <p>{message}</p>
        </>
    )

}

export default ForgotPassword