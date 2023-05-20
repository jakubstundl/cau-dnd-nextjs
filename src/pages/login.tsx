import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import VideoBackground from 'components/VideoBackground';
import { NavigationBar } from 'components/NavigationBar';
import LoginForm from 'components/formComponents/LoginForm';
import Header from 'components/general/Header';

const Signin = () => {
  const router = useRouter();
  const [message, setMessage] = useState<string>()

  useEffect(() => {
    if (router.asPath === '/login?error=true'){
      setMessage('Wrong email or password')
    } else if (router.asPath === '/login#registered'){
      setMessage('Successfully registered. Now you can login')
    } else {
      setMessage('')
    }
  }, [router])

  return (
    <>
      <section>
        <Header title='Login' />
        <NavigationBar />
        <VideoBackground />
        <LoginForm message={message as string} />
      </section>
    </>
  );
};

export default Signin;
