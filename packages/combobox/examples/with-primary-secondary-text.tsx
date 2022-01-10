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

const suggestions = [
  {
    key: "1",
    superPowerValue: 5,
    primaryText: "Iron Man",
    secondaryText: "Tony Stark",
  },
  {
    key: "2",
    superPowerValue: 10,
    primaryText: "Hulk",
    secondaryText: "Bruce Banner",
  },
  {
    key: "3",
    superPowerValue: 10,
    primaryText: "Thor",
    secondaryText: "Thor Odinson",
  },
];
export function removeDiacritics(str: any) {
  // normalize() converts a string into unicode, from which we can replace a range of diacritic characters
  // https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
const controlsSuggestions = suggestions.slice(0, 3).map((suggestion) => {
  return {
    key: suggestion.key,
    primaryText: suggestion.primaryText,
    secondaryText: suggestion.secondaryText,
    superPowerValue: suggestion.superPowerValue,
  };
});
let name = "With Primary and Secondary Text (TS)";
function createInputSuggestion(input: any) {
  return {
    key: "INPUT_TEXT_OPTION",
    primaryText: input.trim(),
    type: "INPUT_TEXT_OPTION",
  };
}

function shouldKeepInputValue(state: any, changes: any) {
  // Autosuggest design is to keep the current input value when LAST_RESORT is selected.
  return changes.selectedItem && changes.selectedItem.type === "LAST_RESORT";
}

function includesInputText(
  suggestionText: any,
  inputText: any,
  ignoreDiacritics: any
) {
  if (suggestionText) {
    const normalizedSuggestionText = (
      ignoreDiacritics ? removeDiacritics(suggestionText) : suggestionText
    ).toLowerCase();
    const normalizedInputText = (
      ignoreDiacritics ? removeDiacritics(inputText) : inputText
    )
      .toLowerCase()
      .trim();
    return normalizedSuggestionText.includes(normalizedInputText);
  }
  return false;
}
function Example({
  noFilter = false,
  handleInput = false,
  ignoreDiacritics = true,
  chromeAutoCompleteOff = "off",
  clearOnClickAway = false,
  showLastResortOnFocus = false,
  maxLength = 512,
  keepUserInputTextAlways = false,
  virtualize = false,
  sortFunction = null,
  lastResort,
}) {
  let [term, setTerm] = React.useState("");
  let ref = React.useRef(null);

  const handleChange = (event: any) => {
    setTerm(event.target.value);
  };

  const handleSelect = (value: ComboboxObjectValue | string) => {
    // setSelection(value);
  };
  let displaySuggestions = [...controlsSuggestions];
  if (!noFilter && term) {
    displaySuggestions = displaySuggestions.filter(
      (suggestion) =>
        includesInputText(suggestion.primaryText, term, ignoreDiacritics) ||
        includesInputText(suggestion.secondaryText, term, ignoreDiacritics)
      // includesInputText(suggestion.tertiaryText, term, ignoreDiacritics)
    );
  }
  // User-provided sort function for suggestions
  if (sortFunction && typeof sortFunction === "function") {
    displaySuggestions.sort((sortFunction as any).bind(null, term));
  }
  if (lastResort && (term || showLastResortOnFocus)) {
    displaySuggestions.push({
      ...lastResort,
      key: "LAST_RESORT",
      type: "LAST_RESORT",
    });
  }
  if (
    handleInput &&
    term &&
    !displaySuggestions.find(
      (s) => s.primaryText.toLowerCase() === term.toLowerCase().trim()
    )
  ) {
    // displaySuggestions.unshift(createInputSuggestion(term));
  }

  return (
    <div>
      <h2>Clientside Search</h2>
      {/* <p>Selection: {selection}</p> */}
      <p>Term: {term}</p>
      <Combobox onSelect={handleSelect} aria-label="choose a city">
        <ComboboxInput
          ref={ref}
          onChange={handleChange}
          style={{ width: 400 }}
          autocomplete={false}
        />
        {displaySuggestions && (
          <ComboboxPopover>
            {displaySuggestions.length === 0 && (
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
              {displaySuggestions.slice(0, 10).map((result, index) => {
                return (
                  <ComboboxOption
                    key={index}
                    value={{
                      key: index,
                      primaryText: `${result.primaryText}`,
                      secondaryText: `${result.secondaryText}`,
                    }}
                  />
                );
              })}
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
