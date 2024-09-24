"use client";

export async function avtoliderSearch(article: any) {
  const accessToken = process.env.NEXT_PUBLIC_AVTOLIDER_ACCESS_TOKEN;

  // const searchByArticle = `https://angarsk.autoleader1.ru/api/v1/search?access-token=${accessToken}&article=${article}`;

  const searchByArticle =
    "https://angarsk.autoleader1.ru/api/v1/search?access-token=_zz9_CoooOlNfbL5&article=044650W141";

  let response = await fetch(searchByArticle, {
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());

  console.log(response);

  return response;
}
