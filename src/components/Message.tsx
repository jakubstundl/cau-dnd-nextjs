import Link from "next/link";


export default function Message(props: {text: string}) {
    return (<>
        <div className="m-auto">
            <h1>Message you</h1>
            <p>{props.text}</p>
            <Link href='/'>Homepage</Link>
            <Link href='/login'>Login</Link>
        </div>
    </>)
}