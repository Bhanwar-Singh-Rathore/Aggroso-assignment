# Meeting Action Items Tracker

A simple web application to extract action items, owners, and due dates from meeting transcripts using AI.

## Features

- **Transcript Processing**: Paste any meeting text to extract structured tasks.
- **Action Item Management**: Edit, delete, and mark items as done.
- **History**: Automatically saves the last 5 sessions locally.
- **Privacy-First**: "Bring Your Own Key" architecture. Data is stored in your browser's local storage.
- **Mock Mode**: Try the app without an API key using built-in mock data.

## Tech Stack

- **Frontend**: React (Vite)
- **Styling**: TailwindCSS (Glassmorphism design)
- **Icons**: Lucide React
- **Routing**: React Router DOM

## How to Run

1.  **Clone the repository**
2.  **Install dependencies**
    ```bash
    npm install
    ```
3.  **Start the development server**
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:5173](http://localhost:5173) in your browser.

## Configuration

To use the real AI extraction:

1.  Click the **Settings** (gear icon) in the top right.
2.  Enter your **OpenAI** or **Gemini** API Key.
3.  Select your provider and save.

_Note: If no key is provided, the app runs in Mock Mode, returning dummy data for demonstration._

## What is Done

- [x] Home Page
- [x] Transcript Input & Processing
- [x] Action Item List (Edit/Delete/Done)
- [x] History Sidebar
- [x] Settings (API Key Management)
- [x] System Status Page
- [x] Responsive Design

## What is Not Done

- [ ] Backend persistence (currently uses LocalStorage)
- [ ] User Authentication
- [ ] PDF/Audio file upload support
