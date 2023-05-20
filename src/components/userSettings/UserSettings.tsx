import { NextPage } from "next";
import { useEffect, useState } from "react";

import ChangePassword from "./ChangePasswordOption";
import UserImage from "./UserImage";

const UserSettings: NextPage = () => {
    const [changePasswordForm, setChangePasswordForm] = useState(false)
    const [changePasswordMessage , setChangePasswordMessage ] = useState<string>()
    const resultOf = (message: string) => {
        setChangePasswordMessage (message)
    }
    const onClose = () => {
        setChangePasswordForm(false)
        
    }

    useEffect(() => {
        setChangePasswordForm(false)
    },[changePasswordMessage ])
    return (

        <>  
            {!changePasswordForm && 
            <button onClick={() => setChangePasswordForm(true)} >Change password</button>
            }
            {changePasswordForm &&             
            <>
            <ChangePassword setChangePasswordMessage ={resultOf} />
            <button onClick={() => onClose()}>close</button>
            </>
            }
            <p>{ changePasswordMessage }</p>
            <UserImage/>
        </>
    )
}

export default UserSettings