
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react";
import { trpc } from "utils/trpc";


const resetPassword = () => {
    const router = useRouter()
    const passResToken = router.query.passwordToken as string || ''

    const [isValid, setIsValid] = useState(false)
    const actuallDate: Date = new Date()
    const email = trpc.userSettings.getEmailForgotPassword.useQuery(passResToken)  
    const changePassProc = trpc.userSettings.changePassByEmail.useMutation() 
    const dateFromDB = email.data?.expiration as Date
    console.log('database date: ',dateFromDB, 'newDate:', actuallDate)
    const newPass = useRef<HTMLFormElement>(null)
    const [message, setMessage] = useState<string>()

    const handleSubmit = async(event: React.SyntheticEvent) => {

        const newPassword = newPass.current?.elements[0] as HTMLInputElement
        const newPasswordConfirm = newPass.current?.elements[1] as HTMLInputElement
        console.log(email.data?.email)
        event.preventDefault()
        if(newPassword.value !== newPasswordConfirm.value){
               setMessage('Password dont match')
               return
        }
        if(newPassword.value.length < 4 && newPasswordConfirm.value.length < 4){
            setMessage('Password must contain at least 5 characters')
            return
        } 

        const result = await changePassProc.mutateAsync({
            email: email.data?.email as string,
            newPassword: newPassword.value
        })
        setMessage(result)

    }

    useEffect(() => {
        if(dateFromDB > actuallDate){
            setIsValid(true)

        }
    },[dateFromDB, message])
        
    
    

    return (
       <>
        {isValid ? 
            <div>
                <form ref={newPass} onSubmit={handleSubmit}>
                    <input placeholder="new password"/>
                    <input placeholder="confirm new password"/>
                    <button type="submit">Save password</button>
                </form>
                <p>{message}</p>
            </div> 
            : 
            <div>Your token expired</div>
        }
       </>
    )
}

export default resetPassword

