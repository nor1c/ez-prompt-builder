import { saveAs } from "file-saver";
import JSZip from "jszip";
import { useState } from "react";

const unwantedWords = [
  "virtual youtuber",
  "nijisanji",
  "princess connect!",
  "genshin impact",
  "rating:q",
  "rating:s",
  "rating:e",
  "parted ribbon",
  "depth of field",
  "red background",
  "blue background",
  "pink background",
  "two-tone background",
  "gradient background",
  "white border",
  "dark-skinned female",
  "dark-skinned male",
  "censored",
  "blur censor",
  "mosaic censoring",
  "convenient censoring",
  "bar censor",
  "hair bun",
  "shiny skin",
  "shiny hair",
  "simple background",
  "white background",
  "female pubic hair",
  "male pubic hair",
  "mole under eye",
  "symbol-shaped pupils",
  "cum in pussy",
  "pointy ears",
  "hair ornament",
  "collarbone",
  "elf",
  "puffy nipples",
  "inverted nipples",
  "jewelry",
  "hair ribbon",
  "side braid",
  "hairclip",
  "french braid",
  "absurdres",
  "highres",
  "commentary",
  "commentary request",
  "original",
  "signature",
  "fanbox username",
  "username",
  "watermark",
  "patreon username",
  "patreon logo",
  "big hair",
  "artist name",
  "web address",
  "small breasts",
  "medium breasts",
  "large breasts",
  "huge breasts",
  "short hair",
  "medium hair",
  "very long hair",
  "blonde hair",
  "brown hair",
  "black hair",
  "blue hair",
  "red hair",
  "green hair",
  "purple hair",
  "pink hair",
  "white hair",
  "silver hair",
  "orange hair",
  "gray hair",
  "yellow hair",
  "multicolored hair",
  "gradient hair",
  "rainbow hair",
  "turquoise hair",
  "aqua hair",
  "lavender hair",
  "indigo hair",
  "blue eyes",
  "brown eyes",
  "green eyes",
  "red eyes",
  "yellow eyes",
  "purple eyes",
  "pink eyes",
  "black eyes",
  "orange eyes",
  "gray eyes",
  "aqua eyes",
  "golden eyes",
  "silver eyes",
  "multicolored eyes",
  "rainbow eyes",
  "white eyes",
  "amber eyes",
  "turquoise eyes",
  "lavender eyes",
  "heterochromia",
  "blurry background",
  "animal ears",
  "black bow",
  "black bowtie",
  "black legwear",
  "black leotard",
  "bowtie",
  "brown legwear",
  "detached collar",
  "fake animal ears",
  "fishnet legwear",
  "fishnets",
  "groin",
  "hairband",
  "highleg leotard",
  "highleg",
  "karin (azur lane)",
  "karin ()",
  "leotard",
  "official alternate costume",
  "alternate costume",
  "pantyhose",
  "playboy bunny",
  "rabbit ears",
  "rabbit tail",
  "red bowtie",
  "ribbon",
  "sidelocks",
  "strapless leotard",
  "strapless",
  "swimsuit",
  "tail",
  "tradition bowtie",
  "white leotard",
  "wrist cuffs",
  "antenna hair",
  "clothed female nude male",
  "clothed sex",
  "hair between eyes",
  "hair over one eye",
  "eyebrows visible through hair",
  "bed sheet",
  "on bed",
  "sheet grab",
  "wet hair",
  "bathtub",
  "bathroom",

  "water",
  "pool",
  "ahoge",
  "wet",
  "underwear",
  "interracial",
  "pillow",
  "bed",
  "bow",
  "long hair",
  "patreon",
  "dark skin",
  "horizon",
  "necklace",
  "sweat",
  "shiny",
  "pubic hair",
  "mole",
  "cum",
  "bangs",
  "braid",
  "twintails",
  "twintail",
  "ponytail",
  "ejaculation",
  "earrings",
  "skindentation",
  "blurry",
  "kantai collection",
  "blue archive",
  "azur lane",
  "hololive",
  "idolmaster",
  "DREIKOstyle",
  "tanlines",
  "tan",
  "fang",
  "un",
];

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
            .map((tag) => tag.replace(/_/g, " "))
            .filter((tag) => tag.trim() !== "")
            .filter((tag) => !unwantedWords.includes(tag))
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

  const [csvData, setCsvData] = useState(null);
  const [prefix, setPrefix] = useState("ARTISTstyle"); // Default prefix

  // Function to handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;
      setCsvData(text);
    };

    reader.readAsText(file);
  };

  // Function to generate .txt files with the prepended text and zip them
  const generateZipFile = () => {
    if (!csvData) return;

    const zip = new JSZip();
    const rows = csvData.split("\n");

    rows.forEach((row) => {
      const columns = row.split(",");
      const fileName = `${columns[0]}.txt`;
      const content = columns.slice(1).join(",").replace(/^"|"$/g, ""); // Remove quotes around the second column
      const prependedContent = `${prefix}, ${content}`; // Use dynamic prefix

      // Add each .txt file with the prepended content to the zip archive
      zip.file(fileName, prependedContent);
    });

    // Generate the zip file and download it
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "text_files.zip"); // Download the zip file
    });
  };

  // format comma separated prompts
  const [prompt, setPrompt] = useState<string>("");

  const handleFormat = async (): Promise<void> => {
    try {
      const clipboardText = await navigator.clipboard.readText();

      setPrompt(clipboardText);

      let formattedPrompt = clipboardText;
      unwantedWords.forEach((tag) => {
        const tagWithComma = new RegExp(`\\b${tag}\\b,?`, "gi");
        formattedPrompt = formattedPrompt.replace(tagWithComma, "");
      });

      formattedPrompt = formattedPrompt
        .replace(/\s+/g, " ")
        .replace(/\s*,\s*/g, ", ")
        .replace(/^,|,$/g, "")
        .trim();

      setPrompt(formattedPrompt);

      await navigator.clipboard.writeText(formattedPrompt);
    } catch (err) {
      console.error("Failed to read or write clipboard contents: ", err);
    }
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
          <button
            onClick={doAll}
            className="px-4 py-2 text-xs font-medium text-white bg-purple-500 rounded-md hover:bg-purple-700"
          >
            FORMAT & COPY
          </button>
        </div>
      </div>

      <div className="w-full mx-auto mb-10">
        <h3 className="mb-2 text-lg font-bold">Prompt Formatter</h3>
        <textarea
          className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={5}
        />
        <div className="right-0 w-full space-x-2 text-center">
          <button
            className="px-4 py-2 text-xs font-medium text-white bg-purple-500 rounded-md hover:bg-purple-700"
            onClick={handleFormat}
          >
            FORMAT & COPY
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

      <div className="mt-10">
        <h1 className="mb-6 text-2xl font-bold">CSV to Zipped Text Files</h1>

        {/* File upload input */}
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="block w-full mb-4 text-sm text-gray-700 border border-gray-300 rounded-md cursor-pointer bg-gray-50 focus:outline-none"
        />

        {/* Prefix input */}
        <div className="w-full max-w-md mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="prefix">
            Prefix:
          </label>
          <input
            type="text"
            id="prefix"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            placeholder="Enter prefix (e.g., ARTISTstyle)"
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Generate Zip Button */}
        <button
          onClick={generateZipFile}
          className="px-6 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Generate Zip
        </button>
      </div>

      <div className="mt-20"></div>
    </div>
  );
}

export default App;
