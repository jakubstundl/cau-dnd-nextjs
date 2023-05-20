import { type NextPage } from 'next';
import { useEffect, useRef } from 'react';
import { trpc } from '../utils/trpc';
import VideoBackground from '../components/VideoBackground';
import React from 'react';
import { useRouter } from 'next/router';
import { NavigationBar } from 'components/NavigationBar';
import Header from 'components/general/Header';

const Register: NextPage = () => {
  const router = useRouter();
  const creation = trpc.backend.registration.useMutation();
  const regForm = useRef<HTMLFormElement>(null);

  const submitForm = async () => {
    if (regForm.current) {
      const email = regForm.current[0] as HTMLInputElement;
      const name = regForm.current[1] as HTMLInputElement;
      const password = regForm.current[2] as HTMLInputElement;
      const confirmPassword = regForm.current[3] as HTMLInputElement;
      if (
        password.checkValidity() &&
        confirmPassword.checkValidity() &&
        name.checkValidity() &&
        email.checkValidity()
      ) {
        if (password.value == confirmPassword.value) {
          creation.mutate({
            email: email.value,
            password: password.value,
            name: name.value,
            match: true,
          });
        } else {
          creation.mutate({
            email: email.value,
            password: password.value,
            name: name.value,
            match: false,
          });
        }
      } else {
        alert(
          'All inputs are required and must have between 4-30 characters and email must be valid',
        );
      }
    }
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      submitForm();
    }
  };

  useEffect(() => {
    if (creation.data === 'Successfully registered') {
      router.push('/login#registered');
    }
  }, [creation.data, router]);

  return (
    <>
      <VideoBackground />
      <NavigationBar />
      <Header title="Registration" />
      <div className="fixed z-10 flex h-screen w-screen items-center justify-center">
        <div className="background "></div>
      </div>
      <div className=" absolute z-30 flex h-screen w-screen items-center justify-center">
        <form
          ref={regForm}
          className=" gold goldnohover space-y-5 rounded-xl bg-transparent bg-white p-10 font-LOTR text-xl drop-shadow-lg"
          onKeyDown={(e) => handleEnter(e)}
        >
          <h1 className="text-center text-3xl">Registration</h1>
          <div className="flex flex-col space-y-2">
            <div
              test-id="registration-error-response"
              className="text-center text-lg text-red-600"
            >
              {creation.data}
            </div>
            <label className="text-sm font-light" htmlFor="email">
              Email:
            </label>
            <input
              className=" w-96 rounded-md border border-yellow-400 bg-transparent px-3 py-2 "
              type="email"
              name="email"
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
              autoComplete="email"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label
              className=" bg-transparent text-sm font-light"
              htmlFor="name"
            >
              Name:
            </label>
            <input
              className="w-96 rounded-md border border-yellow-400 bg-transparent px-3 py-2"
              type="text"
              name="name"
              autoComplete="username"
              minLength={4}
              maxLength={30}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label
              className=" bg-transparent text-sm font-light"
              htmlFor="password1"
            >
              Password
            </label>
            <input
              className=" w-96 rounded-md border border-yellow-400 bg-transparent px-3 py-2"
              type="password"
              name="password1"
              autoComplete="new-password"
              minLength={4}
              maxLength={30}
            />
          </div>
          <div className=" flex flex-col space-y-2 bg-transparent">
            <label className="text-sm font-light" htmlFor="password1">
              Confirm password:
            </label>
            <input
              className=" w-96 rounded-md border border-yellow-400 bg-transparent px-3 py-2"
              type="password"
              name="password2"
              minLength={4}
              maxLength={30}
            />
          </div>
          <button
            className="border-yellow-400px-10 goldeffect w-full rounded-md py-2 "
            type="button"
            onClick={submitForm}
            test-id="registration-submit"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};
export default Register;
