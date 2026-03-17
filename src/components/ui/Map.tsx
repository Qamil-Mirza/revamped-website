import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import Gallery from "@/components/ui/Gallery";
import {
  countries,
  highlightedGeoCountries,
  getCountryByGeoName,
  type CountryData,
} from "@/data/travels";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function Map() {
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [selectedCitySlug, setSelectedCitySlug] = useState<string | null>(null);

  const handleCountryClick = (countryName: string) => {
    const country = getCountryByGeoName(countryName);
    setSelectedCountry(country);
    if (country && country.cities.length > 0) {
      setSelectedCitySlug(country.cities[0].slug);
    } else {
      setSelectedCitySlug(null);
    }
  };

  return (
    <div>
      <ComposableMap>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const countryName: string = geo.properties.name;
              const isHighlighted = highlightedGeoCountries.includes(countryName);
              const isSelected = selectedCountry?.geoName === countryName;
              
              // Determine fill color: selected (orange) > highlighted (green) > default (white)
              const getFillColor = () => {
                if (isSelected) return "#FF8A65";
                if (isHighlighted) return "#4ade80";
                return "#ffffff";
              };
              
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={getFillColor()}
                  stroke="#EAEAEC"
                  style={{
                    default: { outline: "none" },
                    hover: {
                      fill: isHighlighted ? "#FF8A65" : "#F5F4F4",
                      outline: "none",
                      cursor: "pointer",
                    },
                    pressed: { outline: "none" },
                  }}
                  onClick={() => handleCountryClick(countryName)}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      {selectedCountry && (
        <div className="mt-8">
          <h1 className="text-primaryText text-center text-4xl font-bold mb-2">
            {selectedCountry.name}
          </h1>
          <p className="text-primaryText text-center text-xl mb-6">
            {selectedCountry.description}
          </p>

          {selectedCountry.cities.length > 0 && (
            <>
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {selectedCountry.cities.map((city) => {
                  const isActive = city.slug === selectedCitySlug;
                  return (
                    <button
                      key={city.slug}
                      type="button"
                      onClick={() => setSelectedCitySlug(city.slug)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                        isActive
                          ? "bg-green-500/20 border-green-400 text-green-300"
                          : "bg-transparent border-gray-600 text-gray-300 hover:border-green-400 hover:text-green-200"
                      }`}
                    >
                      {city.name}
                    </button>
                  );
                })}
              </div>

              {selectedCitySlug && (
                <div className="space-y-8">
                  {selectedCountry.cities
                    .filter((city) => city.slug === selectedCitySlug)
                    .map((city) => (
                      <Gallery
                        key={city.slug}
                        city={city.name}
                        images={city.images}
                      />
                    ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
