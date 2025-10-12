import Image from "next/image";
import { excali } from "@/fonts";
import { Button } from "@/components/Button";

export default function Home() {
  return (
    <main className="flex flex-col items-center pt-30 p-8 flex-1 text-center">
      <Image
        src="/RandGuyLogo.png"
        alt="Rand Guy logo"
        width={80}
        height={80}
        className="mx-auto mb-4"
      />
      <h1 className={`${excali.className} text-4xl mb-2`}>Rand Guy</h1>
      <p className="text-lg text-gray-700 mb-6">
        A random South African guy talking about personal finance.
      </p>
      <Button href="/blog">Read the Blog</Button>
    </main>
  );
}
