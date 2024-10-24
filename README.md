# Dish Identifier and Nutrition App

This project is a web application that identifies dishes from images and provides nutritional information using the Google Gemini AI API.

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/your-username/dish-identifier-app.git
   cd dish-identifier-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Copy the `.env.example` file to a new file named `.env`:
     ```
     cp .env.example .env
     ```
   - Open the `.env` file and replace `your_gemini_api_key_here` with your actual Google Gemini API key.

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173` (or the URL provided in the console).

## Building for Production

To build the app for production, run:

```
npm run build
```

This will generate a `dist` folder with the production-ready files.

## Security Notes

- Never commit your `.env` file or expose your API key in the code.
- The `.gitignore` file is set up to exclude the `.env` file from version control.
- Always use environment variables for sensitive information like API keys.

## License

[MIT License](LICENSE)