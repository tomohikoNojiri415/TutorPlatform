import { extractFileName } from "./extractFilename";

test("File name contains spaces", () => {
  const output = extractFileName(
    "https://firebasestorage.googleapis.com/v0/b/vc-tutor-management.appspot.com/o/qualifications%2F3900H19AveggieChicken%20Sprint%201%20Retrospective.pdf0f6d2c0a-2807-4f96-ad98-66db83f69539?alt=media&token=81474b26-a83b-4756-80a1-c78eae5b939a"
  );
  expect(output).toEqual(
    "qualifications/3900H19AveggieChicken Sprint 1 Retrospective.pdf0f6d2c0a-2807-4f96-ad98-66db83f69539"
  );
});
