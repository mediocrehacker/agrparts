import {
  type AutoPart,
  getSearchResultsTiss,
  getSearchResultsAvtolider,
  getSearchResultsRossko,
} from "@/lib/search";
import { PartsList } from "../components/parts";

export async function AvtoliderParts(props: any) {
  let parts: any[] = [];

  if (!props.article) {
    return parts;
  }

  parts = await getSearchResultsAvtolider(props.article, "angarsk");

  return <PartsList parts={parts} />;
}

export async function TissParts(props: any) {
  let parts: any[] = [];

  if (!props.article) {
    return parts;
  }

  parts = await getSearchResultsTiss(props.article, "angarsk");

  return <PartsList parts={parts} />;
}

export async function RosskoParts(props: any) {
  let parts: any[] = [];

  if (!props.article) {
    return parts;
  }

  parts = await getSearchResultsRossko(props.article, "angarsk");

  return <PartsList parts={parts} />;
}
