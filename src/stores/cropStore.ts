import { create } from 'zustand';

export interface Farm {
  id: string;
  name: string;
  size: number;
  soilType: 'clay' | 'loam' | 'sandy' | 'silt';
  currentCrops: string[];
  location: string;
  farmerId: string;
}

export interface SoilHealth {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  pH: number;
  organicMatter: number;
  lastUpdated: Date;
}

export interface WeatherData {
  day: string;
  condition: 'Sunny' | 'Rainy' | 'Cloudy' | 'Partly Cloudy';
  temperature: number;
  humidity: number;
  icon: string;
}

export interface CropRecommendation {
  id: string;
  type: 'rotation' | 'intercropping' | 'companion';
  currentCrop: string;
  recommendedCrop: string;
  reason: string;
  nextPlanting: string;
  urgency: 'low' | 'medium' | 'high';
  benefits: string[];
}

export interface CropRule {
  id: string;
  currentCrop: string;
  recommendedCrop: string;
  reason: string;
  condition: string;
  active: boolean;
}

export interface Farmer {
  id: string;
  name: string;
  farms: string[];
  phone: string;
  language: 'en' | 'hi' | 'ta';
}

interface CropStore {
  // Data
  farms: Farm[];
  farmers: Farmer[];
  soilData: Record<string, SoilHealth>;
  weatherData: WeatherData[];
  recommendations: CropRecommendation[];
  cropRules: CropRule[];
  currentUser: 'farmer' | 'admin';
  selectedFarm: string | null;

  // Actions
  setCurrentUser: (user: 'farmer' | 'admin') => void;
  setSelectedFarm: (farmId: string) => void;
  generateRecommendations: (farmId: string) => void;
  updateCropRule: (rule: CropRule) => void;
  addCropRule: (rule: Omit<CropRule, 'id'>) => void;
  deleteCropRule: (ruleId: string) => void;
  updateSoilData: (farmId: string) => void;
  generateWeatherData: () => void;
}

// Dummy data generators
const generateSoilData = (): SoilHealth => ({
  nitrogen: Math.floor(Math.random() * 100),
  phosphorus: Math.floor(Math.random() * 50),
  potassium: Math.floor(Math.random() * 50),
  pH: Number((Math.random() * 4 + 4).toFixed(1)),
  organicMatter: Number((Math.random() * 5 + 1).toFixed(1)),
  lastUpdated: new Date(),
});

const generateWeatherData = (): WeatherData[] => {
  const conditions: WeatherData['condition'][] = ['Sunny', 'Rainy', 'Cloudy', 'Partly Cloudy'];
  const icons = ['☀️', '🌧️', '☁️', '⛅'];
  const days = ['Today', 'Tomorrow', 'Wednesday', 'Thursday', 'Friday'];
  
  return days.map((day, index) => {
    const conditionIndex = Math.floor(Math.random() * conditions.length);
    return {
      day,
      condition: conditions[conditionIndex],
      temperature: Math.floor(Math.random() * 15 + 20),
      humidity: Math.floor(Math.random() * 40 + 40),
      icon: icons[conditionIndex],
    };
  });
};

const initialFarms: Farm[] = [
  {
    id: 'farm-1',
    name: 'Green Valley Farm',
    size: 5,
    soilType: 'clay',
    currentCrops: ['Rice', 'Wheat'],
    location: 'Punjab, India',
    farmerId: 'farmer-1',
  },
  {
    id: 'farm-2',
    name: 'Sunrise Acres',
    size: 3,
    soilType: 'loam',
    currentCrops: ['Tomatoes', 'Corn'],
    location: 'Maharashtra, India',
    farmerId: 'farmer-1',
  },
  {
    id: 'farm-3',
    name: 'Golden Fields',
    size: 8,
    soilType: 'sandy',
    currentCrops: ['Cotton', 'Sugarcane'],
    location: 'Gujarat, India',
    farmerId: 'farmer-2',
  },
];

