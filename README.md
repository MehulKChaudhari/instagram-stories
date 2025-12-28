# Instagram Stories Clone

A React-based Instagram Stories viewer with smooth animations, auto next functionality, and seamless user-to-user transitions.

## About Project

This project is an Instagram Stories clone that replicates the core functionality of viewing stories with:
- **Smooth slide animations** between stories using Framer Motion
- **Auto-next** stories after 5 seconds
- **Click navigation** - left/right clicks to navigate between stories
- **User-to-user transitions** - seamless flow when moving between different users' stories
- **Progress bars** showing viewing progress for each story
- **Viewed/unviewed states** - visual indicators for stories that have been viewed
- **Image preloading** to prevent loading flickers
- **Horizontal scrollable story list** with user avatars

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Framer Motion** - Animation library for smooth transitions
- **CSS3** - Styling with modern CSS features

## How to Run Locally

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Start development server:**
   ```bash
   pnpm dev
   ```

3. **Build for production:**
   ```bash
   pnpm build
   ```

4. **Preview production build:**
   ```bash
   pnpm preview
   ```

## Folder Structure

```
instagram-stories/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   ├── StoryList.jsx       # Story list component
│   │   ├── StoryList.css       # Story list styles
│   │   ├── StoryViewer.jsx     # Story viewer component
│   │   └── StoryViewer.css     # Story viewer styles
│   ├── data/
│   │   └── stories.js          # Sample stories data
│   ├── pages/
│   │   ├── Home.jsx            # Main page component
│   │   └── Home.css            # Home page styles
│   ├── App.jsx                 # Root component
│   ├── App.css                 # Global app styles
│   ├── index.css               # Base styles
│   └── main.jsx                # Entry point
├── eslint.config.js            # ESLint configuration
├── index.html                  # HTML template
├── package.json                # Dependencies and scripts
├── pnpm-lock.yaml              # Lock file
├── vite.config.js              # Vite configuration
└── README.md                   # Project documentation
```
