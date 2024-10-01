import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { addCredentials, logout } from "./actions";

export default async function PrivatePage() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  const distributors = await supabase.from("distributors").select();
  // const distributor_credentials = await supabase
  // .from("distributor_credentials")
  // .select("distributor_credentials"));
  // console.log(distributor_credentials);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] min-h-screen pb-16 pt-4 gap-16">
      <Navbar user={data?.user} />

      <main className="flex flex-col gap-8 w-full max-w-screen-xl px-8 mx-auto overflow-x-auto">
        <div className="relative w-full mx-auto">
          <Distributors distributors={distributors} user={data?.user} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
const Distributors = (props) => {
  const listDistributors = props.distributors.data.map((x) => (
    <li key={x.id} className="flex flex-col gap-2 m:gap-4 items-start">
      <div className="min-w-24">{x.name}</div>
      <form className="flex flex-row gap-4" action={addCredentials}>
        <input
          id="distrubutor_id"
          name="distrubutor_id"
          type="hidden"
          defaultValue={x.id}
        />
        <input id="id" name="id" type="hidden" defaultValue={x.id} />
        <input
          id="token"
          name="token"
          type="text"
          required
          placeholder="API ключ"
          className="input w-full max-w-lg"
        />
        <button className="btn btn-outline btn-primary" type="submit">
          Обновить
        </button>
      </form>
    </li>
  ));
  return (
    <div>
      <ul className="flex flex-col gap-4">{listDistributors}</ul>
    </div>
  );
};

const Navbar = (props) => {
  return (
    <nav className="navbar ">
      <div className="flex-1">
        <Link href="search" className="btn btn-ghost text-xl text-primary">
          ПРОЦЕНКА
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          {(() => {
            if (props.user) {
              return (
                <>
                  <li>
                    <Link href="search">Поиск Автозапчастей</Link>
                  </li>
                  <li>
                    <form action={logout}>
                      <button type="submit">Выйти</button>
                    </form>
                  </li>
                </>
              );
            } else {
              return (
                <li>
                  <Link href="login">Войти / Зарегистрироваться</Link>
                </li>
              );
            }
          })()}
        </ul>
      </div>
    </nav>
  );
};
const Footer = () => (
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
);
