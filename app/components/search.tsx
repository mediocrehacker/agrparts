'use client'
 
import { useState } from 'react'
 
export default function Counter() {
  const apiKey = process.env.NEXT_PUBLIC_TISS_API
  const jsonParams = {
    'Brand':'',
    'Article':'d5471',
    'is_main_warehouse': 1,
    'Contract' : ''
  }

  const urlStockByArticle = `tmpartsapi/StockByArticle?JSONparameter=${JSON.stringify(jsonParams)}`
  const headers = { 'Authorization': `Bearer ${apiKey}` }; // auth header with bearer token
  const [parts, setParts] = useState([])

  async function search(formData: any) {
    const query = formData.get("query");

    let response = await fetch(urlStockByArticle, { headers }).
      then(response => response.json())

    console.log((response.data))
    // setParts(response)
  }
 
  return (
    <form action={search} className="md:w-full lg:w-1/2 mx-auto"> 
    <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
    <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
        </div>
        <input name="query" type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Введите оригинальный номер детали" required />
      <button type="submit" className="text-white absolute lg:absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Поиск</button>
    </div>
      <div>
      <Parts parts={parts} />
      <p className="text-sm"> 
      { parts }
      </p>
      </div>
</form>
  )
}

function Parts(props: any) {
  return(
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
        <th></th>
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
        <th></th>
      </tr>
    </tfoot>
  </table>
 </div>)
}

function PartsList(props: any) {
  const parts= props.parts;
  const listItems = parts.map((part: any) =>
    <tr key={part.warehouse_offers.id} >
    part.article
    </tr>
  );
  return (
    <tbody>{listItems}</tbody>
  );
}
	// {
	// 	"brand": "JD",
	// 	"brand_alt": null,
	// 	"article": "JAA0097",
	// 	"article_alt": "JSA344223",
	// 	"analog": 1,
	// 	"article_name": "Амортизатор газомасляный задний /344223/",
	// 	"min_price": 1152.62,
	// 	"applicability": "",
	// 	"warehouse_offers": [
	// 		{
	// 			"delivery_period": 0,
	// 			"quantity": ">5",
	// 			"branch_code": "ТИ002",
	// 			"id": "4b9bcfba-2d55-42bc-ad1e-06c236051cee",
	// 			"price": 1152.62,
	// 			"min_part": 1,
	// 			"warehouse_code": "ТИ070",
	// 			"warehouse_name": "Иркутск",
	// 			"is_main_warehouse": 1,
	// 			"branch_name": "Иркутск",
	// 			"name": "Амортизатор газомасляный задний /344223/"
	// 		}
	// 	]
	// }
