export interface FacilityInfo {
  name: string;
  email: string;
}

export const facilities: FacilityInfo[] = [
  { name: "Arya's Home", email: "aryakawankar@gmail.com" },
  { name: "Shweta's School", email: "ravnakminali@gmail.com" },
  { name: "Samiksha'S Home", email: "samikshakadge86@gmail.com" },
  { name: "Tanmay's Home", email: "pirdankart@gmail.com" },
  { name: "Dombivali Centre", email: "samiksha.233174201@vcet.edu.in"},
  {name: "Sai Krupa Bldg", email: "arya.233194201@vcet.edu.in"},
];

export function getFacilityEmailByName(name: string | undefined | null): string | null {
  if (!name) return null;
  const f = facilities.find((x) => x.name === name);
  return f?.email ?? null;
}


