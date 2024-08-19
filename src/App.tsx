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

  const clearTag = () => {
    setBadTag("");
  };

  const pasteFromClipboard = async () => {
    const clipboardText = await navigator.clipboard.readText();
    setBadTag((prevText) => prevText + clipboardText);
  };

  const formatBadTag = () => {
    setBadTag((prevTag: string) => {
      const formatted =
        Array.from(new Set(prevTag.split(" ").map((tag) => tag.replace(/_/g, " ").replace(/boom/g, "")))).join(", ") +
        ",";
      navigator.clipboard.writeText(formatted);
      return formatted;
    });
  };

  const copyFormattedBadTag = () => {
    navigator.clipboard.writeText(badTag);
  };

  const doAll = async () => {
    clearTag();
    await pasteFromClipboard();
    formatBadTag();

    copyFormattedBadTag();
  };

  return (
    <div className="w-full px-2 mx-auto mt-10 text-sm md:px-10 md:text-sm">
      <div className="mt-16 mb-12">
        <h5 className="mb-2 font-semibold text-md">Bad Tag Formatter</h5>
        <textarea
          rows={5}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={badTag}
          onChange={(e) => setBadTag(e.target.value)}
          placeholder="Enter your bad tag"
        />
        <div className="right-0 w-full mt-2 space-x-2 text-center">
          {/* <button onClick={clearTag} className="px-6 py-4 text-xs font-medium bg-red-200 rounded-md hover:bg-gray-300">
            CLEAR
          </button>
          <button
            onClick={pasteFromClipboard}
            className="px-6 py-4 text-xs font-medium bg-blue-200 rounded-md hover:bg-gray-300"
          >
            PASTE
          </button>
          <button
            onClick={formatBadTag}
            className="px-6 py-4 text-xs font-medium bg-green-200 rounded-md hover:bg-gray-300"
          >
            FORMAT
          </button>
          <button
            onClick={copyFormattedBadTag}
            className="px-6 py-4 text-xs font-medium bg-blue-300 rounded-md hover:bg-gray-300"
          >
            COPY
          </button> */}

          <button
            onClick={doAll}
            className="px-6 py-4 text-xs font-medium text-white bg-purple-500 rounded-md hover:bg-purple-700"
          >
            BOOM
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
