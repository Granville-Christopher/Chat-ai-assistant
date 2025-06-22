# Gran AI Chat Assistant

Gran AI is a React-based chat assistant application that leverages Google's Gemini generative AI model to provide intelligent conversational responses. The app features a clean and responsive user interface styled with Tailwind CSS and supports rich markdown rendering in chat messages.

## Features

- Interactive chat interface with user and AI messages
- Integration with Google's Gemini generative AI model via the `@google/generative-ai` package
- Persistent chat history saved in browser localStorage
- Rich markdown support in messages using `react-markdown` and `remark-gfm`
- Responsive design with Tailwind CSS styling
- User-friendly input with loading indicators during AI response generation
- Offline support and caching via a registered service worker

## Technologies Used

- React 19
- Tailwind CSS
- Google Generative AI API (Gemini model)
- React Markdown with GitHub Flavored Markdown (GFM) support
- Axios for HTTP requests
- FontAwesome for icons
- dotenv for environment variable management
- Service Worker for offline caching

## Getting Started

### Prerequisites

- Node.js (v16 or later recommended)
- npm or yarn package manager
- Google Gemini API key

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd granai
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the project root and add your Gemini API key:

   ```env
   REACT_APP_CHAT_AI_GEMINI_API_KEY=your_api_key_here
   ```

### Running the App

Start the development server:

```bash
npm start
# or
yarn start
```

Open your browser and navigate to `http://localhost:3000` to use the chat assistant.

## Usage

- Type your message in the input box at the bottom.
- Press "Send" or hit Enter to submit your message.
- The AI will respond using the Gemini generative model.
- Chat history is saved locally and will persist across sessions.
- The app supports offline usage through a service worker that caches static assets.

## Project Structure

- `src/` - React source code
  - `components/` - React components including `ChatContainer` and `Message`
  - `App.js` - Main app component rendering the chat container
  - `index.js` - Entry point with service worker registration
- `public/` - Static assets, HTML template, and service worker script
- `tailwind.config.js` - Tailwind CSS configuration
- `.env` - Environment variables (not committed)

## Notes

- Ensure your Gemini API key has appropriate permissions and usage limits.
- The app handles common API errors such as rate limiting and access denial gracefully.
- Styling is done with Tailwind CSS; you can customize the theme in `tailwind.config.js`.
- The service worker enables offline caching but may require a page refresh after updates.

## License

This project is licensed under the MIT License.

---

Built with ❤️ using React and Google's Gemini AI.
