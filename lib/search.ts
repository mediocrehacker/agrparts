import soapRequest from "easy-soap-request";
import convert from "xml-js";

export async function getSearchResults(article: string, city: string) {
  const example = "044650W141" || "1780102030";
  let parts: AutoPart[] = [];

  if (!article) {
    return parts;
  }

  const rosskoPartsXml = await rosskoSearch(article);
  const rosskoPartsListWithBrands = rosskoParse(rosskoPartsXml);
  const uniqueRossko = getUniqueRossko(rosskoPartsListWithBrands);
  let rosskoParts = uniqueRossko.map((x: any) => rosskoToAutoPartNew(x));

  city = "angarsk";

  if (city) {
    rosskoParts = rosskoFilterByCity(rosskoParts, city);
  }
  const avtoliderParts = await avtoliderSearch(article);
  const tissParts = await tissSearch(article);

  parts = tissParts
    .map((x: TissPart) => tissPartToAutoPart(x))
    .concat(
      avtoliderParts?.map((x: AvtoliderPart) => avtoliderPartToAutoPart(x)),
    )
    .concat(rosskoParts);

  return parts;
}

export async function getSearchResultsRossko(article: string, city: string) {
  let parts: AutoPart[] = [];

  const rosskoPartsXml = await rosskoSearch(article);
  const rosskoPartsListWithBrands = rosskoParse(rosskoPartsXml);
  const uniqueRossko = getUniqueRossko(rosskoPartsListWithBrands);
  let rosskoParts = uniqueRossko.map((x: any) => rosskoToAutoPartNew(x));

  city = "angarsk";

  if (city) {
    parts = rosskoFilterByCity(rosskoParts, city);
  }

  return parts;
}

export async function getSearchResultsTiss(article: string, city: string) {
  let parts: any[] = [];

  parts = await tissSearch(article);
  parts = parts?.map((x: TissPart) => tissPartToAutoPart(x));

  return parts;
}

export async function getSearchResultsAvtolider(article: string, city: string) {
  let parts: any[] = [];

  parts = await avtoliderSearch(article);
  parts = parts?.map((x: AvtoliderPart) => avtoliderPartToAutoPart(x));

  return parts;
}

function rosskoFilterByCity(parts: AutoPart[], city: string) {
  parts = parts.filter((e: any) => {
    let stock = e.extra["ns1:stocks"]["ns1:stock"][0];
    if (stock) {
      return (
        stock["ns1:description"]._text === "Иркутск" ||
        stock["ns1:description"]._text === "Ангарск, 279-й квартал, 5/1"
      );
    }
  });
  // 'ns1:description': { _text: 'Ангарск, 279-й квартал, 5/1' },
  // 'ns1:description': { _text: 'Иркутск' },

  return parts;
}
function getUniqueRossko(brands: any): any {
  let parts: any[];
  try {
    if (Array.isArray(brands)) {
      parts = brands.map((x: any) => x["ns1:crosses"]["ns1:Part"]);
    } else {
      parts = brands["ns1:crosses"]["ns1:Part"];
    }
    parts = parts.flat();

    let uniqueArr: any[] = [];
    parts.forEach((obj: any) => {
      if (
        !uniqueArr.find(
          (item: any) => item["ns1:guid"]._text === obj["ns1:guid"]._text,
        )
      ) {
        uniqueArr.push(obj);
      }
    });
    return uniqueArr;
  } catch {
    return [];
  }
}

function rosskoToAutoPartNew(part: any): AutoPart {
  let price;
  try {
    price = part["ns1:stocks"]["ns1:stock"][0]["ns1:price"]._text;
  } catch {
    price = -1;
  }

  const autoPart = {
    name: part["ns1:name"]._text,
    analog: true,
    brand: part["ns1:brand"]._text,
    article: part["ns1:partnumber"]._text,
    quantity: "",
    price,
    delivery: 1,
    company: "Rossko",
    extra: part,
  };

  return autoPart;
}

