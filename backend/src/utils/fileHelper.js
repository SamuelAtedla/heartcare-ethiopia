const path = require('path');

/**
 * Converts an uploaded file's absolute path to a relative path from storage directory
 * This ensures the path can be served correctly by the static file middleware
 * 
 * @param {string} absolutePath - The absolute file path from multer (req.file.path)
 * @returns {string} - Relative path from storage directory (e.g., 'receipts/file.pdf')
 */
const getRelativeStoragePath = (absolutePath) => {
    // Find the 'storage' part in the path
    const pathParts = absolutePath.split(path.sep);
    const storageIndex = pathParts.findIndex(part => part === 'storage');

    if (storageIndex === -1) {
        // If 'storage' not found, return the filename only
        return path.basename(absolutePath);
    }

    // Return everything after 'storage/'
    return pathParts.slice(storageIndex + 1).join('/');
};

/**
 * Gets the full URL for accessing an uploaded file
 * 
 * @param {string} relativePath - Relative path from storage directory
 * @param {object} req - Express request object (to get base URL)
 * @returns {string} - Full URL to access the file
 */
const getFileUrl = (relativePath, req) => {
    const protocol = req.protocol;
    const host = req.get('host');
    return `${protocol}://${host}/storage/${relativePath}`;
};

module.exports = {
    getRelativeStoragePath,
    getFileUrl
};
