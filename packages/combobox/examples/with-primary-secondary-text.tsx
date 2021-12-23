import * as React from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  ComboboxPopover,
} from "@reach/combobox";
import { useCityMatch } from "./utils";
import "@reach/combobox/styles.css";
import { ComboboxObjectValue } from "../src";
import { checkTypeOfInput } from "../src/utils";
const bookOfMormonHeroes = [
  { primaryText: "Lehi" },
  { primaryText: "Nephi" },
  { primaryText: "Jacob", secondaryText: "Brother of Lehi" },
  { primaryText: "Enos", secondaryText: "Son of Jacob" },
  { primaryText: "King Benjamin", secondaryText: "Father of Mosiah" },
  { primaryText: "Abinadi", secondaryText: "Testified before King Noah" },
  {
    primaryText: "Alma the Elder",
    secondaryText: "Believed the words of Abinidi",
  },
  { primaryText: "Alma the Younger", secondaryText: "Visited by an Angel" },
  {
    primaryText: "Ammon",
    secondaryText: "Converted the king and queen and all his servants",
  },
  {
    primaryText: "Captain Moroni",
    secondaryText: "Great Nephite Warrior",
    tertiaryText: "Title of Liberty",
  },
  {
    primaryText: "Two Thousand Stripling Warriors",
    secondaryText: "Believed the words of their mothers",
    tertiaryText: "all were wounded but none perished",
  },
  {
    primaryText: "Samuel the lamanite",
    secondaryText: "Prophesied of Christs Birth",
  },
  {
    primaryText: "Mormon",
    secondaryText: "Abridged the Plates from many books",
  },
  {
    primaryText: "Moroni",
    secondaryText: "Son of Mormon",
    tertiaryText: "Added the plates of Ether and his own testimony.",
  },
  {
    primaryText: "The Brother of Jared",
    secondaryText: "Saw the Finger of God",
    tertiaryText:
      "Came to the promised land by barges that were tight like unto a dish.",
  },
  {
    primaryText: "Samuel The Lamanite",
    secondaryText: "Prophesied to the Nephites",
  },
  {
    primaryText: "Abish",
    secondaryText: "Shared King and Queen's conversion with entire village.",
  },
];
let name = "With Primary and Secondary Text (TS)";

function Example() {
  let [term, setTerm] = React.useState("");
  let [selection, setSelection] = React.useState<any>("");
  let bookOfMormonHeroes = useCityMatch(term);
  let ref = React.useRef(null);

  const handleChange = (event: any) => {
    setTerm(event.target.value);
  };

  const handleSelect = (value: ComboboxObjectValue | string) => {
    setSelection(checkTypeOfInput(value));
  };

  return (
    <div>
      <h2>Clientside Search</h2>
      <p>Selection: {selection}</p>
      <p>Term: {term}</p>
      <Combobox onSelect={handleSelect} aria-label="choose a city">
        <ComboboxInput
          ref={ref}
          onChange={handleChange}
          autocomplete={false}
          style={{ width: 400 }}
        />
        {bookOfMormonHeroes && (
          <ComboboxPopover>
            {bookOfMormonHeroes.length === 0 && (
              <p>
                No Results{" "}
                <button
                  onClick={() => {
                    setTerm("");
                    // @ts-ignore
                    ref.current.focus();
                  }}
                >
                  clear
                </button>
              </p>
            )}
            <ComboboxList>
              {bookOfMormonHeroes.slice(0, 10).map((result, index) => (
                <ComboboxOption
                  key={index}
                  value={{
                    key: index,
                    primaryText: `${result.city}`,
                    secondaryText: `${result.state}`,
                  }}
                />
              ))}
            </ComboboxList>
            <p>
              <a href="/new">Add a record</a>
            </p>
          </ComboboxPopover>
        )}
      </Combobox>
    </div>
  );
}

Example.storyName = name;
export { Example };

////////////////////////////////////////////////////////////////////////////////
