import Image from "next/image";
import Link from "next/link";
import { Footer } from "./components/Footer";

export default async function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen pb-24 pt-4  gap-16">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-6xl">ПРОЦЕНКА</h1>
        <ol className="font-mono list-inside list-decimal text-sm text-center sm:text-left">
          <li className="mb-2">Сервис по поиску автозапчастей</li>
          <li>Все поставщики в одном месте</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/search"
          >
            <Image
              className="dark:invert"
              src="/search.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Найти
          </Link>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href=""
          >
            Инструкция
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
