export const getRecommendedLanguage = (city) => {
  if (!city) return null;
  
  const recommendations = {
    'Pune': 'mr',
    'Mumbai': 'mr',
    'Nagpur': 'mr',
    'Nashik': 'mr',
    'Delhi': 'hi',
    'Bangalore': 'kn',
    'Hyderabad': 'te',
    'Chennai': 'ta',
    'Kolkata': 'bn',
    'Ahmedabad': 'gu',
    'Surat': 'gu',
    'Jaipur': 'hi',
    'Indore': 'hi',
    'Goa': 'kok'
  };

  return recommendations[city] || 'en';
};

export const SUPPORTED_LANGUAGES = [
  { code: 'en', nativeName: 'English', enName: 'English' },
  { code: 'hi', nativeName: 'हिन्दी', enName: 'Hindi' },
  { code: 'mr', nativeName: 'मराठी', enName: 'Marathi' },
  { code: 'gu', nativeName: 'ગુજરાતી', enName: 'Gujarati' },
  { code: 'kn', nativeName: 'ಕನ್ನಡ', enName: 'Kannada' },
  { code: 'te', nativeName: 'తెలుగు', enName: 'Telugu' },
  { code: 'ta', nativeName: 'தமிழ்', enName: 'Tamil' },
  { code: 'bn', nativeName: 'বাংলা', enName: 'Bengali' },
  { code: 'kok', nativeName: 'कोंकणी', enName: 'Konkani' }
];
