import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { KeyboardEvent, useRef } from 'react';
import DontHaveAccount from './DontHaveAccount';
import ExternalLogin from './ExternalLogin';
import ForgotPassword from './ForgotPassword';

export default function LoginForm(props: { message: string }) {
  const router = useRouter();
  const sessionData = useSession();
  const input = useRef<HTMLFormElement>(null);

  const submitForm = () => {
    if (input.current) {
      const email = input.current.elements[0] as HTMLInputElement;
      const password = input.current.elements[1] as HTMLInputElement;
      signIn('credentials', {
        email: email.value,
        password: password.value,
        redirect: false,
      }).then((response) => {
        if (response?.error === 'CredentialsSignin' || response?.error === "Cannot read properties of null (reading 'password')" || response?.error === "Cannot read properties of null (reading 'email')") {
          router.push('/login', { query: { error: 'true' } }); //
        } else {
          if(sessionData.data?.user?.id){
            router.push(`/user/${sessionData.data.user.id}`);
          } else {
            router.push('/user');

          }
        }
      });
    }
  };

  const handleEnter = (e: KeyboardEvent<HTMLFormElement>) => {
    if(e.key === 'Enter') {
      submitForm();
    }
  }

  return (
    <>
      <div className=" flex flex-col items-center justify-center  font-LOTR md:h-screen ">
        <div className="fixed z-10 flex h-screen w-screen items-center justify-center">
          <div className="background "></div>
        </div>
        <div className="rounded-x gold goldnohover z-30 space-y-5  p-10 drop-shadow-lg">
          <h1 className="text-center font-LOTR text-3xl">Sign In</h1>
          <div
            test-id="login-message"
            className="text-center text-lg text-red-600"
          >
            {props.message && props.message}
          </div>
          <form ref={input} className="flex flex-col space-y-2" onKeyDown={(e) => {handleEnter(e)}}>
            <label className="text-sm" htmlFor="email">
              Email
            </label>
            <input
              className="w-96 rounded-md border border-yellow-400 bg-transparent px-3 py-2"
              type="email"
              name="email"
              autoComplete='email'
              id="email"
            />
            <label className="text-sm" htmlFor="password">
              Password
            </label>
            <input
              className="w-96 rounded-md border border-yellow-400 bg-transparent px-3 py-2"
              type="password"
              name="password"
              autoComplete='current-password'
              id="password"
            />
          </form>

          <button
            className="goldeffect w-full rounded-md border border-yellow-400 px-10 py-2"
            onClick={submitForm}
            test-id='login-submit'
          >
            Login with Credentials
          </button>

          <div className="flex justify-around">
            <ExternalLogin provider="discord" />
            <ExternalLogin provider="google" />
          </div>

          <ForgotPassword />
          <DontHaveAccount />
        </div>
      </div>
    </>
  );
}
