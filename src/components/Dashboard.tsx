import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, LogOut, Utensils, Edit, List, Trash2, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import ImageUploader from './ImageUploader';
import ResultDisplay from './ResultDisplay';
import { identifyDishAndNutrition } from '../services/geminiService';
import CalorieProgress from './CalorieProgress';

interface FoodItem {
  _id: string;
  name: string;
  calories: number;
  timestamp: string;
  quantity: number; // Add quantity to the interface
}

const Dashboard = () => {
  const [image, setImage] = useState<File | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [calorieIntake, setCalorieIntake] = useState(0);
  const [calorieGoal, setCalorieGoal] = useState(2000);

  const [notification, setNotification] = useState<string | null>(null);
  const [editGoal, setEditGoal] = useState(false);
  const [newGoal, setNewGoal] = useState(calorieGoal);

  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);

  const [quantity, setQuantity] = useState<number>(1); // New state for quantity

  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [isFoodHistoryExpanded, setIsFoodHistoryExpanded] = useState(true);

  const toggleItemExpansion = (itemId: string) => {
    setExpandedItems(prevExpanded => {
      const newExpanded = new Set(prevExpanded);
      if (newExpanded.has(itemId)) {
        newExpanded.delete(itemId);
      } else {
        newExpanded.add(itemId);
      }
      return newExpanded;
    });
  };

  const toggleFoodHistoryExpansion = () => {
    setIsFoodHistoryExpanded(!isFoodHistoryExpanded);
  };

  useEffect(() => {
    fetchCalorieData();
  }, []);

  const fetchCalorieData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/calorie-intake`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setCalorieIntake(data.calories);
        setCalorieGoal(data.goal); // Ensure the goal is set from the backend
        setFoodItems(data.foodItems);
      } else {
        console.error('Failed to fetch calorie data:', data.error);
      }
    } catch (error) {
      console.error('Error fetching calorie data:', error);
    }
  };

  const handleImageUpload = async (file: File) => {
    setImage(file);
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const identificationResult = await identifyDishAndNutrition(file);
      setResult(identificationResult);
    } catch (error) {
      console.error('Error identifying dish:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleEatenClick = async () => {
    setResult(null);
    if (result) {
      const caloriesPerServing = parseInt(result.nutrition.calories);
      const totalCalories = Math.round(caloriesPerServing * quantity);
      const timestamp = new Date().toISOString();
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/add-calories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ 
            calories: totalCalories, 
            foodName: result.dish, 
            timestamp, 
            quantity 
          }),
        });
        if (response.ok) {
          setNotification(`Great job! You've added ${result.dish} (${totalCalories} calories) to your food diary.`);
          setTimeout(() => setNotification(null), 5000);
          await fetchCalorieData();
          setQuantity(1); // Reset quantity to default value
          setImage(null); // Clear the image 
        } else {
          console.error('Failed to add calories');
          setNotification('Oops! We couldn\'t add your food. Please try again.');
          setTimeout(() => setNotification(null), 5000);
        }
      } catch (error) {
        console.error('Error adding calories:', error);
        setNotification('Something went wrong. Please check your connection and try again.');
        setTimeout(() => setNotification(null), 5000);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleEditGoalClick = () => {
    setNewGoal(calorieGoal); // Update newGoal with the current calorieGoal
    setEditGoal(true);
  };

  const handleGoalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewGoal(parseInt(event.target.value));
  };

  const handleGoalSubmit = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/update-calorie-goal`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ goal: newGoal }),
      });

      if (response.ok) {
        setCalorieGoal(newGoal); // Update the state with the new goal
        setEditGoal(false);
        setNotification('Calorie goal updated successfully');
        setTimeout(() => setNotification(null), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update calorie goal');
      }
    } catch (error) {
      console.error('Error updating calorie goal:', error);
      setError('An unexpected error occurred');
    }
  };

  const handleDeleteFoodItem = async (itemId: string, calories: number, foodName: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/delete-food-item`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ itemId }),
      });

      if (response.ok) {
        const data = await response.json();
        setNotification(`${foodName} (${data.removedCalories} calories) has been removed from your food diary.`);
        setTimeout(() => setNotification(null), 5000);
        // Refresh the calorie data after deleting an item
        await fetchCalorieData();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete food item');
        setNotification('We couldn\'t remove that food item. Please try again.');
        setTimeout(() => setNotification(null), 5000);
      }
    } catch (error) {
      console.error('Error deleting food item:', error);
      setError('An unexpected error occurred');
      setNotification('Something went wrong while removing the food item. Please try again later.');
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gray-50">
      <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold text-indigo-700">Calorie Tracker</h1>
        <button
          onClick={handleLogout}
          className="bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline flex items-center transition-colors duration-300"
        >
          <LogOut className="mr-2" size={20} />
          Logout
        </button>
      </header>

      <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-indigo-600">Daily Progress</h2>
          {editGoal ? (
            <div className="flex items-center">
              <input
                type="number"
                value={newGoal}
                onChange={handleGoalChange}
                className="border rounded-l px-3 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <button
                onClick={handleGoalSubmit}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-r transition-colors duration-300"
              >
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={handleEditGoalClick}
              className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold py-2 px-4 rounded-full flex items-center transition-colors duration-300"
            >
              <Edit className="mr-2" size={16} />
              Edit Goal
            </button>
          )}
        </div>
        <CalorieProgress intake={calorieIntake} goal={calorieGoal} />
      </div>

      <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Add Food</h2>
        <ImageUploader onImageUpload={handleImageUpload} />

        {loading && (
          <div className="mt-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-2 text-indigo-600">Analyzing your dish...</p>
          </div>
        )}
        {error && (
          <div className="mt-6 text-center text-red-600">
            <p>{error}</p>
          </div>
        )}
        {result && image && (
          <div className="mt-6">
            <ResultDisplay result={result} image={image} />
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Enter the amount you have eaten
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value))}
                className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300"
                min="0.1"
                step="0.1"
                placeholder="e.g., 1.5 for one and a half servings"
              />
              <p className="text-xs text-gray-500 mt-1">
                Please specify the number of servings you consumed. For example, enter 1.5 for one and a half servings.
              </p>
            </div>
            <button
              onClick={handleEatenClick}
              className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors duration-300"
            >
              <Utensils className="mr-2" size={20} />
              I've Eaten This
            </button>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div 
          className="flex justify-between items-center mb-4 cursor-pointer" 
          onClick={toggleFoodHistoryExpansion}
        >
          <h2 className="text-2xl font-semibold text-indigo-600">Today's Food History</h2>
          <div className="flex items-center">
            {isFoodHistoryExpanded ? (
              <ChevronUp size={24} className="text-indigo-500" />
            ) : (
              <ChevronDown size={24} className="text-indigo-500" />
            )}
          </div>
        </div>
        {isFoodHistoryExpanded && (
          foodItems.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {foodItems.map((item) => (
                <li key={item._id} className="py-4">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleItemExpansion(item._id)}
                  >
                    <div className="flex items-center">
                      <span className="text-gray-800 font-medium">{item.name}</span>
                      <span className="ml-2 text-sm text-gray-500">({item.calories} calories)</span>
                    </div>
                    <div className="flex items-center">
                      {expandedItems.has(item._id) ? (
                        <ChevronUp size={20} className="text-indigo-500" />
                      ) : (
                        <ChevronDown size={20} className="text-indigo-500" />
                      )}
                    </div>
                  </div>
                  {expandedItems.has(item._id) && (
                    <div className="mt-2 pl-4">
                      <div className="text-sm text-gray-600 flex items-center">
                        <Clock size={14} className="mr-1" />
                        {formatTime(item.timestamp)}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Amount: {item.quantity} {item.quantity === 1 ? 'serving' : 'servings'}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFoodItem(item._id, item.calories, item.name);
                        }}
                        className="mt-2 text-red-500 hover:text-red-700 transition-colors text-sm flex items-center"
                      >
                        <Trash2 size={14} className="mr-1" />
                        Remove
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No food items recorded today.</p>
          )
        )}
      </div>

      {notification && (
        <div className="fixed bottom-4 right-4 bg-green-100 text-green-800 px-6 py-3 rounded-lg shadow-lg">
          {notification}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
