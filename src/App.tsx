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
                .replace(/censored/g, "")
                .replace(/blur censor/g, "")
                .replace(/mosaic censoring/g, "")
                .replace(/bar censor/g, "")
                .replace(/absurdres/g, "")
                .replace(/highres/g, "")
                .replace(/commentary/g, "")
                .replace(/commentary request/g, "")
                .replace(/original/g, "")
                .replace(/signature/g, "")
                .replace(/fanbox username/g, "")
                .replace(/username/g, "")
                .replace(/watermark/g, "")
                .replace(/patreon username/g, "")
                .replace(/patreon logo/g, "")
                .replace(/big hair/g, "")
                .replace(/artist name/g, "")
                .replace(/web address/g, "")
                .replace(/huge breasts/g, "large breasts")
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
              "image/jpeg",
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
              "image/jpeg",
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
      const imageName = image.name.replace(/\.[^/.]+$/, "") + "_cleaned.jpg";
      zip.file(
        imageName,
        fetch(image.url).then((res) => res.blob())
      );
    });

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "cleaned_images.zip");
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

      <div>
        <label className="block mb-2 text-base font-medium text-gray-900 dark:text-white">
          EXIF Cleaner (works on client-side, no file stored to server)
        </label>

        <div className="p-2 rounded-md bg-gray-50">
          <label className="block font-medium text-gray-900 text-md dark:text-white">Single</label>

          <div className="flex flex-row gap-2 mt-4">
            <label>
              <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" id="file-input" />
              <label
                htmlFor="file-input"
                className="px-3 py-2 text-white bg-blue-500 rounded cursor-pointer hover:bg-blue-600"
              >
                Select Images
              </label>
            </label>

            <label>
              {cleanedImage && (
                <a
                  href={cleanedImage}
                  download="cleaned_image.jpg"
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
