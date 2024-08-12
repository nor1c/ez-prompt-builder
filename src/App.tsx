import { useState } from "react";

import PromptCategory from "./components/PromptCategory";
import PromptTextArea from "./components/PromptTextArea";

function App() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [badTag, setBadTag] = useState<string>("");

  const handleEndCategoryClick = (key: string) => {
    setSelectedItems((prevItems) => {
      if (prevItems.includes(key)) {
        return prevItems.filter((item) => item !== key);
      } else {
        return [...prevItems, key];
      }
    });
  };

  const formatBadTag = () => {
    const formattedText = Array.from(new Set(badTag.split(" ").map((tag) => tag.replace(/_/g, " ")))).join(", ");

    setBadTag(formattedText);
  };

  const clearTag = () => {
    setBadTag("");
  };

  const pasteFromClipboard = async () => {
    const clipboardText = await navigator.clipboard.readText();
    setBadTag((prevText) => prevText + clipboardText);
  };

  const addBreakLine = () => {
    const formattedText =
      badTag
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag)
        .join(",\n") + ",";
    setBadTag(formattedText);

    setBadTag(formattedText);
  };

  const copyFormattedBadTag = () => {
    navigator.clipboard.writeText(badTag);
  };

  return (
    <div className="w-full px-2 mx-auto mt-10 text-sm md:px-10 md:text-sm">
      <div className="mt-16">
        <h5 className="mb-2 font-semibold text-md">Bad Tag Formatter</h5>
        <textarea
          rows={5}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={badTag}
          onChange={(e) => setBadTag(e.target.value)}
          placeholder="Enter your bad tag"
        />
        <div className="right-0 w-full mt-2 space-x-2 text-right">
          <button onClick={clearTag} className="p-2 text-xs bg-red-200 rounded-md hover:bg-gray-300">
            CLEAR
          </button>
          <button onClick={pasteFromClipboard} className="p-2 text-xs bg-blue-200 rounded-md hover:bg-gray-300">
            PASTE
          </button>
          <button onClick={formatBadTag} className="p-2 text-xs bg-green-200 rounded-md hover:bg-gray-300">
            FORMAT
          </button>
          {/* <button onClick={addBreakLine} className="p-2 text-xs bg-gray-200 rounded-md hover:bg-gray-300">
            ADD BREAK
          </button> */}
          <button onClick={copyFormattedBadTag} className="p-2 text-xs bg-blue-300 rounded-md hover:bg-gray-300">
            COPY
          </button>
        </div>
      </div>

      <PromptTextArea selectedItems={selectedItems} />

      <div className="mt-10">
        <label className="block mb-2 font-medium text-gray-900 text-md dark:text-white">Select desired prompt:</label>

        <div className="p-2 rounded-md bg-gray-50">
          <PromptCategory onEndCategoryClick={handleEndCategoryClick} selectedItems={selectedItems} />
        </div>
      </div>

      <div className="mt-20"></div>
    </div>
  );
}

export default App;
