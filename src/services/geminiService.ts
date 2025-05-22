import { GoogleGenerativeAI } from "@google/generative-ai";

// Fetch API key from environment variable
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("VITE_GEMINI_API_KEY is not set in the environment variables");
}

const genAI = new GoogleGenerativeAI(API_KEY);

interface NutritionInfo {
  servingSize: string;
  calories: string;
  protein: string;
  carbohydrates: string;
  fat: string;
  fiber: string;
  sugar: string;
  minerals: string;
}

interface FoodInfo {
  dish: string;
  nutrition: NutritionInfo;
  benefits: string[];
  category: string;
  avoidWhen: string[];
}

export async function identifyDishAndNutrition(imageFile: File): Promise<FoodInfo> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const imageData = await fileToGenerativePart(imageFile);
    const prompt = `Identify the dish in this image and provide the following information:
    1. Nutrition information for the serving size shown in the image:
      - Serving size (provide precise measurements in both standard units like cup, tablespoon, piece, slice, etc., AND their exact equivalents in grams or milliliters. Be as specific as possible to the dish.)
      - Calories
      - Protein
      - Carbohydrates
      - Fat
      - Fiber
      - Sugar
      - Minerals (name and amount)
    2. Five health benefits of this food item
    3. The category of the food (Vegetarian, Non-vegetarian, or Vegan)
    4. Three situations or conditions when one should avoid eating this dish
    
    Format the response as follows:
    Dish: [Name of the dish]
    Serving Size: [value]
    Calories: [value]
    Protein: [value]
    Carbohydrates: [value]
    Fat: [value]
    Fiber: [value]
    Sugar: [value]
    Minerals: [list of minerals with amounts]
    Benefits:
    - [Benefit 1]
    - [Benefit 2]
    - [Benefit 3]
    - [Benefit 4]
    - [Benefit 5]
    Category: [Vegetarian/Non-vegetarian/Vegan]
    Avoid When:
    - [Situation 1]
    - [Situation 2]
    - [Situation 3]`;

    const result = await model.generateContent([prompt, imageData]);
    const response = await result.response;
    const text = response.text();

    return parseNutritionInfo(text);
  } catch (error) {
    console.error("Error in identifyDishAndNutrition:", error);
    throw new Error("Failed to identify dish and nutrition. Please try again.");
  }
}

function stripMarkdown(text: string): string {
  // Remove **bold**, __underline__, *italic*, _italic_, and backticks
  return text.replace(/\*\*([^*]+)\*\*/g, '$1')
             .replace(/__([^_]+)__/g, '$1')
             .replace(/\*([^*]+)\*/g, '$1')
             .replace(/_([^_]+)_/g, '$1')
             .replace(/`([^`]+)`/g, '$1')
             .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // [text](link)
             .replace(/\*/g, '') // Remove stray *
             .replace(/_/g, '') // Remove stray _
             .trim();
}

function parseNutritionInfo(text: string): FoodInfo {
  const lines = text.split('\n');
  const dish = stripMarkdown(lines[0].split(':')[1]?.trim() || '');
  const nutrition: NutritionInfo = {
    servingSize: '',
    calories: '',
    protein: '',
    carbohydrates: '',
    fat: '',
    fiber: '',
    sugar: '',
    minerals: '',
  };
  let benefits: string[] = [];
  let category = '';
  let avoidWhen: string[] = [];

  let currentSection = '';
  lines.slice(1).forEach(line => {
    if (line.startsWith('Benefits:')) {
      currentSection = 'benefits';
    } else if (line.startsWith('Category:')) {
      category = stripMarkdown(line.split(':')[1]?.trim() || '');
    } else if (line.startsWith('Avoid When:')) {
      currentSection = 'avoidWhen';
    } else if (currentSection === 'benefits' && line.trim().startsWith('-')) {
      benefits.push(stripMarkdown(line.trim().substring(1).trim()));
    } else if (currentSection === 'avoidWhen' && line.trim().startsWith('-')) {
      avoidWhen.push(stripMarkdown(line.trim().substring(1).trim()));
    } else {
      const [key, value] = line.split(':').map(item => item.trim());
      if (!key) return;
      switch (key.toLowerCase()) {
        case 'serving size':
          nutrition.servingSize = stripMarkdown(value || '');
          break;
        case 'calories':
          // Extract the first number from the value, ignoring units or extra text
          if (value) {
            const match = value.match(/([0-9]+(\.[0-9]+)?)/);
            nutrition.calories = match ? match[1] : '';
            nutrition.calories = stripMarkdown(nutrition.calories);
            console.log('Parsed calories:', nutrition.calories, 'from value:', value);
          } else {
            nutrition.calories = '';
          }
          break;
        case 'protein':
          nutrition.protein = stripMarkdown(value || '');
          break;
        case 'carbohydrates':
          nutrition.carbohydrates = stripMarkdown(value || '');
          break;
        case 'fat':
          nutrition.fat = stripMarkdown(value || '');
          break;
        case 'fiber':
          nutrition.fiber = stripMarkdown(value || '');
          break;
        case 'sugar':
          nutrition.sugar = stripMarkdown(value || '');
          break;
        case 'minerals':
          nutrition.minerals = stripMarkdown(value || '');
          break;
      }
    }
  });

  return { dish, nutrition, benefits, category, avoidWhen };
}

async function fileToGenerativePart(file: File) {
  try {
    const base64EncodedDataPromise = new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const base64EncodedData = await base64EncodedDataPromise;
    const mimeType = base64EncodedData.split(';')[0].split(':')[1];

    return {
      inlineData: {
        data: base64EncodedData.split(',')[1],
        mimeType
      },
    };
  } catch (error) {
    console.error("Error in fileToGenerativePart:", error);
    throw new Error("Failed to process the image. Please try again with a different image.");
  }
}