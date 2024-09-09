export type SearchParams = {
  Brand: string;
  Article: string;
  is_main_warehouse: number;
  Contract: string;
};

export type Warehouse = {
  delivery_period: number;
  branch_code: string;
  id: string;
  price: number;
  min_part: number;
  warehouse_code: string;
  warehouse_name: string;
  is_main_warehouse: number;
  branch_name: string;
  name: string;
};

export type Part = {
  analog: number;
  applicability: string;
  article: string;
  article_alt: string;
  article_name: string;
  brand: string;
  brand_alt?: string;
  min_price: number;
  warehouse_offer: Array<Warehouse>;
};

export async function tissSearch(article: any) {
  const apiKey = process.env.NEXT_PUBLIC_TISS_API;

  const params: SearchParams = {
    Brand: "",
    Article: article,
    is_main_warehouse: 1,
    Contract: "",
  };

  const urlStockByArticle = `tmpartsapi/StockByArticle?JSONparameter=${JSON.stringify(params)}`;
  const headers = { Authorization: `Bearer ${apiKey}` }; // auth header with bearer token

  let response: Array<Part> = await fetch(urlStockByArticle, { headers }).then(
    (response) => response.json(),
  );

  return response;
}
