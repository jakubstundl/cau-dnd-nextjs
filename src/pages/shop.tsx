import { loadStripe, StripeError } from '@stripe/stripe-js';
import Header from 'components/general/Header';
import { NavigationBar } from 'components/NavigationBar';
import VideoBackground from 'components/VideoBackground';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
);

export default function Checkout() {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      alert('You have to be logged in to enter this page');
      router.push('/login');
    }
  });

  const handleClick = async () => {
    const { sessionId } = await fetch('api/stripe/checkout/session', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ quantity: 1 }),
    }).then((res) => res.json());

    const stripe = await stripePromise;
    const { error } = (await stripe?.redirectToCheckout({
      sessionId,
    })) as { error: StripeError };

    if (error) {
      router.reload();
    }
  };

  return (
    <>
      <Header title="Shop" />
      <VideoBackground />
      <NavigationBar />

      <div className=" flex flex-col items-center justify-center  font-LOTR md:h-screen ">
        <div className="fixed z-10 flex h-screen w-screen items-center justify-center">
          <div className="background "></div>
        </div>
        <div className="rounded-x gold goldnohover z-30 space-y-5  p-10 drop-shadow-lg">
          <h1 className="text-center font-LOTR text-3xl">Checkout</h1>
          <h2 className="text-center font-LOTR text-xl">
            List of benefits for premium members:
          </h2>
          <p className="text-center font-LOTR">*work in progress*</p>
          <button onClick={handleClick}>
            Click HERE to buy your PREMIUM MEMBERSHIP
          </button>
        </div>
      </div>
    </>
  );
}
