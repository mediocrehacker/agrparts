export async function getSearchResults(article: string) {
  const example = "044650W141";
  let parts: AutoPart[] = [];

  if (!article) {
    return parts;
  }

  const avtoliderParts = await avtoliderSearch(article);

  const tissParts = await tissSearch(article);

  parts = tissParts
    .map((x: TissPart) => tissPartToAutoPart(x))
    .concat(
      avtoliderParts?.map((x: AvtoliderPart) => avtoliderPartToAutoPart(x)),
    );

  return parts;
}

export async function avtoliderSearch(article: string) {
  const accessToken = process.env.NEXT_PUBLIC_AVTOLIDER_ACCESS_TOKEN;

  const searchByArticle = `https://angarsk.autoleader1.ru/api/v1/search?access-token=${accessToken}&article=${article}`;

  let response = await fetch(searchByArticle, {
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());

  let resp = response.data.filter(
    (x: any) =>
      x.stock_list.length > 0 &&
      x.stock_list.filter(
        (y: any) => y.warehouse_id === 19 || y.warehouse_id === 47,
      ).length > 0,
  );
  // angrask
  // warehouse_id: 19
  // warehouse_id: 47
  return resp;
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

function tissPartToAutoPart(part: TissPart): AutoPart {
  const autoPart = {
    name: part.article_name,
    analog: !part.analog,
    brand: part.brand,
    article: part.article,
    quantity: "",
    price: part.min_price,
    delivery: 1,
    company: "ТИСС",
  };

  return autoPart;
}
function avtoliderPartToAutoPart(part: AvtoliderPart): AutoPart {
  const price = Math.min(...part.stock_list.map((x) => x.price));

  const autoPart = {
    name: part.name,
    analog: true,
    brand: part.brand_name,
    article: part.article,
    quantity: "",
    price,
    delivery: 1,
    company: "Автолидер",
  };

  return autoPart;
}

export type AutoPart = {
  name: string;
  analog: boolean;
  brand: string;
  article: string;
  quantity: string;
  price: number;
  delivery: number;
  company: string;
};

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

const avtoliderWarehouse = [
  "ул. 17 микрорайон, 21а, (ТЦ Автомобили, пав. 6)",
  "ул. Старо-Кузмихинской, 86/1",
  "ул. Полярная, 117а",
  "ул. Сергеева, 3а, (ТЦ  АвтоСити пав. 40, склад)",
  "ул. Рабочего штаба, 46/1, (Склад)",
  "ул. Сергеева, 3а, (ТЦ АвтоСити, пав. 61)",
  "ул. Стопани, 12",
  "ул. Ленина, 26",
  "Микрорайон Солнечный, 45",
  "ул. Ленина, 149в",
  "ул. Олимпийская, 25",
  "ул. Сибиряков-Гвардейцев, 49а, к5",
  "ул. Сельскохозяйственная, 4А, корпус 2",
  "ул. Новая, 13",
  "ул. Ленина, 13а",
  "ул. Гайдашовка, 8в, (Склад 1-й этаж)",
  "ул. Сельскохозяйственная, 1Г (2 этаж)",
  "ул. Сибиряков-Гвардейцев, 47, к2, (ТЦ Н54, пав. 2)",
  "ул. Богдана Хмельницкого, 1/1, (ТЦ АвтоМолл, пав. 1)",
  "ул. Брянская, 15",
  "ул. Петухова, 51б, к7, (Рынок Столица, пав. 1, место 14)",
  " ул. Генерала Доватора, 39, (ТЦ Прибой, пав. 72)",
  " ул. Октябрьской Революции, 1, (ТЦ Автоград, пристрой №29)",
  "ул. Баррикад 129/9, (Склад №11)",
  "Склад 51",
  "ул. Проспект Автомобилистов, 3в, (Склад №2)",
  "ул. Трубачеева, 154 к1, (Склад №4)",
  "ул. Борсоева, 58, (Склад №3)",
  "Склад 30",
  "Склад 40",
  "Склад 60",
  "Склад  23",
  "Склад 220",
  "Склад 22",
  "Склад 240",
  "Склад 18",
  "Склад 50",
  "Склад 221",
  "Склад 19",
  "Склад  52",
  "Склад 24",
  "Склад 44",
  "Склад 301",
  "Склад 21",
];
