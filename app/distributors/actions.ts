"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function addCredentials(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    distributor_id: formData.get("distributor_id") as string,
    token: formData.get("token") as string,
    id: formData.get("id") as number | null,
  };

  let resp: any;

  if (data.id) {
    resp = await supabase
      .from("distributor_credentials")
      .update({
        distributor_id: data.distributor_id,
        token: data.token,
      })
      .eq("id", data.id);
  } else {
    resp = await supabase.from("distributor_credentials").insert({
      distributor_id: data.distributor_id,
      token: data.token,
    });
  }

  if (resp.error) {
    console.error(resp.error);
  }

  revalidatePath("/distributors");
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
