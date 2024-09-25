export async function getSearchResults(article: string) {
  const example = "044650W141";

  const avtoliderParts = await avtoliderSearch(article);
  const tissParts = await tissSearch(article);

  return { avtoliderParts, tissParts };
}

export async function avtoliderSearch(
  article: string,
): Promise<Array<AvtoliderPart>> {
  const accessToken = process.env.NEXT_PUBLIC_AVTOLIDER_ACCESS_TOKEN;

  const searchByArticle = `https://angarsk.autoleader1.ru/api/v1/search?access-token=${accessToken}&article=${article}`;

  let response = await fetch(searchByArticle, {
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());

  return response;
}

export async function tissSearch(article: any): Promise<Array<TissPart>> {
  const apiKey = process.env.NEXT_PUBLIC_TISS_API;

  const params = {
    Brand: "",
    Article: article,
    is_main_warehouse: 1,
    Contract: "",
  };

  const urlStockByArticle = `http://api.tmparts.ru/api/StockByArticle?JSONparameter=${JSON.stringify(params)}`;
  const headers = { Authorization: `Bearer ${apiKey}` }; // auth header with bearer token

  let response: Array<TissPart> = await fetch(urlStockByArticle, {
    headers,
  }).then((response) => response.json());

  return response;
}

export type TissWarehouse = {
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

export type TissPart = {
  analog: number;
  applicability: string;
  article: string;
  article_alt: string;
  article_name: string;
  brand: string;
  brand_alt?: string;
  min_price: number;
  warehouse_offer: Array<TissWarehouse>;
};

export type AvtoliderPart = {
  code: string;
  brand_name: string;
  name: string;
  article: string;
  multiplicity: number;
  found_by: string;
  stock_list: Array<AvtoliderWaerhouse>;
};

export type AvtoliderWaerhouse = {
  warehouse_id: number;
  warehouse_name: string;
  delivery_min: number;
  delivery_max: number;
  delivery_hour: number;
  price: 786;
  quantity: 2;
};
