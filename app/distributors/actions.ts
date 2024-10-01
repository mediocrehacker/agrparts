"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function addCredentials(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    distributor_id: formData.get("distrubutor_id") as string,
    token: formData.get("token") as string,
  };

  const resp = await supabase
    .from("distributor_credentials")
    .upsert({ distributor_id: data.distributor_id, token: data.token })
    .select();

  return resp;
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
