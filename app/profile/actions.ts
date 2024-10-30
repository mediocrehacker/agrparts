"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function createOrg(formData: FormData) {
  const supabase = createClient();

  const data = {
    name: formData.get("name") as string,
  };

  let resp: any;

  resp = await supabase.from("organizations").insert({
    name: data.name,
  });

  if (resp.error) {
    console.error(resp.error);
  }

  revalidatePath("/profile");
}

export async function logout(formData: FormData) {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);
    redirect("/");
  }

  redirect("/");
}
