import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  Home,
  Admin,
  CadastroPaciente,
  Agendamento,
} from "./src/screens";
import { inicializarDados } from "./src/services/storage";

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    inicializarDados();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: "#79059C" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen
          name="Login"
          component={CadastroPaciente}
          options={{ title: "Entrar / Cadastrar", headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: "Minhas Consultas" }}
        />
        <Stack.Screen
          name="Agendamento"
          component={Agendamento}
          options={{ title: "Agendar Consulta" }}
        />
        <Stack.Screen
          name="Admin"
          component={Admin}
          options={{ title: "Painel Administrativo" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}