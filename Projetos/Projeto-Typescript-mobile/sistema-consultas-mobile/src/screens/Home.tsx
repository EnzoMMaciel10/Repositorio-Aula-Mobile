import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native";
import { Consulta } from "../interfaces/consulta";
import { ConsultaCard } from "../components";
import { styles } from "../styles/app.styles";
import {
  obterConsultas,
  obterPacienteLogado,
  removerPacienteLogado,
  salvarConsultas,
} from "../services/storage";

export default function Home({ navigation }: any) {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [nomePaciente, setNomePaciente] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      carregarDados();
    }, [])
  );

  async function carregarDados() {
    const paciente = await obterPacienteLogado();

    if (!paciente) {
      navigation.replace("Login");
      return;
    }

    setNomePaciente(paciente.nome);

    const todasConsultas = await obterConsultas();
    const consultasDoPaciente = todasConsultas.filter(
      (consulta) => consulta.paciente.id === paciente.id
    );

    setConsultas(consultasDoPaciente);
  }

  async function confirmarConsulta(consultaId: number) {
    const consultasAtualizadas = consultas.map((consulta) =>
      consulta.id === consultaId
        ? { ...consulta, status: "confirmada" as const }
        : consulta
    );

    setConsultas(consultasAtualizadas);

    const todasConsultas = await obterConsultas();
    const consultasAtualizadasCompletas = todasConsultas.map((consulta) =>
      consulta.id === consultaId
        ? { ...consulta, status: "confirmada" as const }
        : consulta
    );

    await salvarConsultas(consultasAtualizadasCompletas);
  }

  async function cancelarConsulta(consultaId: number) {
    const consultasAtualizadas = consultas.map((consulta) =>
      consulta.id === consultaId
        ? { ...consulta, status: "cancelada" as const }
        : consulta
    );

    setConsultas(consultasAtualizadas);

    const todasConsultas = await obterConsultas();
    const consultasAtualizadasCompletas = todasConsultas.map((consulta) =>
      consulta.id === consultaId
        ? { ...consulta, status: "cancelada" as const }
        : consulta
    );

    await salvarConsultas(consultasAtualizadasCompletas);
  }

  async function handleLogout() {
    Alert.alert("Sair", "Deseja realmente sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        onPress: async () => {
          await removerPacienteLogado();
          navigation.replace("Login");
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.titulo}>Olá, {nomePaciente}!</Text>
          <Text style={styles.subtitulo}>
            {consultas.length} consulta(s) agendada(s)
          </Text>
        </View>

        <View style={styles.homeActions}>
          <TouchableOpacity
            style={styles.agendarButton}
            onPress={() => navigation.navigate("Agendamento")}
          >
            <Text style={styles.agendarButtonText}>+ Agendar Nova Consulta</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Sair</Text>
          </TouchableOpacity>
        </View>

        {consultas.length === 0 ? (
          <View style={styles.emptyPatientBox}>
            <Text style={styles.emptyPatientTitle}>
              Você ainda não tem consultas agendadas
            </Text>
            <Text style={styles.emptyPatientSubtitle}>
              Toque em “Agendar Nova Consulta” para marcar sua primeira consulta.
            </Text>
          </View>
        ) : (
          consultas.map((consulta) => (
            <View key={consulta.id} style={styles.cardSpacing}>
              <ConsultaCard
                consulta={consulta}
                onConfirmar={() => confirmarConsulta(consulta.id)}
                onCancelar={() => cancelarConsulta(consulta.id)}
              />
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}