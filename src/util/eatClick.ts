import { MouseEvent } from "react";

export function eatClick(e: MouseEvent) {
  e.preventDefault();
  e.stopPropagation();
}
