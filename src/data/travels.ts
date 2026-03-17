import manifest from "./travel-manifest.json";

export interface CityData {
  name: string;
  slug: string;
  images: string[];
}

export interface CountryData {
  name: string;
  slug: string;
  geoName: string;
  description: string;
  cities: CityData[];
}

type ManifestType = {
  [countrySlug: string]: {
    [citySlug: string]: string[];
  };
};

const typedManifest = manifest as ManifestType;

// Static metadata for countries and cities. You can refine city names/slugs later.
const baseCountries: Omit<CountryData, "cities">[] = [
  {
    name: "United States",
    slug: "usa",
    geoName: "United States of America",
    description: "Adventures In The Land Of The Free",
  },
  {
    name: "Japan",
    slug: "japan",
    geoName: "Japan",
    description: "Exploring The Land Of The Rising Sun",
  },
  {
    name: "China",
    slug: "china",
    geoName: "China",
    description: "Discovering The Cyberpunk City",
  },
  {
    name: "Cambodia",
    slug: "cambodia",
    geoName: "Cambodia",
    description: "Exploring The Land Of The Khmer Empire",
  },
  {
    name: "Costa Rica",
    slug: "costa-rica",
    geoName: "Costa Rica",
    description: "Living Pura Vida",
  },
  {
    name: "Mexico",
    slug: "mexico",
    geoName: "Mexico",
    description: "Living La Buena Vida",
  },
  {
    name: "Malaysia",
    slug: "malaysia",
    geoName: "Malaysia",
    description: "Chasing Sunsets In Southeast Asia",
  },
];

function toTitleCaseSlug(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export const countries: CountryData[] = baseCountries.map((base) => {
  const countryManifest = typedManifest[base.slug] || {};
  const citySlugs = Object.keys(countryManifest).filter(
    (slug) => slug !== "unsorted"
  );

  const cities: CityData[] = citySlugs.map((citySlug) => ({
    name: toTitleCaseSlug(citySlug),
    slug: citySlug,
    images: countryManifest[citySlug] || [],
  }));

  return {
    ...base,
    cities,
  };
});

export const highlightedGeoCountries = countries.map((c) => c.geoName);

export function getCountryByGeoName(geoName: string): CountryData | null {
  return countries.find((c) => c.geoName === geoName) ?? null;
}

