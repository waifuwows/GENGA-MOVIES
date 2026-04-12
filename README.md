# GENGA MOVIES

**GENGA MOVIES** is a premium self-hosted media platform for aggregating metadata, exploring content, and controlling media playback. It provides a unified, cinematic interface for searching movies, series, anime, manga, and live radio.

---

## 🎯 Project Scope

### What this is
-   A **metadata aggregator** that pulls info from TMDB, Anilist, and GaanaPy.
-   A **playback controller** for direct streams and live broadcasts.
-   A **technical demonstration** of high-performance FastAPI and React integration.

### What this is not
-   A content hosting platform.
-   A video distribution service.
-   A commercial product.

---

## ✨ Key Features

### Navigation & UI
-   **Unified Sidebar**: Vertical navigation for switching between standard, anime, manga, radio, and news sources.
-   **Source Filtering**: Dedicated views for **Anime**, **Manga**, **Music**, **Radio**, and **News**.
-   **In-App News Reader**: Read full anime/manga articles directly within the app using a premium glassmorphic reader.
-   **Instant Back Navigation**: State-merging logic ensures posters and metadata persist when returning from the player or reader.
-   **Loading UI**: High-contrast global loading spinner with silent background updates.

### Playback & Customization
-   **Live Radio Player**: Background-capable radio streaming for globally sourced stations.
-   **Subtitle Selection**: Built-in subtitle menu with language selection and status toggle. Preferences persist in `localStorage`.
-   **Direct Video Download**: Download movies and series directly as `.mp4` files via high-speed proxying.
-   **Custom TV Channels**: Add your own IPTV (.m3u8) or YouTube Live streams directly to the TV section.
-   **HLS Proxying**: Advanced proxying of M3U8 segments for broad device compatibility.

---

## 📸 Section Screenshots

*Visual overview of the application components.*

| Section | Preview |
| :--- | :--- |
| **Home / Discovery** | ![Home Screen](screenshots/screenshot_home.png) |
| **Live TV** | ![Live TV Section](screenshots/Screenshot_Live%20TV.png) |
| **Anime (Anilist)** | ![Anime Section](screenshots/screenshot_anime.png) |
| **Manga (Scans)** | ![Manga Section](screenshots/screenshot_manga_v2.png) |
| **Music (GaanaPy)** | ![Music Section](screenshots/screenshot_music_v2.png) |
| **Radio (Global)** | ![Radio Section](screenshots/screenshot_radio.png) |
| **News (ANN Feed)** | ![News Section](screenshots/screenshot_news_v2.png) |

---

## 📺 Premium Media Experience

*Feature-rich playback and reading with subtitles, episode management, and immersive readers.*

| Feature | Screenshot |
| :--- | :--- |
| **Anime Player** | ![Anime Player](screenshots/player_frieren.png) |
| **Home Player** | ![Home Player](screenshots/player_naruto.png) |
| **Live TV Player** | ![Live TV Player](screenshots/player_live%20tv.png) |
| **Radio Player** | ![Radio Player](screenshots/player_radio.png) |
| **Manga Reader** | ![Manga Reader](screenshots/reader_manga.png) |
| **News Reader** | ![News Reader](screenshots/reader_news.png) |
| **Music Player** | ![Music Player](screenshots/player_music.png) |

---

## 🧰 Tech Stack

**Backend**
-   **FastAPI**: Async Python web framework.
-   **HTTPX**: Asynchronous HTTP client.
-   **Uvicorn**: ASGI server implementation.

**Frontend**
-   **React 18**: Frontend library.
-   **Vite**: Build tool and dev server.
-   **Vanilla CSS**: Pure CSS with modern flex/grid layouts.

---

## 🧠 Architecture & Workflows

### 1. Home (Library)
*High-quality metadata and direct HTTP streaming.*
-   **How it works**: Combines metadata from official sources with direct stream links.
-   **Stream Button**: Resolves the direct media link and plays it in the integrated player.
-   **Download Button**: Routes the request through the **Backend Download Proxy** (`/api/proxy/download`). This creates a tunnel, allowing you to download files even if the host blocks direct browser downloads.
-   **Hybrid Routing**:
    -   **Local Mode**: Frontend talks to your running `localhost:8080` server.
    -   **Cloud Mode**: Discovery sections connect to the production Render instance.

### 2. Anilist (Anime)
*Advanced Anime tracker and tracker integration.*
-   **How it works**: Fetches real-time data from Anilist GraphQL API.
-   **Stream Button**: Loads a protected embed player for maximum reliability and stability.

---

## 🚀 Getting Started

1.  **Backend Setup**:
    ```powershell
    cd backend
    pip install -r requirements.txt
    python main.py
    ```
2.  **Frontend Setup**:
    ```powershell
    cd frontend
    npm install
    npm run dev
    ```

---

*GENGA MOVIES is for educational and technical demonstration purposes only.*
