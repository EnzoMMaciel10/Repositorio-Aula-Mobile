import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#79059C",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  header: {
    marginBottom: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 16,
    color: "#f3d9ff",
  },
  estadoVazio: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  estadoVazioTexto: {
    color: "#666",
    marginBottom: 16,
    fontSize: 16,
    textAlign: "center",
  },
  adminButtonContainer: {
    marginBottom: 16,
  },
  cardSpacing: {
    marginBottom: 12,
  },
  homeActions: {
    marginBottom: 20,
  },
  agendarButton: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  agendarButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 12,
    borderRadius: 10,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
  emptyPatientBox: {
    backgroundColor: "rgba(255,255,255,0.12)",
    padding: 24,
    borderRadius: 15,
    alignItems: "center",
  },
  emptyPatientTitle: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  emptyPatientSubtitle: {
    color: "#ead8f5",
    fontSize: 14,
    textAlign: "center",
  },
});