type FormData = {
  Brand: string;
  Article: string;
  is_main_warehouse: number;
  Contract: string;
};

export async function tissSearch(article: any) {
  const apiKey = process.env.NEXT_PUBLIC_TISS_API;

  const jsonParams = {
    Brand: "",
    Article: article,
    is_main_warehouse: 1,
    Contract: "",
  };

  const urlStockByArticle = `tmpartsapi/StockByArticle?JSONparameter=${JSON.stringify(jsonParams)}`;
  const headers = { Authorization: `Bearer ${apiKey}` }; // auth header with bearer token

  let response = await fetch(urlStockByArticle, { headers }).then((response) =>
    response.json(),
  );

  console.log(response);
  // setParts(response)
  return response;
}
