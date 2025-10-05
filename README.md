# 🧹 Mac Organizer (Bun Edition)

A **Bun-powered CLI** for organizing files and folders on your Mac.  
Automatically groups files by type, handles duplicates intelligently, and logs every move for easy undo.

---

## 🚀 Features
- Categorizes files (`images`, `videos`, `docs`, etc.)
- Keeps **newer files** and renames older duplicates (e.g., `report_2025-09-12_1430.pdf`)
- Supports **dry-run**
- Maintains **undo logs**

---

## 🧰 Requirements
- [Bun](https://bun.sh) v1.1.0 or later  
  (Install via: `curl -fsSL https://bun.sh/install | bash`)

---

## ⚙️ Installation
```bash
git clone <your-repo-url>
cd mac-organizer
bun install

<!-- # 🧹 Mac Organizer

A simple **Node.js CLI tool** for organizing files and folders on your Mac.  
Automatically groups files by type, handles duplicates intelligently, and logs every move for easy undo.

---

## 🚀 Features
- Organizes files by category (`images`, `videos`, `docs`, etc.)
- Resolves duplicate file names:
  - Keeps the **newer** file
  - Renames the **older** one with a timestamp (e.g., `report_2025-09-12_1430.pdf`)
- Supports **dry-run** mode
- Maintains **logs** for easy undo

---

## 🧰 Installation

```bash
git clone <your-repo-url>
cd mac-organizer
npm install
```

---

## 🧩 Usage

### 1. Run the organizer
```bash
bun organize -p ~/Downloads
```

### 2. Preview without moving files
```bash
bun dry-run -p ~/Downloads
```

### 3. Undo the last organization
```bash
bun undo-organize
```

---

## 🧱 Build and Run

```bash
npm run build
node dist/index.js run -p ~/Downloads
```

---

## 🪄 Project Structure
```
mac-organizer/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts
│   ├── organizer.ts
│   ├── undo.ts
│   ├── logger.ts
│   └── config.json
└── logs/
```

---

## 🧠 Notes
- Tested on **macOS Sonoma** and **Node.js 20+**
- Safe to use — files are logged for undo recovery
- Future: AI-assisted categorization & duplicate detection

---

Made with ❤️ using Node + TypeScript -->


