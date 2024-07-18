import { useEffect, useState } from "react";

import data from "../json/prompts.json";

interface Props {
  onEndCategoryClick: (key: string) => void;
  selectedItems: string[];
}

interface Data {
  [key: string]: any;
}

interface Counts {
  [key: string]: number;
}

export default function PromptCategory({ onEndCategoryClick, selectedItems }: Props) {
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});
  const [selectedCounts, setSelectedCounts] = useState<Counts>({});
  const [orderMode, setOrderMode] = useState<string>("favcount");

  useEffect(() => {
    const initialCounts: Counts = {};
    countSelectedItems(data, "", initialCounts);
    setSelectedCounts(initialCounts);
  }, [data, selectedItems]);

  const toggleItem = (key: string, hasChildren: boolean) => {
    setOpenItems((prevState) => {
      const isOpen = !prevState[key];
      const newState = { ...prevState, [key]: isOpen };

      if (!isOpen) {
        const keysToRemove = Object.keys(newState).filter((k) => k.startsWith(key + "."));
        keysToRemove.forEach((k) => delete newState[k]);
      }

      return newState;
    });

    if (!hasChildren) {
      const endKey = key.split(".").pop() as string;
      onEndCategoryClick(endKey);
    }
  };

  const countSelectedItems = (data: Data, parentKey = "", counts: Counts = {}): number => {
    let totalCount = 0;

    Object.keys(data).forEach((key) => {
      const currentKey = parentKey ? `${parentKey}.${key}` : key;
      if (typeof data[key] === "object" && Object.keys(data[key]).length > 0) {
        const childCount = countSelectedItems(data[key], currentKey, counts);
        totalCount += childCount;
        counts[currentKey] = childCount;
      } else {
        const endKey = key.split(".").pop() as string;
        if (selectedItems.includes(endKey)) {
          totalCount++;
          counts[currentKey] = 1;
        } else {
          counts[currentKey] = 0;
        }
      }
    });

    return totalCount;
  };

  const renderList = (data: Data, parentKey = "") => {
    return (
      <ul className="ml-2">
        {Object.keys(data).map((key) => {
          const currentKey = parentKey ? `${parentKey}.${key}` : key;
          const isOpen = openItems[currentKey];
          const hasChildren = typeof data[key] === "object" && Object.keys(data[key]).length > 0;
          const endKey = key.split(".").pop() as string;
          const isSelected = selectedItems.includes(endKey);
          const selectedCount = selectedCounts[currentKey] || 0;
          return (
            <li key={currentKey}>
              <div className="cursor-pointer  hover:underline">
                <a
                  target="_blank"
                  href={"https://danbooru.donmai.us/wiki_pages/" + key.replace(/ /g, "_")}
                  className="text-blue-400 underline "
                >
                  wiki
                </a>{" "}
                <a
                  target="_blank"
                  href={
                    "https://danbooru.donmai.us/posts?tags=" + key.replace(/ /g, "_") + "+order%3A" + orderMode + "&z=5"
                  }
                  className="text-blue-400 underline "
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
                {hasChildren && (isOpen ? "-" : "+")}
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
      <div className="my-5 ">
        <span className="mr-2 font-bold">order:</span>
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
