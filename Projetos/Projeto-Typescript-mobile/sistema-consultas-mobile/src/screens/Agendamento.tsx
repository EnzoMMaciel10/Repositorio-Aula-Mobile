import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Especialidade } from "../types/especialidade";
import { Medico } from "../interfaces/medico";
import { Consulta } from "../interfaces/consulta";
import {
  obterConsultas,
  obterEspecialidades,
  obterMedicos,
  obterPacienteLogado,
  salvarConsultas,
} from "../services/storage";

export default function Agendamento({ navigation }: any) {
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [medicosFiltrados, setMedicosFiltrados] = useState<Medico[]>([]);
  const [especialidadeSelecionada, setEspecialidadeSelecionada] =
    useState<Especialidade | null>(null);
  const [medicoSelecionado, setMedicoSelecionado] = useState<Medico | null>(
    null
  );
  const [dataConsulta, setDataConsulta] = useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    const esps = await obterEspecialidades();
    const meds = await obterMedicos();

    setEspecialidades(esps);
    setMedicos(meds);
  }

  function selecionarEspecialidade(esp: Especialidade) {
    setEspecialidadeSelecionada(esp);
    setMedicoSelecionado(null);

    const medicosEsp = medicos.filter(
      (medico) => medico.especialidade.id === esp.id
    );

    setMedicosFiltrados(medicosEsp);
  }

  async function agendarConsulta() {
    if (!especialidadeSelecionada) {
      Alert.alert("Atenção", "Selecione uma especialidade");
      return;
    }

    if (!medicoSelecionado) {
      Alert.alert("Atenção", "Selecione um médico");
      return;
    }

    if (!dataConsulta) {
      Alert.alert("Atenção", "Informe a data da consulta");
      return;
    }

    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dataConsulta)) {
      Alert.alert("Erro", "Use o formato DD/MM/AAAA para a data");
      return;
    }

    try {
      const paciente = await obterPacienteLogado();

      if (!paciente) {
        Alert.alert("Erro", "Você precisa estar logado para agendar");
        navigation.replace("Login");
        return;
      }

      const [dia, mes, ano] = dataConsulta.split("/");
      const data = new Date(Number(ano), Number(mes) - 1, Number(dia));

      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      if (data < hoje) {
        Alert.alert("Erro", "Não é possível agendar consultas no passado");
        return;
      }

      const novaConsulta: Consulta = {
        id: Date.now(),
        medico: medicoSelecionado,
        paciente,
        data,
        valor: 350,
        status: "agendada",
        observacoes: "Consulta agendada via app",
      };

      const consultas = await obterConsultas();
      await salvarConsultas([...consultas, novaConsulta]);

      Alert.alert(
        "Sucesso!",
        `Consulta agendada com ${medicoSelecionado.nome} para ${dataConsulta}`,
        [
          {
            text: "Ver minhas consultas",
            onPress: () => navigation.navigate("Home"),
          },
        ]
      );

      setEspecialidadeSelecionada(null);
      setMedicoSelecionado(null);
      setDataConsulta("");
      setMedicosFiltrados([]);
    } catch (erro) {
      console.error("Erro ao agendar:", erro);
      Alert.alert("Erro", "Não foi possível agendar a consulta");
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.titulo}>Escolha a especialidade</Text>

        {especialidades.map((esp) => (
          <TouchableOpacity
            key={esp.id}
            style={[
              styles.cardOpcao,
              especialidadeSelecionada?.id === esp.id && styles.cardSelecionado,
            ]}
            onPress={() => selecionarEspecialidade(esp)}
          >
            <Text style={styles.cardTitulo}>{esp.nome}</Text>
            <Text style={styles.cardDescricao}>{esp.descricao}</Text>
          </TouchableOpacity>
        ))}

        {especialidadeSelecionada && (
          <>
            <Text style={styles.titulo}>Escolha o médico</Text>

            {medicosFiltrados.map((medico) => (
              <TouchableOpacity
                key={medico.id}
                style={[
                  styles.cardOpcao,
                  medicoSelecionado?.id === medico.id && styles.cardSelecionado,
                ]}
                onPress={() => setMedicoSelecionado(medico)}
              >
                <Text style={styles.cardTitulo}>{medico.nome}</Text>
                <Text style={styles.cardDescricao}>{medico.crm}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}

        {medicoSelecionado && (
          <>
            <Text style={styles.titulo}>Informe a data da consulta</Text>

            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              value={dataConsulta}
              onChangeText={setDataConsulta}
              keyboardType="numeric"
              maxLength={10}
            />

            <TouchableOpacity style={styles.botao} onPress={agendarConsulta}>
              <Text style={styles.botaoTexto}>Confirmar Agendamento</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#79059C",
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
    marginTop: 12,
  },
  cardOpcao: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  cardSelecionado: {
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  cardTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  cardDescricao: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  botao: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  botaoTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});