"use client";

import { Fragment, useState } from "react";
import { AutoPart } from "../../lib/search";

export function Parts(props: any) {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th></th>
            <th>Название</th>
            <th>Бренд</th>
            <th>Номер</th>
            <th>Компания</th>
            <th className="text-right">Цена ₽</th>
          </tr>
        </thead>
        <PartsList parts={props.parts} />
      </table>
    </div>
  );
}

function PartsList(props: { parts: AutoPart[] }) {
  const [expanded, setExpanded] = useState("");

  const parts = props.parts;

  const isHidden = (article: string) => {
    if (expanded === article) {
      return "";
    } else {
      return "hidden";
    }
  };

  const expand = (article: string) => {
    if (expanded === article) {
      return "-";
    } else {
      return "+";
    }
  };

  const toggle = (article: string) => {
    if (expanded === article) {
      setExpanded("");
    } else {
      setExpanded(article);
    }
  };

  const listItems = parts.map((part: AutoPart) => (
    <Fragment key={part.article}>
      <tr className="hover cursor-pointer" onClick={() => toggle(part.article)}>
        <td>{expand(part.article)}</td>
        <td>{part.name}</td>
        <td>{part.brand}</td>
        <td>{part.article}</td>
        <td>{part.company}</td>
        <td className="text-right font-bold">
          {Math.ceil(Number(part.price))}
        </td>
      </tr>
      <tr className={isHidden(part.article)}>
        <td></td>
        <td colSpan={5}>
          <Extra part={part} />
        </td>
      </tr>
    </Fragment>
  ));
  return <tbody>{listItems}</tbody>;
}

function Extra(props: { part: AutoPart }) {
  switch (props.part.company) {
    case "Rossko":
      return <RosskoExtra extra={props.part.extra} />;
    case "ТИСС":
      return <TissExtra extra={props.part.extra} />;
    case "Автолидер":
      return <AvtoliderExtra extra={props.part.extra} />;
    default:
      return <div>No Extra Info</div>;
  }
}

function RosskoExtra(props: { extra: any }) {
  // if (props.extra["ns1:partnumber"]._text === "AG 521") {
  // console.log(props.extra);
  // console.log("props.extra");
  // }

  const stocks = props.extra["ns1:stocks"]["ns1:stock"];
  const listItems = stocks.map((stock: any) => (
    <tr key={stock["ns1:id"]._text}>
      <td>{stock["ns1:description"]._text}</td>
      <td>{stock["ns1:count"]._text}</td>
      <td>{stock["ns1:delivery"]._text}</td>
      <td className="text-right">
        {Math.ceil(Number(stock["ns1:price"]._text))}
      </td>
    </tr>
  ));

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Адрес</th>
          <th>Кол-во</th>
          <th>Доставка дней</th>
          <th className="text-right">Цена ₽</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>
  );
}

function TissExtra(props: { extra: any }) {
  const stocks = props.extra.warehouse_offers;
  const listItems = stocks.map((stock: any) => (
    <tr key={stock.id}>
      <td>{stock.warehouse_code}</td>
      <td>{stock.warehouse_name}</td>
      <td>{stock.quantity}</td>
      <td>1</td>
      <td className="text-right">{Math.ceil(Number(stock.price))}</td>
    </tr>
  ));

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Адрес</th>
          <th>Город</th>
          <th>Кол-во</th>
          <th>Доставка дней</th>
          <th className="text-right">Цена ₽</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>
  );
}

function AvtoliderExtra(props: { extra: any }) {
  const stocks = props.extra.stock_list;

  const listItems = stocks.map((stock: any) => (
    <tr key={stock.warehouse_id}>
      <td>{stock.warehouse_name}</td>
      <td>{stock.quantity}</td>
      <td>{stock.delivery_min}</td>
      <td className="text-right">{Math.ceil(Number(stock.price))}</td>
    </tr>
  ));

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Адрес</th>
          <th>Кол-во</th>
          <th>Доставка дней</th>
          <th className="text-right">Цена ₽</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>
  );
}
