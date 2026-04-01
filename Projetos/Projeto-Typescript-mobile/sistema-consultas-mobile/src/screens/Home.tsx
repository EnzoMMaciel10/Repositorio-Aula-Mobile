import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Button } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Consulta } from "../interfaces/consulta";
import { ConsultaCard } from "../components";
import { styles } from "../styles/app.styles";
import { obterConsultas, salvarConsultas } from "../services/storage";

export default function Home({ navigation }: any) {
  const [consultas, setConsultas] = useState<Consulta[]>([]);

  useEffect(() => {
    const unsubscribe = navigation?.addListener?.("focus", () => {
      carregarConsultas();
    });

    carregarConsultas();

    return unsubscribe;
  }, [navigation]);

  async function carregarConsultas() {
    const consultasSalvas = await obterConsultas();
    setConsultas(consultasSalvas);
  }

  async function confirmarConsulta(consultaId: number) {
    const consultasAtualizadas = consultas.map((consulta) =>
      consulta.id === consultaId
        ? { ...consulta, status: "confirmada" as const }
        : consulta
    );

    setConsultas(consultasAtualizadas);
    await salvarConsultas(consultasAtualizadas);
  }

  async function cancelarConsulta(consultaId: number) {
    const consultasAtualizadas = consultas.map((consulta) =>
      consulta.id === consultaId
        ? { ...consulta, status: "cancelada" as const }
        : consulta
    );

    setConsultas(consultasAtualizadas);
    await salvarConsultas(consultasAtualizadas);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.titulo}>Minhas Consultas</Text>
          <Text style={styles.subtitulo}>
            {consultas.length} consulta(s) cadastrada(s)
          </Text>
        </View>

        {consultas.length === 0 ? (
          <View style={styles.estadoVazio}>
            <Text style={styles.estadoVazioTexto}>
              Nenhuma consulta agendada ainda.
            </Text>

            <Button
              title="Ir para Admin"
              onPress={() => navigation.navigate("Admin")}
            />
          </View>
        ) : (
          <>
            <View style={styles.adminButtonContainer}>
              <Button
                title="Abrir Admin"
                onPress={() => navigation.navigate("Admin")}
              />
            </View>

            {consultas.map((consulta) => (
              <View key={consulta.id} style={styles.cardSpacing}>
                <ConsultaCard
                  consulta={consulta}
                  onConfirmar={() => confirmarConsulta(consulta.id)}
                  onCancelar={() => cancelarConsulta(consulta.id)}
                />
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}