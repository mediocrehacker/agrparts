import Image from "next/image";
import Link from "next/link";
import { Footer } from "../components/Footer";
import { createClient } from "@/utils/supabase/server";
import { addCredentials, logout } from "./actions";
import { redirect } from "next/navigation";

export default async function PrivatePage() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] min-h-screen pb-16 pt-4 gap-16">
      <Navbar user={data?.user} />
      <main className="flex flex-col gap-8 w-full max-w-screen-xl px-8 mx-auto overflow-x-auto"></main>

      <Footer />
    </div>
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
            <Link href="search">Поиск Автозапчастей</Link>
          </li>
          <li>
            <form action={logout}>
              <button type="submit">Выйти</button>
            </form>
          </li>
        </ul>
      </div>
    </nav>
  );
};