const initialFarmers: Farmer[] = [
  {
    id: 'farmer-1',
    name: 'Raj Patel',
    farms: ['farm-1', 'farm-2'],
    phone: '+91 98765 43210',
    language: 'en',
  },
  {
    id: 'farmer-2',
    name: 'Priya Sharma',
    farms: ['farm-3'],
    phone: '+91 87654 32109',
    language: 'hi',
  },
];

const initialCropRules: CropRule[] = [
  {
    id: 'rule-1',
    currentCrop: 'Rice',
    recommendedCrop: 'Beans',
    reason: 'Nitrogen fixation',
    condition: 'nitrogen < 30',
    active: true,
  },
  {
    id: 'rule-2',
    currentCrop: 'Tomatoes',
    recommendedCrop: 'Spinach',
    reason: 'Pest cycle break',
    condition: 'always',
    active: true,
  },
  {
    id: 'rule-3',
    currentCrop: 'Corn',
    recommendedCrop: 'Beans',
    reason: 'Companion planting',
    condition: 'always',
    active: true,
  },
  {
    id: 'rule-4',
    currentCrop: 'Cotton',
    recommendedCrop: 'Mustard',
    reason: 'Soil health improvement',
    condition: 'pH > 7',
    active: true,
  },
];

export const useCropStore = create<CropStore>((set, get) => ({
  // Initial state
  farms: initialFarms,
  farmers: initialFarmers,
  soilData: Object.fromEntries(
    initialFarms.map(farm => [farm.id, generateSoilData()])
  ),
  weatherData: generateWeatherData(),
  recommendations: [],
  cropRules: initialCropRules,
  currentUser: 'farmer',
  selectedFarm: 'farm-1',

  // Actions
  setCurrentUser: (user) => set({ currentUser: user }),
  
  setSelectedFarm: (farmId) => set({ selectedFarm: farmId }),

  generateRecommendations: (farmId) => {
    const { farms, soilData, cropRules } = get();
    const farm = farms.find(f => f.id === farmId);
    const soil = soilData[farmId];
    
    if (!farm || !soil) return;

    const recommendations: CropRecommendation[] = [];
    
    farm.currentCrops.forEach(currentCrop => {
      const applicableRules = cropRules.filter(rule => 
        rule.active && rule.currentCrop === currentCrop
      );

      applicableRules.forEach(rule => {
        // Simple condition evaluation
        let shouldRecommend = false;
        if (rule.condition === 'always') {
          shouldRecommend = true;
        } else if (rule.condition.includes('nitrogen < 30')) {
          shouldRecommend = soil.nitrogen < 30;
        } else if (rule.condition.includes('pH > 7')) {
          shouldRecommend = soil.pH > 7;
        }

        if (shouldRecommend) {
          recommendations.push({
            id: `rec-${Date.now()}-${Math.random()}`,
            type: rule.reason.includes('companion') ? 'companion' : 
                  rule.reason.includes('fixation') ? 'rotation' : 'intercropping',
            currentCrop,
            recommendedCrop: rule.recommendedCrop,
            reason: rule.reason,
            nextPlanting: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000)
              .toLocaleDateString(),
            urgency: soil.nitrogen < 20 ? 'high' : soil.nitrogen < 40 ? 'medium' : 'low',
            benefits: [
              'Improves soil health',
              'Increases yield',
              'Reduces pest damage',
              'Enhances biodiversity'
            ].slice(0, Math.floor(Math.random() * 3) + 2),
          });
        }
      });
    });

    set({ recommendations });
  },

  updateCropRule: (rule) => {
    set(state => ({
      cropRules: state.cropRules.map(r => r.id === rule.id ? rule : r)
    }));
  },

  addCropRule: (rule) => {
    set(state => ({
      cropRules: [...state.cropRules, { ...rule, id: `rule-${Date.now()}` }]
    }));
  },

  deleteCropRule: (ruleId) => {
    set(state => ({
      cropRules: state.cropRules.filter(r => r.id !== ruleId)
    }));
  },

  updateSoilData: (farmId) => {
    set(state => ({
      soilData: {
        ...state.soilData,
        [farmId]: generateSoilData()
      }
    }));
  },

  generateWeatherData: () => {
    set({ weatherData: generateWeatherData() });
  },
}));