import Image from "next/image";
import Search from "../components/search.tsx";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] min-h-screen p-8 pb-20 gap-16 sm:p-20 ">
      <main className="flex flex-col gap-8 ">
        <Search />
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href=""
        >
          <Image
            aria-hidden
            src="/file-text.svg"
            alt="File icon"
            width={16}
            height={16}
          />
         Инструкция 
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href=""
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Примеры 
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://t.me/pozitiveweb3lab"
        >
          <Image
            aria-hidden
            src="/telegram.svg"
            alt="Telegram icon"
            width={22}
            height={22}
          />
          Связаться с нами →
        </a>
      </footer>

    </div>
  );
}
