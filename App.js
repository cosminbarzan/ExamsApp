import { Provider } from 'react-redux';
import HomeScreen from './screens/HomeScreen';
import store from "./store/index";

import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import TeacherScreen from './screens/teacher/TeacherScreen';
import StudentScreen from './screens/student/StudentScreen';
import StatsScreen from './screens/stats/StatsScreen';
import AddExam from './screens/teacher/AddExam';
import ExamDetails from './screens/teacher/ExamDetails';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Teacher" component={TeacherScreen} />
          <Stack.Screen name="Student" component={StudentScreen} />
          <Stack.Screen name="Stats" component={StatsScreen} />
          <Stack.Screen name="AddExam" component={AddExam} />
          <Stack.Screen name="ExamDetails" component={ExamDetails} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
