import { capitalize } from "../capitalize/capitalize";

export function formattedDate(date: Date) {
    return capitalize(date.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "2-digit" }).replace(/,/g, " -"))
}