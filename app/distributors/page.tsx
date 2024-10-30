import Image from "next/image";
import Link from "next/link";
import { Footer } from "../components/Footer";
import { createClient } from "@/utils/supabase/server";
import { addCredentials, logout } from "./actions";

export default async function PrivatePage() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  const distributors = await supabase.from("distributors").select();
  const distributor_credentials = await supabase
    .from("distributor_credentials")
    .select();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] min-h-screen pb-16 pt-4 gap-16">
      <Navbar user={data?.user} />

      <main className="flex flex-col gap-8 w-full max-w-screen-xl px-8 mx-auto overflow-x-auto">
        <div className="relative w-full mx-auto">
          <Distributors
            distributors={distributors}
            user={data?.user}
            credentials={distributor_credentials}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

const Distributors = (props: any) => {
  const listDistributors = props.distributors.data.map((x: any) => {
    const cred = props.credentials.data.filter(
      (credential: any) => credential.distributor_id === x.id,
    )[0];

    return (
      <li key={x.id} className="flex flex-col gap-2 m:gap-4 items-start">
        <div className="min-w-24">{x.name}</div>
        <form className="flex flex-row gap-4" action={addCredentials}>
          <input
            id="distributor_id"
            name="distributor_id"
            type="hidden"
            defaultValue={x.id}
          />
          <input id="id" name="id" type="hidden" defaultValue={cred?.id} />
          <input
            id="token"
            name="token"
            type="text"
            required
            placeholder="API ключ"
            className="input w-full max-w-lg"
            defaultValue={cred?.token}
          />
          <button className="btn btn-outline btn-primary" type="submit">
            Обновить
          </button>
        </form>
      </li>
    );
  });
  return (
    <div>
      <ul className="flex flex-col gap-4">{listDistributors}</ul>
    </div>
  );
};

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
