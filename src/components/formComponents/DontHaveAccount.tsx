import Link from "next/link";

export default function DontHaveAccount() {
  return (
    <>
      <p className="text-center">
        {"Don't have an account yet?"}
        <Link href="/registration">Register</Link>
      </p>
    </>
  );
}