function rosskoParse(xml: any) {
  try {
    let options = {
      compact: true,
      ignoreDeclaration: true,
    };

    let rosskoParts: any = convert.xml2js(xml, options);

    const partList =
      rosskoParts["SOAP-ENV:Envelope"]["SOAP-ENV:Body"][
        "ns1:GetSearchResponse"
      ]["ns1:SearchResult"]["ns1:PartsList"]["ns1:Part"];

    // return partList.filter((brand: any) => brand["ns1:stocks"]);
    return partList;
  } catch (error) {
    return [];
  }
}

function rosskoParseOld(xml: any) {
  try {
    let options = {
      compact: true,
      ignoreDeclaration: true,
    };

    let rosskoParts: any = convert.xml2js(xml, options);

    const partList =
      rosskoParts["SOAP-ENV:Envelope"]["SOAP-ENV:Body"][
        "ns1:GetSearchResponse"
      ]["ns1:SearchResult"]["ns1:PartsList"]["ns1:Part"];
    // const partShortList = partList[0]["ns1:crosses"]["ns1:Part"]?.filter(
    // (e: any) => {
    // let stock = e["ns1:stocks"]["ns1:stock"][0];
    // if (stock) {
    // return (
    // stock["ns1:description"]._text === "Иркутск" ||
    // stock["ns1:description"]._text === "Ангарск, 279-й квартал, 5/1"
    // );
    // }
    // },
    // );

    // 'ns1:description': { _text: 'Ангарск, 279-й квартал, 5/1' },
    // 'ns1:description': { _text: 'Иркутск' },
    return partList;
  } catch (error) {
    return [];
  }
}

