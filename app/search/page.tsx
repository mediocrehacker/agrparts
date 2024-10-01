import Image from "next/image";
import Link from "next/link";
import { type AutoPart, getSearchResults } from "@/lib/search";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  let article = searchParams.article?.toString() || "";

  const results = await getSearchResults(article);

  let parts = results;

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] min-h-screen pb-16 pt-4 gap-16">
      <Navbar />

      <main className="flex flex-col gap-8 w-full max-w-screen-xl px-8">
        <SearchForm value={article} />
        <div className="relative w-full mx-auto  ">
          <Parts parts={parts} />
        </div>
      </main>

      <footer className="mt-8 row-start-3 flex gap-6 flex-wrap items-center justify-center">
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

function SearchForm(props: { value: string }) {
  return (
    <form action="/search" className="w-full mx-auto">
      <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          name="article"
          defaultValue={props.value}
          type="search"
          id="default-search"
          className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Введите оригинальный номер детали"
          required
        />
        <button
          type="submit"
          className="text-white absolute lg:absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Поиск
        </button>
      </div>
    </form>
  );
}
function Parts(props: any) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="table table-xs">
        <thead>
          <tr>
            <th></th>
            <th>Название</th>
            <th>Бренд</th>
            <th>Номер</th>
            <th>Кол-во</th>
            <th>Доставка</th>
            <th>Цена</th>
            <th>Компания</th>
          </tr>
        </thead>
        <PartsList parts={props.parts} />
      </table>
    </div>
  );
}

function PartsList(props: { parts: AutoPart[] }) {
  const parts = props.parts;
  const listItems = parts.map((part: AutoPart) => (
    <tr key={part.article + part.company}>
      <td></td>
      <td>{part.name}</td>
      <td>{part.brand}</td>
      <td>{part.article}</td>
      <td>{part.quantity}</td>
      <td>{part.delivery}</td>
      <td>{part.price}</td>
      <td>{part.company}</td>
    </tr>
  ));
  return <tbody>{listItems}</tbody>;
}

const Navbar = () => {
  return (
    <nav className="navbar ">
      <div className="flex-1">
        <a className="text-xl"></a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="login">Войти / Зарегистрироваться</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};
