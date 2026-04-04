try {
  letters = JSON.parse(localStorage.getItem(STORAGE_KEYS.LETTERS) || '[]');
  if (!Array.isArray(letters)) {
    letters = [];
  }
} catch (e) {
  letters = [];
}