export async function rosskoSearch(article: string) {
  const key1 = process.env.NEXT_PUBLIC_ROSSKO_KEY1;
  const key2 = process.env.NEXT_PUBLIC_ROSSKO_KEY2;

  const url = "http://api.rossko.ru/service/v2.1/GetSearch";
  const sampleHeaders = {
    "Content-Type": "text/xml;charset=UTF-8",
  };

  const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:api="http://api.rossko.ru/">
     <soapenv:Header/>
     <soapenv:Body>
        <api:GetSearch>
           <api:KEY1>${key1}</api:KEY1>
           <api:KEY2>${key2}</api:KEY2>
           <api:text>${article}</api:text>
           <api:delivery_id>000000001</api:delivery_id>
        </api:GetSearch>
     </soapenv:Body>
  </soapenv:Envelope>`;

  try {
    const resp = await soapRequest({
      url: url,
      headers: sampleHeaders,
      xml: xml,
      timeout: 5000,
    });

    const { headers, body, statusCode } = resp.response;

    return body;
  } catch {
    return [];
  }
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
        (y: any) =>
          y.warehouse_id === 19 ||
          y.warehouse_id === 47 ||
          y.warehouse_id === 18,
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

  let resp: Array<TissPart> = await fetch(urlStockByArticle, {
    headers,
  }).then((response) => response.json());

  //let angarskResp =

  // warehouse_id: 19,
  // const arr = resp
  // .map((x) => x.warehouse_offers)
  // .flat()
  // .map((y) => y.warehouse_id)
  // .map((y) => ({
  // id: y.warehouse_code,
  // name: y.warehouse_name,
  // branch: y.branch_name,
  // }));
  //
  // let setObj = new Set(arr.map(JSON.stringify));
  // let output = Array.from(setObj).map(JSON.parse);
  // .flat()
  // .filter(onlyUnique)
  // .sort((a, b) => a.id - b.id);

  // console.log(arr);
  return resp;
}

function rosskoToAutoPart(part: any): AutoPart {
  // console.log(part["ns1:stocks"]["ns1:stock"][0]);
  let price;
  try {
    console.log(part["ns1:stocks"]);
    price = part["ns1:stocks"]["ns1:stock"][0]["ns1:price"]._text;
  } catch {
    price = -1;
  }

  const autoPart = {
    name: part["ns1:name"]._text,
    analog: true,
    brand: part["ns1:brand"]._text,
    article: part["ns1:partnumber"]._text,
    quantity: "",
    price,
    delivery: 1,
    company: "Rossko",
    extra: part,
  };

  return autoPart;
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
    extra: part,
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
    extra: part,
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
  extra: any;
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
  { id: 10, name: "ул. Трубачеева, 154 к1, (Склад №4)" },
  { id: 14, name: "ул. Брянская, 15" },
  { id: 16, name: "ул. Рабочая, 4б" },
  { id: 18, name: " ул. Генерала Доватора, 39, (ТЦ Прибой, пав. 10)" },
  { id: 19, name: "ул. 17 микрорайон, 21а, (ТЦ Автомобили, пав. 6)" },
  { id: 20, name: "ул. Корабельная, 30, (Склад №1)" },
  { id: 21, name: "ул. Проспект Автомобилистов, 21б, (ТЦ Автомир)" },
  { id: 22, name: "ул. Борсоева, 3" },
  { id: 23, name: " ул. Борсоева, 105, (ТЦ Авторим, пав. 1)" },
  { id: 24, name: "ул. Борсоева, 58, (Склад №3)" },
  { id: 25, name: " ул. Лимонова, 2б/1, (ТЦ Автоград, пав. 1)" },
  { id: 27, name: "ул. Намжилова, 6" },
  { id: 28, name: "ул. Проспект Автомобилистов, 3в, (Склад №2)" },
  { id: 32, name: " ул. Кабанская, 13б/2" },
  { id: 33, name: "ул. Сибиряков-Гвардейцев, 47, к2, (ТЦ Н54, пав. 2)" },
  { id: 35, name: "ул. Ленина, 149в" },
  { id: 36, name: "ул. Петухова, 51б, к7, (Рынок Столица, пав. 1, место 14)" },
  { id: 38, name: "ул. Богдана Хмельницкого, 1/1, (ТЦ АвтоМолл, пав. 1)" },
  { id: 41, name: "ул. Баррикад 129/9, (Склад №11)" },
  {
    id: 42,
    name: " ул. Октябрьской Революции, 1, (ТЦ Автоград, пристрой №29)",
  },
  { id: 45, name: " ул. Генерала Доватора, 39, (ТЦ Прибой, пав. 72)" },
  { id: 47, name: "ул. Чайковского, 1а, (ТЦ Автомир+, пав. 50)" },
  { id: 77, name: "ул. Рабочего штаба, 46/1, (Склад)" },
  { id: 93, name: "ул. Сибиряков-Гвардейцев, 49а, к5" },
  { id: 94, name: "ул. Бабушкина, 200" },
  { id: 129, name: "ул. Ленина, 26" },
  { id: 139, name: "Склад 51" },
  { id: 145, name: "ул. Новая, 13" },
  { id: 149, name: "Склад 240" },
  { id: 161, name: "Склад 18" },
  { id: 162, name: "Склад  23" },
  { id: 163, name: "Склад 30" },
  { id: 164, name: "Склад 60" },
  { id: 165, name: "Склад 40" },
  { id: 166, name: "Склад 220" },
  { id: 167, name: "Склад 50" },
  { id: 170, name: "Склад 22" },
  { id: 171, name: "Склад 21" },
  { id: 292, name: "ул. Старо-Кузмихинской, 86/1" },
  { id: 312, name: "ул. Ленина, 13а" },
  { id: 316, name: "ул. Гайдашовка, 8в, (Склад 1-й этаж)" },
  { id: 408, name: "ул. Жердева, 20а, строение 1 (Склад Основной)" },
  { id: 535, name: "ул. Сергеева, 3а, (ТЦ  АвтоСити бокс №32)" },
  { id: 561, name: "Склад  52" },
  { id: 567, name: "Склад 221" },
  { id: 638, name: "ул. Сергеева, 3а, (ТЦ  АвтоСити пав. 40, склад)" },
  { id: 654, name: "ул. Сельскохозяйственная, 4А, корпус 2" },
  { id: 655, name: "ул. Сельскохозяйственная, 1Г (2 этаж)" },
  { id: 661, name: "ул. Олимпийская, 25" },
  { id: 674, name: "ул. Стопани, 12" },
  { id: 675, name: "Микрорайон Солнечный, 45" },
  { id: 719, name: "Склад 404" },
  { id: 721, name: "ул. Полярная, 117а" },
];
