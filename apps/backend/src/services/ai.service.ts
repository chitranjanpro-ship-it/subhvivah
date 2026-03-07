import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

export const analyzeChat = async (text: string) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/analyze/chat`, { text });
    return response.data;
  } catch (error) {
    console.error('AI Service Chat Analysis error:', error);
    return { score: 0, flags: [], is_safe: true };
  }
};

export const analyzeImage = async (imageUrl: string) => {
  try {
    // In production, you would send the image file or URL to the AI service
    // For now, we'll just mock the call
    const response = await axios.post(`${AI_SERVICE_URL}/analyze/image`, { imageUrl });
    return response.data;
  } catch (error) {
    console.error('AI Service Image Analysis error:', error);
    return { score: 0, flags: [], is_safe: true };
  }
};
