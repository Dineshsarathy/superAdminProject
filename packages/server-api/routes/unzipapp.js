const JSZip = require("jszip");
const fs = require("fs");
const path = require("path");

/**
 * Extracts the contents of a ZIP file to a specified directory.
 *
 * @param {string} zipFilePath - Path to the ZIP file.
 * @param {string} extractToPath - Path to the directory where files should be extracted.
 */
const unzipFolder = async (zipFilePath, extractToPath) => {
  // Read the zip file
  const zipData = fs.readFileSync(zipFilePath);
  const zip = await JSZip.loadAsync(zipData);

  // Ensure the output directory exists
  if (!fs.existsSync(extractToPath)) {
    fs.mkdirSync(extractToPath, { recursive: true });
  }

  // Iterate over each file in the zip
  for (const [fileName, zipEntry] of Object.entries(zip.files)) {
    const filePath = path.join(extractToPath, fileName);

    if (zipEntry.dir) {
      // If the entry is a directory, create it
      fs.mkdirSync(filePath, { recursive: true });
    } else {
      // If it's a file, write it to the directory
      const fileData = await zipEntry.async("nodebuffer");
      const fileDir = path.dirname(filePath);

      // Ensure the file's directory exists
      if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir, { recursive: true });
      }

      fs.writeFileSync(filePath, fileData);
    }
  }

  console.log(`Files extracted to: ${extractToPath}`);
};

// Export the function
module.exports = unzipFolder;

// Example usage (uncomment to test directly):
// const zipFilePath = "./imgVignesh.zip";
// const extractToPath = "./extractedFolder";
// unzipFolder(zipFilePath, extractToPath);
