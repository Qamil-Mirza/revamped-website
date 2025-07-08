import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import Gallery from "@/components/ui/Gallery";
import sf from "@/public/USA/sf.jpg";
import wharf from "@/public/USA/wharf.jpg";
import ggbridge from "@/public/USA/goldengate.jpg";
import santamonica from "@/public/USA/santamonica.jpg";
import griffith from "@/public/USA/griffith.jpg";
import hollywood from "@/public/USA/hollywood.jpg";
import tunnel from "@/public/USA/tunnel.jpg";
import croc from "@/public/USA/croc.jpg";
import everglades from "@/public/USA/everglades.jpg";
import heli from "@/public/USA/heli.jpg";
import kwest from "@/public/USA/kwest.jpg";
import miami from "@/public/USA/miami.jpg";
import warmuseum from "@/public/USA/warmuseum.jpg";
import jazzclub from "@/public/USA/jazzclub.jpg";
import gunrange from "@/public/USA/gunrange.jpg";
import mjprofile from "@/public/Japan/mjprofile.jpg";
import nbyokocho from "@/public/Japan/nbyokocho.jpg";
import tsukiji from "@/public/Japan/tsukiji.jpg";
import deer from "@/public/Japan/deer.jpg";
import akihabara from "@/public/Japan/akihabara.jpg";
import nintendo from "@/public/Japan/nintendo.jpg";
import torii from "@/public/Japan/torii.jpg";
import kyoto from "@/public/Japan/kyoto.jpg";
import harry from "@/public/Japan/harry.jpg";
import lantern from "@/public/Japan/lantern.jpg";
import castle from "@/public/Japan/castle.jpg";
import tokyo from "@/public/Japan/tokyo.jpg";
import gov from "@/public/Japan/gov.jpg";
import street from "@/public/Japan/street.jpg";
import omyokocho from "@/public/Japan/omyokocho.jpg";
import fuji from "@/public/Japan/fuji.jpg";
import osakastreet from "@/public/Japan/osakastreet.jpg";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// List of highlighted countries for styling.
const highlightedCountries = ["United States of America", "Japan", "China", "Cambodia"];

interface CountryData {
  description?: string;
  images?: string[];
}

// Dictionary mapping country names to details.
const countryDetails: { [key: string]: CountryData } = {
  "United States of America": {
    description: "Adventures In The Land Of The Free",
    images: [
      sf.src,
      wharf.src,
      ggbridge.src,
      santamonica.src,
      griffith.src,
      hollywood.src,
      tunnel.src,
      croc.src,
      everglades.src,
      heli.src,
      kwest.src,
      miami.src,
      warmuseum.src,
      jazzclub.src,
      gunrange.src,
    ],
  },
  "Japan": {
    description: "Exploring The Land Of The Rising Sun",
    images: [
      mjprofile.src,
      nbyokocho.src,
      tsukiji.src,
      deer.src,
      akihabara.src,
      nintendo.src,
      torii.src,
      kyoto.src,
      harry.src,
      lantern.src,
      castle.src,
      tokyo.src,
      gov.src,
      street.src,
      omyokocho.src,
      fuji.src,
      osakastreet.src,
    ],
  },
  "China": {
    description: "Discovering The Cyberpunk City",
    images: [
      "/china/cn-hongya-group.JPEG",
      "/china/cqxm.JPEG",
      "/china/honyaselfie.JPEG",
      "/china/jfb.JPEG",
      "/china/apt.JPEG",
      "/china/apt-wide.JPEG",
      "/china/hongyanight.JPEG",
      "/china/hycave.JPEG",
      "/china/skyline.JPEG",
      "/china/lanternstreet.JPEG",
      "/china/ancientstreet.JPEG",
      "/china/cnfood.jpg",
      "/china/bunker.JPEG",
      "/china/lgkitty.JPEG",
      "/china/hkitty.JPEG",
      "/china/pandas.JPEG",
      "/china/bbqmountain.JPEG",
      "/china/mbsclone.JPEG",
      "/china/stare.JPEG",
      "/china/meandcar.JPEG",
    ],
  },
  "Cambodia": {
    description: "Exploring The Land Of The Khmer Empire",
    images: [
      "/cambodia/airportbuddha.jpeg",
      "/cambodia/angkor-res-morning.jpeg",
      "/cambodia/angkorbackshot.jpeg",
      "/cambodia/angkorcollage.jpeg",
      "/cambodia/angkorfood.jpeg",
      "/cambodia/angkorgate.jpeg",
      "/cambodia/angkortombinside.jpeg",
      "/cambodia/dino.jpeg",
      "/cambodia/eletemple.jpeg",
      "/cambodia/faceontemple.jpeg",
      "/cambodia/frontshotangkor.jpeg",
      "/cambodia/headlessbuddha.jpeg",
      "/cambodia/mecat.jpeg",
      "/cambodia/mecatjump.jpeg",
      "/cambodia/nightres.jpeg",
      "/cambodia/pubstreet.jpeg",
      "/cambodia/siemreapangkor.jpeg",
      "/cambodia/templefromabove.jpeg",
      "/cambodia/tombraidertemple.jpeg",
      "/cambodia/tuktuk.jpeg",
    ]
  }
};

export default function Map() {
  // State to keep track of the selected country name and its details.
  const [selectedCountryName, setSelectedCountryName] = useState<string>("");
  const [selectedCountryData, setSelectedCountryData] =
    useState<CountryData | null>(null);

  // When a country is clicked, look it up in the dictionary.
  const handleCountryClick = (countryName: string) => {
    setSelectedCountryName(countryName);
    if (countryDetails[countryName]) {
      setSelectedCountryData(countryDetails[countryName]);
    } else {
      setSelectedCountryData(null);
    }
    console.log("Country clicked:", countryName);
  };

  return (
    <div>
      <ComposableMap>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const countryName: string = geo.properties.name;
              const isHighlighted = highlightedCountries.includes(countryName);
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={isHighlighted ? "#4ade80" : "#ffffff"}
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
      {/* Display the details for the selected country */}
      {selectedCountryData && (
        <div>
          <h1 className="text-primaryText text-center text-4xl font-bold mb-2">
            {selectedCountryName}
          </h1>
          <p className="text-primaryText text-center text-xl mb-6">{selectedCountryData.description}</p>
          <Gallery
            images={selectedCountryData.images || []}
            description={selectedCountryData.description || ""}
          />
        </div>
      )}
    </div>
  );
}
