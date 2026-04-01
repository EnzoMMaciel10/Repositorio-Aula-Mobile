import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  obterEspecialidades,
  obterMedicos,
  salvarEspecialidades,
  salvarMedicos,
  obterConsultas,
  salvarConsultas,
} from "../services/storage";
import { Especialidade } from "../types/especialidade";
import { Medico } from "../interfaces/medico";
import { Paciente } from "../types/paciente";
import { Consulta } from "../interfaces/consulta";

export default function Admin({ navigation }: any) {
  const [nomeEsp, setNomeEsp] = useState("");
  const [descEsp, setDescEsp] = useState("");
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);

  const [nomeMed, setNomeMed] = useState("");
  const [crmMed, setCrmMed] = useState("");
  const [medicos, setMedicos] = useState<Medico[]>([]);

  const [nomePac, setNomePac] = useState("");
  const [dataConsulta, setDataConsulta] = useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    const especialidadesSalvas = await obterEspecialidades();
    const medicosSalvos = await obterMedicos();

    setEspecialidades(especialidadesSalvas);
    setMedicos(medicosSalvos);
  }

  async function adicionarEspecialidade() {
    if (!nomeEsp.trim() || !descEsp.trim()) {
      Alert.alert("Erro", "Preencha nome e descrição da especialidade.");
      return;
    }

    const novaEspecialidade: Especialidade = {
      id: especialidades.length + 1,
      nome: nomeEsp,
      descricao: descEsp,
    };

    const listaAtualizada = [...especialidades, novaEspecialidade];
    setEspecialidades(listaAtualizada);
    await salvarEspecialidades(listaAtualizada);

    setNomeEsp("");
    setDescEsp("");

    Alert.alert("Sucesso", "Especialidade adicionada.");
  }

  async function adicionarMedico() {
    if (!nomeMed.trim() || !crmMed.trim()) {
      Alert.alert("Erro", "Preencha nome e CRM do médico.");
      return;
    }

    if (especialidades.length === 0) {
      Alert.alert("Erro", "Cadastre uma especialidade antes do médico.");
      return;
    }

    const novoMedico: Medico = {
      id: medicos.length + 1,
      nome: nomeMed,
      crm: crmMed,
      especialidade: especialidades[0],
      ativo: true,
    };

    const listaAtualizada = [...medicos, novoMedico];
    setMedicos(listaAtualizada);
    await salvarMedicos(listaAtualizada);

    setNomeMed("");
    setCrmMed("");

    Alert.alert("Sucesso", "Médico adicionado.");
  }

  async function criarConsultaTeste() {
    if (!nomePac.trim() || !dataConsulta.trim()) {
      Alert.alert("Erro", "Preencha nome do paciente e data da consulta.");
      return;
    }

    if (medicos.length === 0) {
      Alert.alert("Erro", "Cadastre um médico antes de criar a consulta.");
      return;
    }

    const partesData = dataConsulta.split("/");

    if (partesData.length !== 3) {
      Alert.alert("Erro", "Digite a data no formato DD/MM/AAAA.");
      return;
    }

    const [dia, mes, ano] = partesData;
    const data = new Date(Number(ano), Number(mes) - 1, Number(dia));

    if (Number.isNaN(data.getTime())) {
      Alert.alert("Erro", "Data inválida.");
      return;
    }

    const pacienteTeste: Paciente = {
      id: Date.now(),
      nome: nomePac,
      cpf: "123.456.789-00",
      email: "paciente@email.com",
      telefone: "(11) 98765-4321",
    };

    const novaConsulta: Consulta = {
      id: Date.now(),
      medico: medicos[0],
      paciente: pacienteTeste,
      data: data,
      valor: 350,
      status: "agendada",
      observacoes: "Consulta criada pela tela administrativa",
    };

    const consultasAtuais = await obterConsultas();
    await salvarConsultas([...consultasAtuais, novaConsulta]);

    setNomePac("");
    setDataConsulta("");

    Alert.alert("Sucesso", "Consulta criada com sucesso.", [
      { text: "OK", onPress: () => navigation.navigate("Home") },
    ]);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.secao}>
          <Text style={styles.titulo}>1. Adicionar Especialidade</Text>

          <TextInput
            style={styles.input}
            placeholder="Nome da especialidade"
            value={nomeEsp}
            onChangeText={setNomeEsp}
          />

          <TextInput
            style={styles.input}
            placeholder="Descrição"
            value={descEsp}
            onChangeText={setDescEsp}
          />

          <Button
            title="Adicionar Especialidade"
            onPress={adicionarEspecialidade}
          />

          <View style={styles.lista}>
            {especialidades.map((esp) => (
              <Text key={esp.id} style={styles.item}>
                • {esp.nome} - {esp.descricao}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.secao}>
          <Text style={styles.titulo}>2. Adicionar Médico</Text>

          <TextInput
            style={styles.input}
            placeholder="Nome do médico"
            value={nomeMed}
            onChangeText={setNomeMed}
          />

          <TextInput
            style={styles.input}
            placeholder="CRM"
            value={crmMed}
            onChangeText={setCrmMed}
          />

          <Button title="Adicionar Médico" onPress={adicionarMedico} />

          <View style={styles.lista}>
            {medicos.map((med) => (
              <Text key={med.id} style={styles.item}>
                • {med.nome} ({med.crm}) - {med.especialidade.nome}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.secao}>
          <Text style={styles.titulo}>3. Criar Consulta de Teste</Text>

          <TextInput
            style={styles.input}
            placeholder="Nome do paciente"
            value={nomePac}
            onChangeText={setNomePac}
          />

          <TextInput
            style={styles.input}
            placeholder="Data (DD/MM/AAAA)"
            value={dataConsulta}
            onChangeText={setDataConsulta}
          />

          <Button title="Criar Consulta" onPress={criarConsultaTeste} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
  },
  secao: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#f7f7f7",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  lista: {
    marginTop: 15,
  },
  item: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
});