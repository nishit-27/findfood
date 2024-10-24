import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Leaf, Drumstick, Carrot, AlertTriangle } from 'lucide-react';

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

interface ResultDisplayProps {
  result: {
    dish: string;
    nutrition: NutritionInfo;
    benefits: string[];
    category: string;
    avoidWhen: string[];
  };
  image: File;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, image }) => {
  const [showNutrition, setShowNutrition] = useState(false);
  const [showBenefits, setShowBenefits] = useState(false);
  const [showAvoidWhen, setShowAvoidWhen] = useState(false);
  const imageUrl = URL.createObjectURL(image);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'vegetarian':
        return <Leaf className="text-green-500" />;
      case 'non-vegetarian':
        return <Drumstick className="text-red-500" />;
      case 'vegan':
        return <Carrot className="text-orange-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="mt-6 sm:mt-8 space-y-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <img src={imageUrl} alt={result.dish} className="w-full h-48 sm:h-64 object-cover" />
        <div className="p-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{result.dish}</h2>
          <div className="mt-2 flex items-center">
            {getCategoryIcon(result.category)}
            <span className="ml-2 text-sm font-medium text-gray-600">{result.category}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setShowNutrition(!showNutrition)}
        >
          <h3 className="text-lg sm:text-xl font-bold text-gray-800">Nutrition Facts</h3>
          {showNutrition ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </div>
        {showNutrition && (
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-600">Serving Size: {result.nutrition.servingSize}</p>
            {Object.entries(result.nutrition).map(([key, value]) => {
              if (key !== 'servingSize' && value) {
                return (
                  <div key={key} className="flex justify-between items-center border-b border-gray-200 py-1">
                    <span className="text-gray-700 capitalize">{key}</span>
                    <span className="text-gray-900 font-medium">{value}</span>
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setShowBenefits(!showBenefits)}
        >
          <h3 className="text-lg sm:text-xl font-bold text-gray-800">Health Benefits</h3>
          {showBenefits ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </div>
        {showBenefits && (
          <ul className="mt-4 list-disc list-inside space-y-2">
            {result.benefits.map((benefit, index) => (
              <li key={index} className="text-gray-700">{benefit}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setShowAvoidWhen(!showAvoidWhen)}
        >
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center">
            <AlertTriangle className="text-yellow-500 mr-2" size={24} />
            When to Avoid
          </h3>
          {showAvoidWhen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </div>
        {showAvoidWhen && (
          <ul className="mt-4 list-disc list-inside space-y-2">
            {result.avoidWhen.map((situation, index) => (
              <li key={index} className="text-gray-700">{situation}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;