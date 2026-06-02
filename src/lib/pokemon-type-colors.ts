import type { pokemonTypes } from "@/lib/validation/tournament-entry"

export const pokemonTypeColors: Record<
  (typeof pokemonTypes)[number],
  string
> = {
  Normal: "bg-stone-500 text-white",
  Fire: "bg-orange-500 text-white",
  Water: "bg-blue-500 text-white",
  Electric: "bg-yellow-400 text-slate-950",
  Grass: "bg-emerald-500 text-white",
  Ice: "bg-sky-300 text-slate-950",
  Fighting: "bg-red-700 text-white",
  Poison: "bg-purple-600 text-white",
  Ground: "bg-amber-700 text-white",
  Flying: "bg-indigo-400 text-white",
  Psychic: "bg-pink-500 text-white",
  Bug: "bg-lime-500 text-slate-950",
  Rock: "bg-yellow-700 text-white",
  Ghost: "bg-violet-700 text-white",
  Dragon: "bg-indigo-700 text-white",
  Dark: "bg-slate-800 text-white",
  Steel: "bg-slate-400 text-slate-950",
  Fairy: "bg-rose-400 text-white",
}
