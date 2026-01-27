export const validateFile = (file, options = {}) => {
    const { maxSizeMB = 5, allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'] } = options;

    if (!file) return null;

    if (!allowedTypes.includes(file.type)) {
        return 'invalidFileType';
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
        return 'fileTooLarge';
    }

    return null;
};
