import { useEffect, useState } from "react";

import data from "../json/prompts.json";

export default function PromptCategory({ onEndCategoryClick, selectedItems }) {
  const [openItems, setOpenItems] = useState({});
  const [selectedCounts, setSelectedCounts] = useState({});
  const [orderMode, setOrderMode] = useState("favcount");

  useEffect(() => {
    const initialCounts = {};
    countSelectedItems(data, "", initialCounts);
    setSelectedCounts(initialCounts);
  }, [data, selectedItems]);

  const updateSelectedCounts = (parentKey, count) => {
    setSelectedCounts((prevCounts) => ({
      ...prevCounts,
      [parentKey]: count,
    }));
  };

  const toggleItem = (key, hasChildren) => {
    setOpenItems((prevState) => {
      const isOpen = !prevState[key];
      const newState = { ...prevState, [key]: isOpen };

      // If collapsing, remove all descendants from openItems
      if (!isOpen) {
        const keysToRemove = Object.keys(newState).filter((k) => k.startsWith(key + "."));
        keysToRemove.forEach((k) => delete newState[k]);
      }

      return newState;
    });

    // If it's an end category, perform the action
    if (!hasChildren) {
      const endKey = key.split(".").pop();
      onEndCategoryClick(endKey);
    }
  };

  const countSelectedItems = (data, parentKey = "", counts = {}) => {
    let totalCount = 0;

    Object.keys(data).forEach((key) => {
      const currentKey = parentKey ? `${parentKey}.${key}` : key;
      if (typeof data[key] === "object" && Object.keys(data[key]).length > 0) {
        const childCount = countSelectedItems(data[key], currentKey, counts);
        totalCount += childCount;
        counts[currentKey] = childCount;
      } else {
        const endKey = key.split(".").pop();
        if (selectedItems.includes(endKey)) {
          totalCount++;
          counts[currentKey] = 1; // or you can use counts[currentKey] = true;
        } else {
          counts[currentKey] = 0;
        }
      }
    });

    return totalCount;
  };

  const renderList = (data, parentKey = "") => {
    return (
      <ul className="ml-4">
        {Object.keys(data).map((key) => {
          const currentKey = parentKey ? `${parentKey}.${key}` : key;
          const isOpen = openItems[currentKey];
          const hasChildren = typeof data[key] === "object" && Object.keys(data[key]).length > 0;
          const endKey = key.split(".").pop();
          const isSelected = selectedItems.includes(endKey);
          const selectedCount = selectedCounts[currentKey] || 0;
          return (
            <li className="ml-8" key={currentKey}>
              <div className="text-sm cursor-pointer hover:underline">
                <a
                  target="_blank"
                  href={"https://danbooru.donmai.us/wiki_pages/" + key.replaceAll(" ", "_")}
                  className="mr-2 text-blue-400 underline"
                >
                  wiki
                </a>{" "}
                <a
                  target="_blank"
                  href={
                    "https://danbooru.donmai.us/posts?tags=" +
                    key.replaceAll(" ", "_") +
                    "+order%3A" +
                    orderMode +
                    "&z=5"
                  }
                  className="mr-6 text-blue-400 underline"
                >
                  posts
                </a>{" "}
                <span
                  className={`${isSelected && "text-green-700 font-bold italic"} ${hasChildren && "text-orange-800"}`}
                  onClick={() => toggleItem(currentKey, hasChildren)}
                >
                  {key}
                </span>
                {hasChildren && <span className="ml-4">({selectedCount})</span>} {isSelected && "✔"}{" "}
                {hasChildren && (isOpen ? "---" : "+++")}
              </div>
              {isOpen && hasChildren && renderList(data[key], currentKey)}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div>
      <div className="my-5 text-sm">
        <span className="mr-2">Order mode:</span>
        <button
          className={`${orderMode == "score" ? "underline" : ""} mr-2 hover:underline`}
          onClick={() => setOrderMode("score")}
        >
          score
        </button>
        <button
          className={`${orderMode == "favcount" ? "underline" : ""} mr-2 hover:underline`}
          onClick={() => setOrderMode("favcount")}
        >
          favcount
        </button>
        <button
          className={`${orderMode == "rank" ? "underline" : ""} mr-2 hover:underline`}
          onClick={() => setOrderMode("rank")}
        >
          rank
        </button>
        <button
          className={`${orderMode == "upvotes" ? "underline" : ""} mr-2 hover:underline`}
          onClick={() => setOrderMode("upvotes")}
        >
          upvotes
        </button>
        <button
          className={`${orderMode == "comment" ? "underline" : ""} mr-2 hover:underline`}
          onClick={() => setOrderMode("comment")}
        >
          comment
        </button>
      </div>

      <div>{renderList(data)}</div>
    </div>
  );
}
