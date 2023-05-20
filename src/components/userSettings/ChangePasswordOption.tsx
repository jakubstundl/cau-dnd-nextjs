import { useSession } from 'next-auth/react';
import { useRef, useState } from 'react';
import { trpc } from 'utils/trpc';
import * as crypto from 'crypto';




const ChangePasswordOption = (props: {setChangePasswordMessage: (message: string) => void}):JSX.Element => {

  const passwordInput = useRef<HTMLFormElement>(null);
  const [passwordStatus, setPasswordStatus] = useState("");
  
  const changeUserPassword = trpc.userSettings.passwordChange.useMutation()
  const session = useSession();
  const currentPass = passwordInput.current?.elements[0] as HTMLInputElement;
  const newPass = passwordInput.current?.elements[1] as HTMLInputElement;
  const confirmNewPass = passwordInput.current?.elements[2] as HTMLInputElement;

  const hashFn = (password: string) => {
    return crypto.createHash('sha512').update(password).digest('hex');
  }
  
  const userPassword = trpc.userSettings.passwordCheck.useQuery({userId: session.data?.user?.id as string});

  const handleClick = (ev: React.FormEvent<EventTarget>) => {
    ev.preventDefault()
    if (
      newPass.value === confirmNewPass.value
    ) {
      if(hashFn(currentPass.value) === userPassword.data){
        props.setChangePasswordMessage("Succesfully changed password")
        const hashedNewPass = hashFn(newPass.value)
        changeUserPassword.mutate({ 
          userId: session.data?.user?.id as string,
          newPassword: hashedNewPass
        })
        
        
      
    } else { 
      props.setChangePasswordMessage("incoreect password")
    }
  }else { props.setChangePasswordMessage("password dont match")}
};
  // if(userPassword.isSuccess){
  //   props.setChangePasswordSucces(passwordStatus)
  // }

  

  return (
    <>
      <form
        ref={passwordInput}
        onSubmit={handleClick}
        className="flex flex-col"
      >
        <div className="flex gap-1">
          <input
            className="rounded-md border bg-transparent px-3 py-2"
            type="password"
            placeholder="current password"
            required
          />
          <input className="rounded-md border bg-transparent px-3 py-2" type="password" placeholder="new password" required/>
          <input className="rounded-md border bg-transparent px-3 py-2" type="password" placeholder=" confirm new password" required/>
        </div>
        <p test-id="success">{passwordStatus}</p>
        <div className="self-center">
          <button type="submit">change password</button>
        </div>
      </form>
    </>
  );
};


export default ChangePasswordOption;
