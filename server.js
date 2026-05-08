import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { google } from "googleapis";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const credentials = require("./html-495614-b47f4e0db72a.json");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

const SPREADSHEET_ID = "1k1-vnUvF4xeNiLRVm5URPBysuR7Z4IOxJTOD8vkKAp4";
const SHEET_NAME = "Página1"; 

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

async function appendToSheet(dados) {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A:D`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[
        dados.dataRequisicao,
        dados.centroCusto,
        dados.produto,
        dados.quantidade
    ]],
    },
  });
}

app.post("/enviar", async (req, res) => {
  try {
    console.log("Dados recebidos:", req.body);
    await appendToSheet(req.body);
    console.log("✅ Dados salvos na planilha!");
    res.json({ status: "ok" });
  } catch (error) {
    console.error("❌ Erro:", error.message);
    res.status(500).json({ status: "erro", mensagem: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});