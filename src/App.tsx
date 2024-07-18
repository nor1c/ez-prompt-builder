import { useState } from "react";

import PromptCategory from "./components/PromptCategory";
import PromptTextArea from "./components/PromptTextArea";

function App() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleEndCategoryClick = (key: string) => {
    setSelectedItems((prevItems) => {
      if (prevItems.includes(key)) {
        return prevItems.filter((item) => item !== key);
      } else {
        return [...prevItems, key];
      }
    });
  };

  return (
    <div className="w-full px-2 mx-auto mt-10 text-sm md:px-10 md:text-sm">
      <PromptTextArea selectedItems={selectedItems} />

      <div className="mt-10">
        <label className="block mb-2 font-medium text-gray-900 text-md dark:text-white">Select desired prompt:</label>

        <div className="p-2 rounded-md bg-gray-50">
          <PromptCategory onEndCategoryClick={handleEndCategoryClick} selectedItems={selectedItems} />
        </div>
      </div>
    </div>
  );
}

export default App;
