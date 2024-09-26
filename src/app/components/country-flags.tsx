import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ReactCountryFlag from "react-country-flag";

interface Country {
  code: string;
  name: string;
}

interface CountrySelectProps {
  countries: Country[];
  selectedCountry: string;
  onCountryChange: (value: string) => void;
}

const CountryFlagsHome: React.FC<CountrySelectProps> = ({ countries, selectedCountry, onCountryChange }) => {
  return (
    <Select onValueChange={onCountryChange} value={selectedCountry}>
      <SelectTrigger className="w-full sm:w-[180px] bg-white bg-opacity-10 text-white border-gray-600">
        <SelectValue placeholder="Country" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Countries</SelectItem>
        {countries.map((country) => (
          <SelectItem key={country.code} value={country.code}>
            <div className="flex items-center">
              <ReactCountryFlag 
                countryCode={country.code} 
                svg 
                style={{
                  width: '1em',
                  height: '1em',
                  marginRight: '0.5em'
                }}
              />
              {country.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CountryFlagsHome;