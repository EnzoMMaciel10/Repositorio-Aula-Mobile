import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  obterPacienteLogado,
  obterPacientes,
  salvarPacienteLogado,
  salvarPacientes,
} from "../services/storage";
import { Paciente } from "../types/paciente";

export default function CadastroPaciente({ navigation }: any) {
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [etapa, setEtapa] = useState<"cpf" | "cadastro">("cpf");
  const [verificando, setVerificando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      try {
        const pacienteLogado = await obterPacienteLogado();

        if (pacienteLogado) {
          navigation.replace("Home");
          return;
        }
      } catch (e) {
        console.error("Erro ao verificar paciente logado:", e);
      }

      setEtapa("cpf");
      setCpf("");
      setNome("");
      setEmail("");
      setTelefone("");
      setErro("");
      setVerificando(false);
    });

    return unsubscribe;
  }, [navigation]);

  function validarCPF(cpfTexto: string): boolean {
    const cpfLimpo = cpfTexto.replace(/\D/g, "");
    return cpfLimpo.length === 11;
  }

  async function verificarCPF() {
    setErro("");

    if (!cpf.trim()) {
      Alert.alert("Erro", "Por favor, preencha seu CPF");
      return;
    }

    if (!validarCPF(cpf)) {
      Alert.alert("Erro", "CPF deve ter 11 dígitos");
      return;
    }

    try {
      setVerificando(true);

      const pacientes = await obterPacientes();

      const pacienteExistente = pacientes.find(
        (p) => p.cpf.replace(/\D/g, "") === cpf.replace(/\D/g, "")
      );

      if (pacienteExistente) {
        await salvarPacienteLogado(pacienteExistente);
        navigation.replace("Home");
      } else {
        setErro(
          "CPF não encontrado no cadastro. Verifique se digitou corretamente."
        );
      }
    } catch (erroInterno) {
      console.error("Erro ao verificar CPF:", erroInterno);
      Alert.alert("Erro", "Não foi possível verificar o CPF");
    } finally {
      setVerificando(false);
    }
  }

  async function completarCadastro() {
    if (!nome.trim()) {
      Alert.alert("Erro", "Por favor, preencha seu nome");
      return;
    }

    if (!email.trim()) {
      Alert.alert("Erro", "Por favor, preencha seu email");
      return;
    }

    try {
      setVerificando(true);

      const novoPaciente: Paciente = {
        id: Date.now(),
        nome: nome.trim(),
        cpf: cpf.trim(),
        email: email.trim(),
        telefone: telefone.trim() || undefined,
      };

      const pacientes = await obterPacientes();
      const novaLista = [...pacientes, novoPaciente];

      await salvarPacientes(novaLista);
      await salvarPacienteLogado(novoPaciente);

      navigation.replace("Home");
    } catch (erroInterno) {
      console.error("Erro ao cadastrar:", erroInterno);
      Alert.alert("Erro", "Não foi possível realizar o cadastro");
    } finally {
      setVerificando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="light" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.icone}>TDSPO</Text>
          <Text style={styles.titulo}>Bem-vindo!</Text>
          <Text style={styles.subtitulo}>
            {etapa === "cpf"
              ? "Informe seu CPF para continuar"
              : "Complete seu cadastro"}
          </Text>
        </View>

        <View style={styles.form}>
          {etapa === "cpf" && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>CPF *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChangeText={(texto) => {
                    setCpf(texto);
                    setErro("");
                  }}
                  keyboardType="numeric"
                  maxLength={14}
                  editable={!verificando}
                />
              </View>

              <TouchableOpacity
                style={[styles.botao, verificando && styles.botaoDesabilitado]}
                onPress={verificarCPF}
                disabled={verificando}
              >
                <Text style={styles.botaoTexto}>
                  {verificando ? "Verificando..." : "Continuar"}
                </Text>
              </TouchableOpacity>

              {erro ? (
                <View style={styles.erroContainer}>
                  <Text style={styles.erroTexto}>{erro}</Text>

                  <TouchableOpacity
                    style={styles.botaoCadastro}
                    onPress={() => setEtapa("cadastro")}
                  >
                    <Text style={styles.botaoCadastroTexto}>
                      Fazer cadastro agora
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              <View style={styles.infoContainer}>
                <Text style={styles.infoTexto}>
                  Se você já é cadastrado, faremos login automaticamente.
                </Text>
              </View>
            </>
          )}

          {etapa === "cadastro" && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>CPF</Text>
                <TextInput
                  style={[styles.input, styles.inputDesabilitado]}
                  value={cpf}
                  editable={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Nome Completo *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Digite seu nome completo"
                  value={nome}
                  onChangeText={setNome}
                  autoCapitalize="words"
                  editable={!verificando}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="seu@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!verificando}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Telefone</Text>
                <TextInput
                  style={styles.input}
                  placeholder="(11) 99999-9999"
                  value={telefone}
                  onChangeText={setTelefone}
                  keyboardType="phone-pad"
                  editable={!verificando}
                />
              </View>

              <TouchableOpacity
                style={[styles.botao, verificando && styles.botaoDesabilitado]}
                onPress={completarCadastro}
                disabled={verificando}
              >
                <Text style={styles.botaoTexto}>
                  {verificando ? "Cadastrando..." : "Finalizar Cadastro"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botaoVoltar}
                onPress={() => setEtapa("cpf")}
                disabled={verificando}
              >
                <Text style={styles.botaoVoltarTexto}>← Voltar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#79059C",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  icone: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  titulo: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 16,
    color: "#ead8f5",
    textAlign: "center",
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#f7f7f7",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  inputDesabilitado: {
    backgroundColor: "#ececec",
    color: "#666",
  },
  botao: {
    backgroundColor: "#79059C",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  botaoTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  erroContainer: {
    backgroundColor: "#fff2f2",
    borderWidth: 1,
    borderColor: "#ffcaca",
    borderRadius: 10,
    padding: 14,
    marginTop: 16,
  },
  erroTexto: {
    color: "#b00020",
    fontSize: 14,
    marginBottom: 10,
  },
  botaoCadastro: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  botaoCadastroTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
  infoContainer: {
    marginTop: 18,
  },
  infoTexto: {
    color: "#666",
    fontSize: 13,
    textAlign: "center",
  },
  botaoVoltar: {
    marginTop: 14,
    alignItems: "center",
  },
  botaoVoltarTexto: {
    color: "#79059C",
    fontWeight: "bold",
    fontSize: 14,
  },
});