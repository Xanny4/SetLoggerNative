// types.ts

export type RootStackParamList = {
  Login: undefined;
  MainApp: undefined;
  AddSet: undefined;
  SignUp: undefined;
  Exercises: undefined;
  YourSets: { exerciseId:string };
  // Add other screen names and their parameters if needed
};

export interface Exercise {
  _id: string;
  name: string;
  imageURL: string;
}
