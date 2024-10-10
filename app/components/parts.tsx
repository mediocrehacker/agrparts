"use client";

import { Fragment, useState } from "react";

export function Parts(props: any) {
  const [expanded, setExpnaded] = useState("");

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
            <th>Город</th>
            <th className="text-right">Цена ₽</th>
          </tr>
        </thead>

        <PartsList expnaded={expanded} parts={props.parts} />
      </table>
    </div>
  );
}

function PartsList(props: { expanded: string; parts: AutoPart[] }) {
  const parts = props.parts;
  const isHidden = (article: string) => {
    if (props.expanaded === article) {
      return "";
    } else {
      return "hidden";
    }
  };
  const listItems = parts.map((part: AutoPart) => (
    <Fragment key={part.article}>
      <tr className="hover cursor-pointer">
        <td></td>
        <td>{part.name}</td>
        <td>{part.brand}</td>
        <td>{part.article}</td>
        <td>{part.company}</td>
        <td></td>
        <td className="text-right font-bold">{part.price}</td>
      </tr>
      <tr className={isHidden(part.article)}>
        <td colSpan={7}>extra</td>
      </tr>
    </Fragment>
  ));
  return <tbody>{listItems}</tbody>;
}
