
/**
 * This utility handles saving and loading data from local files
 * instead of using localStorage.
 */

// Directory handle where we'll save all app data
let appDirectoryHandle: FileSystemDirectoryHandle | null = null;

/**
 * Initialize the file storage system by getting permission to access a directory
 */
export const initializeFileStorage = async (): Promise<boolean> => {
  try {
    // Request permission to access a directory
    appDirectoryHandle = await window.showDirectoryPicker({
      mode: 'readwrite',
      id: 'personify-keeper-data',
      startIn: 'documents'
    });
    
    // Create data directories if they don't exist
    await getOrCreateDirectory('people');
    await getOrCreateDirectory('settings');
    await getOrCreateDirectory('photos');
    
    return true;
  } catch (error) {
    console.error('Error initializing file storage:', error);
    return false;
  }
};

/**
 * Get or create a subdirectory in the app directory
 */
const getOrCreateDirectory = async (name: string): Promise<FileSystemDirectoryHandle> => {
  if (!appDirectoryHandle) {
    throw new Error('File storage not initialized');
  }
  
  try {
    return await appDirectoryHandle.getDirectoryHandle(name, { create: true });
  } catch (error) {
    console.error(`Error getting/creating directory ${name}:`, error);
    throw error;
  }
};

/**
 * Save data to a JSON file
 */
export const saveJsonFile = async (filename: string, data: any, subdirectory?: string): Promise<boolean> => {
  if (!appDirectoryHandle) {
    console.error('File storage not initialized');
    return false;
  }
  
  try {
    const parentDir = subdirectory 
      ? await getOrCreateDirectory(subdirectory) 
      : appDirectoryHandle;
    
    const fileHandle = await parentDir.getFileHandle(filename, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(JSON.stringify(data, null, 2));
    await writable.close();
    
    return true;
  } catch (error) {
    console.error(`Error saving file ${filename}:`, error);
    return false;
  }
};

/**
 * Load data from a JSON file
 */
export const loadJsonFile = async <T>(filename: string, subdirectory?: string, defaultValue?: T): Promise<T> => {
  if (!appDirectoryHandle) {
    console.error('File storage not initialized');
    return defaultValue as T;
  }
  
  try {
    const parentDir = subdirectory 
      ? await appDirectoryHandle.getDirectoryHandle(subdirectory, { create: false }) 
      : appDirectoryHandle;
    
    const fileHandle = await parentDir.getFileHandle(filename, { create: false });
    const file = await fileHandle.getFile();
    const content = await file.text();
    
    return JSON.parse(content) as T;
  } catch (error) {
    console.error(`Error loading file ${filename}:`, error);
    return defaultValue as T;
  }
};

/**
 * Save binary data (like photos) to a file
 */
export const saveBinaryFile = async (filename: string, data: Blob, subdirectory?: string): Promise<boolean> => {
  if (!appDirectoryHandle) {
    console.error('File storage not initialized');
    return false;
  }
  
  try {
    const parentDir = subdirectory 
      ? await getOrCreateDirectory(subdirectory) 
      : appDirectoryHandle;
    
    const fileHandle = await parentDir.getFileHandle(filename, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(data);
    await writable.close();
    
    return true;
  } catch (error) {
    console.error(`Error saving binary file ${filename}:`, error);
    return false;
  }
};

/**
 * Get data URL for a photo file
 */
export const getPhotoUrl = async (filename: string, subdirectory?: string): Promise<string | null> => {
  if (!appDirectoryHandle) {
    console.error('File storage not initialized');
    return null;
  }
  
  try {
    const parentDir = subdirectory 
      ? await appDirectoryHandle.getDirectoryHandle(subdirectory, { create: false }) 
      : appDirectoryHandle;
    
    const fileHandle = await parentDir.getFileHandle(filename, { create: false });
    const file = await fileHandle.getFile();
    
    return URL.createObjectURL(file);
  } catch (error) {
    console.error(`Error loading photo ${filename}:`, error);
    return null;
  }
};

/**
 * Convert base64 string to a blob
 */
export const base64ToBlob = (base64: string, mimeType: string = 'image/jpeg'): Blob => {
  const byteString = atob(base64.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  return new Blob([ab], { type: mimeType });
};

/**
 * Fallback to localStorage for browsers that don't support the File System Access API
 */
export const isFileSystemAPISupported = (): boolean => {
  return 'showDirectoryPicker' in window;
};

