import { useState } from "react";

export default function PromptTextArea({ selectedItems }) {
  const [textareaValue, setTextareaValue] = useState("");

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(selectedItems.join(", ").toString());
  };

  return (
    <>
      <label for="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Your prompt:
      </label>
      <textarea
        id="message"
        rows="4"
        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        value={selectedItems.join(", ")}
      ></textarea>

      <div className="right-0 w-full mt-2 text-right">
        <button onClick={handleCopyToClipboard} className="p-2 text-xs bg-gray-200 rounded-md hover:bg-gray-300">
          COPY
        </button>
      </div>
    </>
  );
}
