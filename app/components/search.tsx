"use client";

import { useState } from "react";
import { type Part, tissSearch } from "./search/tiss";

type AutoPart = {
  name: string;
  analog: boolean;
  brand: string;
  article: string;
  quantity: string;
  price: number;
  delivery: number;
  company: string;
};

function tissPartToAutoPart(part: Part): AutoPart {
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

export default function Search() {
  const [parts, setParts] = useState<Array<AutoPart>>([]);

  async function search(formData: FormData) {
    const query = formData.get("query");

    let allParts: Array<AutoPart>;
    let tissParts: Array<Part>;
    if (query) {
      tissParts = await tissSearch(query);
      if (tissParts) {
        const parts: AutoPart[] = tissParts.map((x: Part) =>
          tissPartToAutoPart(x),
        );
        setParts(parts);
      }
    }

    console.log(parts);
  }

  return (
    <form action={search} className="md:w-full lg:w-1/2 mx-auto">
      <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          name="query"
          type="search"
          id="default-search"
          className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Введите оригинальный номер детали"
          required
        />
        <button
          type="submit"
          className="text-white absolute lg:absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Поиск
        </button>
      </div>
      <div>
        <Parts parts={parts} />
      </div>
    </form>
  );
}

function Parts(props: any) {
  return (
    <div className="overflow-x-auto">
      <table className="table table-xs">
        <thead>
          <tr>
            <th></th>
            <th>Название</th>
            <th>Бренд</th>
            <th>Номер</th>
            <th>Кол-во</th>
            <th>Доставка</th>
            <th>Цена</th>
            <th>Компания</th>
          </tr>
        </thead>
        <PartsList parts={props.parts} />
        <tfoot>
          <tr>
            <th></th>
            <th>Название</th>
            <th>Бренд</th>
            <th>Номер</th>
            <th>Кол-во</th>
            <th>Доставка</th>
            <th>Цена</th>
            <th>Компания</th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function PartsList(props: { parts: AutoPart[] }) {
  const parts = props.parts;
  const listItems = parts.map((part: AutoPart) => (
    <tr key={part.article}>
      <td></td>
      <td>{part.name}</td>
      <td>{part.brand}</td>
      <td>{part.article}</td>
      <td>{part.quantity}</td>
      <td>{part.delivery}</td>
      <td>{part.price}</td>
      <td>{part.company}</td>
    </tr>
  ));
  return <tbody>{listItems}</tbody>;
}
