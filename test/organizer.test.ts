import { createFolder } from '../src/organizer'; // Adjust the import path as necessary

describe('Folder Creation', () => {
  test('should prevent redundant folder creation', () => {
    const folderName = 'test-folder';

    // Create the folder for the first time
    createFolder(folderName);

    // Attempt to create the same folder again
    expect(() => createFolder(folderName)).toThrow('Folder already exists');
  });
});

// Steps to run the test:
// 1. Ensure you have all dependencies installed by running `npm install`.
// 2. Run the test suite using `npm test`.