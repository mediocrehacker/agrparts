import Image from "next/image";
import Link from "next/link";
import { Footer } from "../components/Footer";
import {
  type AutoPart,
  getSearchResults,
  getSearchResultsRossko,
} from "@/lib/search";
import { createClient } from "@/utils/supabase/server";
import { AvtoliderParts, TissParts, RosskoParts } from "./Components";
import { Suspense } from "react";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  let article = searchParams.article?.toString() || "";

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] min-h-screen pb-24 pt-4 gap-16 lg:pb-16">
      <Navbar user={data?.user} />

      <main className="container relative overflow-x-auto mx-auto ">
        <div className="border-base-300 flex flex-col gap-8 overflow-x-auto p-4">
          <SearchForm value={article} />
          <div className="w-full">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Название</th>
                    <th>Бренд</th>
                    <th>Номер</th>
                    <th>Компания</th>
                    <th className="text-right">Цена ₽</th>
                  </tr>
                </thead>
                <tbody>
                  <Suspense
                    fallback={
                      <tr>
                        <td>+</td>
                        <td className="skeleton"></td>
                        <td className="skeleton"></td>
                        <td className="skeleton"></td>
                        <td>ТИСС</td>
                        <td className="skeleton"></td>
                      </tr>
                    }
                  >
                    <TissParts article={article} />
                  </Suspense>
                  <Suspense
                    fallback={
                      <tr>
                        <td>+</td>
                        <td className="skeleton"></td>
                        <td className="skeleton"></td>
                        <td className="skeleton"></td>
                        <td>Avtolider</td>
                        <td className="skeleton"></td>
                      </tr>
                    }
                  >
                    <AvtoliderParts article={article} />
                  </Suspense>
                  <Suspense
                    fallback={
                      <tr>
                        <td>+</td>
                        <td className="skeleton"></td>
                        <td className="skeleton"></td>
                        <td className="skeleton"></td>
                        <td>Rossko</td>
                        <td className="skeleton"></td>
                      </tr>
                    }
                  >
                    <RosskoParts article={article} />
                  </Suspense>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />
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

const Navbar = (props: any) => {
  return (
    <nav className="navbar ">
      <div className="flex-1">
        <Link href="search" className="btn btn-ghost text-xl text-primary">
          ПРОЦЕНКА
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            {(() => {
              if (props.user) {
                return <Link href="profile">Личный Кабинет</Link>;
              } else {
                return <Link href="login">Войти / Зарегистрироваться</Link>;
              }
            })()}
          </li>
        </ul>
      </div>
    </nav>
  );
};
