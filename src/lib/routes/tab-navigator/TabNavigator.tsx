// src/lib/routes/Tabs.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomTabBar from '../../../components/custom-bottom-bar/CustomTabBar';
import HistoryScreen from '../../../screens/history/HistoryScreen';
import HomeScreen from '../../../screens/home/HomeScreen';
import ProfileScreen from '../../../screens/profile/ProfileScreen';
import AddFoodScreen from '../../../screens/add-food/AddFoodScreen';
import SettingsScreen from '../../../screens/settings/SettingsScreen';
import FoodDetailsScreen from '../../../screens/meal-details/FoodDetailsScreen';
import { FoodItem } from '../../../data/food/FoodItem';
import { MealType } from '../../../data/meals/MealType';
import InsightsScreen from '../../../screens/insights/InsightsScreen';
import RecipesScreen from '../../../screens/recipes/RecipesScreen';

export type RootTabParamList = {
  Home: undefined;
  Recipes: undefined;
  History: undefined;
  Insights: undefined;
  Profile: undefined;
  AddFood: undefined;
  Settings: undefined;
  FoodDetails: { item: FoodItem; mealTypeName: MealType };
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="Recipes"
        component={RecipesScreen}
        options={{ title: 'Recipes' }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: 'History' }}
      />

      <Tab.Screen
        name="Insights"
        component={InsightsScreen}
        options={{ title: 'Insights' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <Tab.Screen name="AddFood" component={AddFoodScreen} />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Profile' }}
      />
      <Tab.Screen
        name="FoodDetails"
        component={FoodDetailsScreen}
        options={{ title: 'Food Details' }}
      />

      {/* <Tab.Screen
        name="Onboarding"
        component={OnboardingStack}
        options={{ headerShown: false }}
      /> */}
    </Tab.Navigator>
  );
};

export default Tabs;
