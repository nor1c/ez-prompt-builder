/* eslint-disable no-useless-escape */
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { useState } from "react";

function App() {
  // const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [badTag, setBadTag] = useState<string>("");

  // const handleEndCategoryClick = (key: string) => {
  //   setSelectedItems((prevItems) => {
  //     if (prevItems.includes(key)) {
  //       return prevItems.filter((item) => item !== key);
  //     } else {
  //       return [...prevItems, key];
  //     }
  //   });
  // };

  const clearTag = () => {
    setBadTag("");
  };

  const pasteFromClipboard = async () => {
    const clipboardText = await navigator.clipboard.readText();
    setBadTag((prevText) => prevText + clipboardText);
  };

  const formatBadTag = () => {
    setBadTag((prevTag: string) => {
      const formatted = Array.from(
        new Set(
          prevTag
            .split(" ")
            .map((tag) =>
              tag
                .replace(/_/g, " ")
                .replace(/\censored/g, "")
                .replace(/\blur censor/g, "")
                .replace(/\mosaic censoring/g, "")
                .replace(/\bar censor/g, "")
                .replace(/\shiny skin/g, "")
                .replace(/\shiny hair/g, "")
                .replace(/\simple background/g, "")
                .replace(/\white background/g, "")
                .replace(/\female pubic hair/g, "")
                .replace(/\male pubic hair/g, "")
                .replace(/\mole under eye/g, "")
                .replace(/\symbol-shaped pupils/g, "")
                .replace(/\cum in pussy/g, "")
                .replace(/\pointy ears/g, "")
                .replace(/\hair ornament/g, "")
                .replace(/\collarbone/g, "")
                .replace(/\elf/g, "")
                .replace(/\puffy nipples/g, "")
                .replace(/\inverted nipples/g, "")
                .replace(/\jewelry/g, "")
                .replace(/\hair ribbon/g, "")
                .replace(/\side braid/g, "")
                .replace(/\hairclip/g, "")
                .replace(/\french braid/g, "")
                .replace(/\absurdres/g, "")
                .replace(/\highres/g, "")
                .replace(/\commentary/g, "")
                .replace(/\commentary request/g, "")
                .replace(/\original/g, "")
                .replace(/\signature/g, "")
                .replace(/\fanbox username/g, "")
                .replace(/\username/g, "")
                .replace(/\watermark/g, "")
                .replace(/\patreon username/g, "")
                .replace(/\patreon logo/g, "")
                .replace(/\big hair/g, "")
                .replace(/\artist name/g, "")
                .replace(/\web address/g, "")
                .replace(/\small breasts/g, "")
                .replace(/\medium breasts/g, "")
                .replace(/\large breasts/g, "")
                .replace(/\huge breasts/g, "")
                .replace(/\short hair/g, "")
                .replace(/\medium hair/g, "")
                .replace(/\very long hair/g, "")
                .replace(/\blonde hair/g, "")
                .replace(/\brown hair/g, "")
                .replace(/\black hair/g, "")
                .replace(/\blue hair/g, "")
                .replace(/\red hair/g, "")
                .replace(/\green hair/g, "")
                .replace(/\purple hair/g, "")
                .replace(/\pink hair/g, "")
                .replace(/\white hair/g, "")
                .replace(/\silver hair/g, "")
                .replace(/\orange hair/g, "")
                .replace(/\gray hair/g, "")
                .replace(/\yellow hair/g, "")
                .replace(/\multicolored hair/g, "")
                .replace(/\gradient hair/g, "")
                .replace(/\rainbow hair/g, "")
                .replace(/\turquoise hair/g, "")
                .replace(/\aqua hair/g, "")
                .replace(/\lavender hair/g, "")
                .replace(/\indigo hair/g, "")
                .replace(/\blue eyes/g, "")
                .replace(/\brown eyes/g, "")
                .replace(/\green eyes/g, "")
                .replace(/\red eyes/g, "")
                .replace(/\yellow eyes/g, "")
                .replace(/\purple eyes/g, "")
                .replace(/\pink eyes/g, "")
                .replace(/\black eyes/g, "")
                .replace(/\orange eyes/g, "")
                .replace(/\gray eyes/g, "")
                .replace(/\aqua eyes/g, "")
                .replace(/\golden eyes/g, "")
                .replace(/\silver eyes/g, "")
                .replace(/\multicolored eyes/g, "")
                .replace(/\rainbow eyes/g, "")
                .replace(/\white eyes/g, "")
                .replace(/\amber eyes/g, "")
                .replace(/\turquoise eyes/g, "")
                .replace(/\lavender eyes/g, "")
                .replace(/\heterochromia/g, "")
                .replace(/\long hair/g, "")
                .replace(/\patreon/g, "")
                .replace(/\dark skin/g, "")
                .replace(/\sweat/g, "")
                .replace(/\shiny/g, "")
                .replace(/\pubic hair/g, "")
                .replace(/\mole/g, "")
                .replace(/\cum/g, "")
                .replace(/\bangs/g, "")
                .replace(/\braid/g, "")
                .replace(/\un/g, "")
            )
            .filter((tag) => tag.trim() !== "")
        )
      ).join(", ");

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

  const [cleanedImage, setCleanedImage] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = function () {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (ctx) {
            // Set canvas size to match the image
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw the image onto the canvas (this will remove metadata)
            ctx.drawImage(img, 0, 0);

            // Convert canvas back to an image file, stripping all metadata
            canvas.toBlob(
              function (blob) {
                if (blob) {
                  const cleanedImageURL = URL.createObjectURL(blob);
                  setCleanedImage(cleanedImageURL);
                }
              },
              "image/png",
              1.0
            );
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };

  // batch exif cleaner
  const [cleanedImages, setCleanedImages] = useState<{ name: string; url: string }[]>([]);

  const handleFilesSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const imagePromises = Array.from(files).map((file) => processImage(file));
      const processedImages = await Promise.all(imagePromises);
      setCleanedImages(processedImages);
    }
  };

  const processImage = (file: File): Promise<{ name: string; url: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = function () {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (ctx) {
            // Set canvas size to match the image
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw the image onto the canvas (this will remove metadata)
            ctx.drawImage(img, 0, 0);

            // Convert canvas back to an image file, stripping all metadata
            canvas.toBlob(
              function (blob) {
                if (blob) {
                  const cleanedImageURL = URL.createObjectURL(blob);
                  resolve({ name: file.name, url: cleanedImageURL });
                }
              },
              "image/png",
              1.0
            );
          }
        };
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDownloadAll = async () => {
    const zip = new JSZip();

    cleanedImages.forEach((image) => {
      const imageName = image.name.replace(/\.[^/.]+$/, "") + "_cleaned.png";
      zip.file(
        imageName,
        fetch(image.url).then((res) => res.blob())
      );
    });

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "cleaned_images.zip");
  };

  // EXIF Reader
  const [metadata, setMetadata] = useState<string | null>(null);

  const handleExifFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMetadata(null); // Clear previous metadata
      try {
        // Read the file as binary data
        const arrayBuffer = await file.arrayBuffer();
        const text = cleanText(new TextDecoder().decode(new Uint8Array(arrayBuffer)));

        if (text) {
          setMetadata(formatMetadata(text));
        } else {
          setMetadata("No custom metadata found.");
        }
      } catch (error) {
        console.error("Error reading metadata:", error);
        setMetadata("Could not read metadata.");
      }
    }
  };

  // Function to clean the text, removing unwanted characters
  const cleanText = (text: string): string => {
    // Find the index of the first '<' character
    const startIndex = text.indexOf("<");

    // If '<' is found, extract text from that point onward
    if (startIndex !== -1) {
      text = text.substring(startIndex);
    }

    // Truncate text after the first occurrence of 'TI:'
    const marker = "TI:";
    const markerIndex = text.indexOf(marker);

    if (markerIndex !== -1) {
      text = text.substring(0, markerIndex + text.substring(markerIndex).indexOf("\n"));
    }

    // Remove non-printable characters and trim excessive whitespace
    const newText =
      "Prompt:" +
      text
        .replace(/[^\x20-\x7E]/g, "") // Remove non-printable ASCII characters
        .replace(/\s{2,}/g, " ") // Replace multiple spaces with a single space
        .trim();

    return newText;
  };

  const formatMetadata = (data: any): string => {
    return data.toString().includes("Negative prompt")
      ? keepTextBeforeKeyword(
          data
            .toString()
            .replaceAll("Prompt:", "Prompt: ")
            .replaceAll("Negative prompt", "\n\nNegative prompt")
            .replaceAll("Steps", "\n\nSteps"),
          "Lora hashes"
        )
      : "none";
  };

  const keepTextBeforeKeyword = (text: string, keyword: string): string => {
    const index = text.indexOf(keyword);

    if (index !== -1) {
      return text.substring(0, index + keyword.length);
    }

    return text;
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

      <hr className="mb-10 border-red-500" />

      <div>
        <label className="block mb-2 text-base font-medium text-gray-900 dark:text-white">EXIF Cleaner</label>

        <div className="p-2 rounded-md bg-gray-50">
          <label className="block font-medium text-gray-900 text-md dark:text-white">Single</label>

          <div className="flex flex-row gap-2 mt-4">
            <label>
              <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" id="file-input" />
              <label
                htmlFor="file-input"
                className="px-3 py-2 text-white bg-blue-500 rounded cursor-pointer hover:bg-blue-600"
              >
                Select Image
              </label>
            </label>

            <label>
              {cleanedImage && (
                <a
                  href={cleanedImage}
                  download="cleaned_image.png"
                  className="px-3 py-2 text-white bg-green-500 rounded cursor-pointer hover:bg-green-600"
                >
                  Download Cleaned Image
                </a>
              )}
            </label>
          </div>
        </div>

        <div className="p-2 mt-5 rounded-md bg-gray-50">
          <label className="block font-medium text-gray-900 text-md dark:text-white">Batch</label>

          <div className="flex flex-row gap-2 mt-4">
            <label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFilesSelect}
                multiple
                className="hidden"
                id="files-input"
              />
              <label
                htmlFor="files-input"
                className="px-3 py-2 text-white bg-blue-500 rounded cursor-pointer hover:bg-blue-600"
              >
                Select Images
              </label>
            </label>

            <label>
              {cleanedImages.length > 0 && (
                <a
                  onClick={handleDownloadAll}
                  className="px-3 py-2 text-white bg-green-500 rounded cursor-pointer hover:bg-green-600"
                >
                  Download All Cleaned Images
                </a>
              )}
            </label>
          </div>
        </div>
      </div>

      <hr className="mt-10 mb-10 border-red-500" />

      <div>
        <label className="block mt-10 mb-2 text-base font-medium text-gray-900 dark:text-white">EXIF Reader</label>

        <div className="p-2 rounded-md bg-gray-50">
          <div className="mt-2">
            <label>
              <input
                type="file"
                accept="image/*"
                onChange={handleExifFileSelect}
                className="hidden"
                id="exif-read-file"
              />
              <label
                htmlFor="exif-read-file"
                className="px-3 py-2 text-white bg-blue-500 rounded cursor-pointer hover:bg-blue-600"
              >
                Select Images
              </label>
            </label>
          </div>

          <div className="w-full max-w-lg p-4 mt-4 bg-white rounded shadow">
            <h2 className="mb-4 text-xl font-semibold">Metadata Information</h2>
            {metadata ? (
              <pre className="whitespace-pre-wrap">{metadata}</pre>
            ) : (
              <p>No metadata available. Please upload an image.</p>
            )}
          </div>
        </div>
      </div>

      {/* <PromptTextArea selectedItems={selectedItems} />

      <div className="mt-10">
        <label className="block mb-2 font-medium text-gray-900 text-md dark:text-white">Select desired prompt:</label>

        <div className="p-2 rounded-md bg-gray-50">
          <PromptCategory onEndCategoryClick={handleEndCategoryClick} selectedItems={selectedItems} />
        </div>
      </div> */}

      <div className="mt-20"></div>
    </div>
  );
}

export default App;
