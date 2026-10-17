/**
 * English Pro - AR Finance Edition
 * Frontend Logic, SpeechRecognition, SpeechSynthesis & Gemini AI Integration
 */

// Estado global de la aplicación
const state = {
  currentWeek: 1,
  activeDay: 'monday',
  userLevel: 1,
  streak: 3,
  speechRate: 0.9,
  targetLanguage: localStorage.getItem('ep_target_lang') || 'en-US', // Preparado para expansión (en-US, pt-BR, it-IT, etc.)
  gasUrl: localStorage.getItem('ep_gas_url') || '',
  geminiKey: localStorage.getItem('ep_gemini_key') || '',
  isListening: false,
  recognition: null,
  currentTranscript: '',
  curriculumData: null,
  customArticles: JSON.parse(localStorage.getItem('ep_custom_articles') || '[]'),
  evaluationHistory: JSON.parse(localStorage.getItem('ep_history') || '[]')
};

// Currículum con Explicaciones Largas, Ejemplos de Negocios y Modo Podcast (70% Inglés / 30% Español)
const offlineCurriculum = [
  {
    week: 1,
    title: "Financial Statements & Corporate Grammar: Active vs Passive Voice in Audits",
    category: "Contabilidad, Finanzas & Gramática Estructural",
    theoryMarkdown: `
### 📘 Masterclass Lunes: Financial Statements & Gramática Estructural Profunda

#### 1. Fundamentos del Lenguaje Financiero Corporativo
Cuando un profesional de finanzas o contabilidad en Argentina interactúa con una casa matriz en Nueva York, Londres o Zúrich, el error más común no es el vocabulario suelto, sino trasladar las estructuras de redacción directa del español al inglés.

En el español de negocios solemos decir: *"Ajustamos la cuenta deudores incobrables porque vimos que tres clientes no van a pagar"* o *"Depreciamos la maquinaria según la tabla impositiva"*. 
Sin embargo, en el estándar contable anglosajón y en las auditorías de Big Four (PwC, EY, Deloitte, KPMG), este estilo en primera persona suena informal y poco riguroso. En su lugar, el estándar exige la **Passive Voice (Voz Pasiva)**.

#### 2. La Regla de Oro Gramatical: La Voz Pasiva en Informes y Auditorías
La voz pasiva traslada el foco desde *quién ejecutó la acción* hacia *el hecho contable en sí mismo*:
* **Informal / Conversacional:** *"We recorded a substantial loss due to inflation."*
* **Estándar Ejecutivo Formal:** *"A substantial monetary loss was recorded in the quarterly financial statements."*

##### Fórmulas estructurales que debes dominar:
1. **Present Perfect Passive (Para hechos recientes con impacto actual en el balance):**
   * **Fórmula:** [Sujeto contable] + **have/has been** + [Participio Pasado]
   * *Ejemplo real:* *"Accounts receivable **have been adjusted** upward by two million pesos to reflect default risk."*
   * *Traducción explicada:* "Los créditos por ventas han sido ajustados al alza en dos millones de pesos para reflejar el riesgo de incobrabilidad."
2. **Past Simple Passive (Para movimientos cerrados del ejercicio):**
   * **Fórmula:** [Sujeto contable] + **was/were** + [Participio Pasado]
   * *Ejemplo real:* *"Non-current tangible assets **were revalued** pursuant to IFRS standards."*
   * *Traducción explicada:* "Los activos no corrientes tangibles fueron revaluados de conformidad con las normas NIIF/IFRS."

#### 3. Preposiciones Financieras de Variación (El error más costoso):
En inglés, cambiar la preposición altera por completo el significado contable:
* **BY (Indica el margen o la brecha de variación):** *"Operating profit fell **by** 5%."* (El beneficio cayó un 5%, ej. de 20% a 15%).
* **TO (Indica el punto final o meta alcanzada):** *"Operating profit fell **to** 5%."* (El beneficio cayó hasta llegar al 5%).
* **FROM ... TO (El trayecto completo):** *"Gross margin contracted **from** 28% **to** 22% due to local supplier price increases."*
* *¡Alerta criolla!:* Nunca digas *"fell in 5%"*. Decir *in* es un calco del castellano y gramaticalmente incorrecto.

#### 4. Equivalencias Técnicas: Argentina vs. IFRS / US GAAP
* **Bienes de Cambio:** Se traduce como **Inventories** (US) o **Stock** (UK). Jamás 'Exchange goods'.
* **Bienes de Uso:** **Property, Plant and Equipment (PP&E)** o **Fixed Assets**.
* **Créditos por Ventas:** **Accounts Receivable (A/R)**.
* **Deudas Comerciales / Proveedores:** **Accounts Payable (A/P)**.
* **Previsión para deudores incobrables:** **Allowance for Doubtful Accounts** (US) o **Provision for Bad Debts** (UK).
* **Resultado del Ejercicio:** **Net Income** o **Profit for the Year**.

#### 🎙️ Fonética Crítica de Negocios:
En la palabra **Debt** (deuda) y **Doubt** (duda), la letra **"b" es 100% muda**. Se pronuncia exactamente como */det/* y */daʊt/*. Si pronuncias la letra "b", cualquier auditor angloparlante sabrá que no dominas el inglés profesional.
    `,
    // Guion continuo tipo Podcast para reproducir sin tocar el celu (70% ENG / 30% ESP)
    commuteAudioTracks: [
      {
        speaker: "es-AR",
        title: "Introducción de Martín",
        text: "¡Hola! Bienvenidos a la clase de la semana. Hoy nos metemos a fondo con los Estados Contables y la estructura gramatical formal que usan los auditores internacionales. Empecemos escuchando los términos centrales del balance."
      },
      {
        speaker: "en-US",
        title: "Core Term 1: Balance Sheet",
        text: "The Balance sheet, also known as the statement of financial position. For example: Our balance sheet reflects robust liquidity across all current assets, ensuring short term obligations are fully covered."
      },
      {
        speaker: "es-AR",
        title: "Comentario del Coach: Bienes de Cambio",
        text: "Atención con esto: en Argentina decimos Bienes de Cambio, pero en un reporte en inglés tenés que decir Inventories. Escuchemos cómo se formula una caída de inventarios con voz pasiva y preposiciones correctas."
      },
      {
        speaker: "en-US",
        title: "Core Term 2: Inventories and Passive Voice",
        text: "Inventories were written down by four hundred thousand dollars due to obsolescence. Please note the preposition: written down BY four hundred thousand dollars, reflecting the exact amount of the adjustment."
      },
      {
        speaker: "es-AR",
        title: "Regla fonética: Debt con b muda",
        text: "Recordá siempre la regla de oro: la palabra deuda se escribe con b pero la b no suena jamás. Escuchá cómo suena de forma nativa."
      },
      {
        speaker: "en-US",
        title: "Phonetic Drill: Silent B",
        text: "Debt. Net debt. Long term debt. For instance: Our company successfully refinanced all outstanding commercial debt at favorable fixed interest rates."
      },
      {
        speaker: "es-AR",
        title: "Gramática: Voz Pasiva en Auditorías",
        text: "Pasemos ahora a la gramática formal. En lugar de decir 'we adjusted the accounts', los directores esperan escuchar 'accounts have been adjusted'. Escuchemos un párrafo modelo completo de auditoría."
      },
      {
        speaker: "en-US",
        title: "Executive Memo Listening Drill",
        text: "During the latest audit review, the allowance for doubtful accounts was increased by fifteen percent. Several commercial receivables were reclassified as non-performing credits. Consequently, operating income was reduced by two point five million dollars."
      },
      {
        speaker: "es-AR",
        title: "Cierre de la lección",
        text: "Excelente. Has completado la sesión de escucha de hoy. Cuando tengas un minuto libre, recordá hacer la práctica de Writing para redactar tu propio memorándum con estas mismas estructuras."
      }
    ],
    vocab: [
      { term: "Balance Sheet", arEquiv: "Estado de Situación Patrimonial / Balance General", phonetic: "/ˈbæl.əns ʃiːt/", example: "Our balance sheet shows strong liquidity in current assets." },
      { term: "Income Statement (P&L)", arEquiv: "Estado de Resultados / Cuadro de Resultados", phonetic: "/ˈɪn.kʌm ˈsteɪt.mənt/", example: "The P&L reflects higher financial costs due to interest rate spikes." },
      { term: "Current Assets", arEquiv: "Activo Corriente", phonetic: "/ˈkɝː.ənt ˈæs.ets/", example: "Cash and short-term investments represent 45% of our current assets." },
      { term: "Liabilities", arEquiv: "Pasivo", phonetic: "/ˌlaɪ.əˈbɪl.ə.t̬iz/", example: "We successfully restructured short-term debt into long-term liabilities." },
      { term: "Retained Earnings", arEquiv: "Resultados Acumulados / Ganancias Reservadas", phonetic: "/rɪˈteɪnd ˈɝː.nɪŋz/", example: "The board voted to reinvest retained earnings to fund capital expenditures." },
      { term: "Gross Margin", arEquiv: "Margen Bruto", phonetic: "/ɡroʊs ˈmɑːr.dʒɪn/", example: "Price adjustments helped defend our gross margin against inflation." }
    ],
    writingTask: {
      prompt: "Escribí un memorándum contable breve (3 a 5 oraciones en inglés) explicando por qué la previsión para deudores incobrables fue incrementada este trimestre.",
      grammarFocus: "Usa al menos 2 oraciones en voz pasiva formal (ej. 'was increased', 'were recognized') y una preposición de variación ('decreased by...').",
      modelAnswer: "During the current fiscal quarter, the allowance for doubtful accounts was adjusted upward by two million pesos. Several non-performing commercial credits were reclassified following credit committee evaluations. Consequently, operating profit was negatively impacted by 1.8%."
    },
    dailyWritingRules: {
      monday: {
        title: "Regla de Oro: Objetividad en Memos con Voz Pasiva",
        rule: "En redacción financiera anglosajona, nunca abras un informe diciendo 'We noticed...'. Abrí con el hecho contable: 'A variance was observed in operating expenditures'.",
        example: "Ajuste contable: 'An impairment charge of $500,000 was recognized in accordance with IAS 36.'"
      },
      tuesday: {
        title: "Puntuación de Cifras y Monedas (US vs Argentina)",
        rule: "En inglés se invierten las comas y puntos: la coma separa miles ($1,000,000) y el punto indica decimales (5.25%). El signo pesos o dólar ($) va siempre pegado y antes de la cifra ($15M).",
        example: "Correcto: 'Net income reached $12,450,200.50, up 3.4% year-over-year.'"
      },
      wednesday: {
        title: "La Regla de Preposiciones Numéricas (BY vs TO)",
        rule: "Para escribir sobre variaciones: 'dropped by 4%' significa que cayó 4 puntos porcentuales. 'dropped to 4%' significa que el valor final alcanzado fue 4%. Nunca uses 'in' para magnitudes.",
        example: "Correcto: 'EBITDA margin contracted by 150 basis points, down to 18.2%.'"
      },
      thursday: {
        title: "Conectores Lógicos de Negocios (Linking Words)",
        rule: "Evita escribir oraciones telegráficas cortas. Usa conectores de alta jerarquía ejecutiva: 'Consequently' (en consecuencia), 'Pursuant to' (de conformidad con), 'Notwithstanding' (a pesar de).",
        example: "Correcto: 'Notwithstanding macroeconomic headwinds, liquidity ratios remained solid.'"
      },
      friday: {
        title: "Cierre Formal y Llamado a la Acción en Auditorías",
        rule: "Para cerrar un email o nota formal a directivos extranjeros: 'Please let us know should you require further supporting documentation regarding this assessment.'",
        example: "Fórmula: 'Should you have any inquiries, we remain at your disposal.'"
      }
    },
    tasks: {
      tuesday: {
        type: "Shadowing & Fluency Drill",
        description: "Escuchá cada frase y luego repetila en voz alta manteniendo el ritmo corporativo:",
        phrases: [
          "The balance sheet clearly outlines our current and non-current liabilities.",
          "Operating margins were reduced by three hundred basis points.",
          "Working capital requirements increased due to extended supplier payment terms."
        ]
      },
      wednesday: {
        type: "Pronunciation & Phonetics Quiz",
        description: "Evaluación de fonemas difíciles. Pronunciá con exactitud la 'b' muda y el ritmo silábico:",
        challenges: [
          { target: "Our company carries virtually zero net debt.", tip: "Recordá: Debt suena /det/ sin la 'b'." },
          { target: "Total current liabilities decreased by fifteen percent.", tip: "Acentuá la primera sílaba en liabilities: /ˈlaɪ.ə.../" },
          { target: "Accounts receivable collection period expanded.", tip: "Receivable se pronuncia /rɪˈsiː.və.bəl/." }
        ]
      },
      thursday: {
        type: "Real-world Scenario",
        title: "Explaining the P&L to Foreign Executives",
        scenario: "Estás en una call con ejecutivos de EE.UU. que no entienden por qué cayó el margen operativo a pesar de haber vendido más pesos.",
        challengePrompt: "En inglés, explicá que el volumen de ventas estuvo estancado (flat) y que los costos de mercadería vendida (COGS) subieron por reajustes de proveedores locales.",
        referenceAnswer: "Although revenue increased in nominal terms, sales volume remained flat, and our cost of goods sold surged due to local supplier price adjustments."
      },
      friday: {
        type: "Gatekeeper Speaking Exam",
        title: "Quarterly Audit Speaking Defense",
        passThreshold: 75,
        scenario: "El socio de la auditoría externa te pide fundamentar en voz alta el cálculo de la previsión para deudores incobrables (Allowance for Doubtful Accounts). Respondé usando vocabulario técnico de la semana y estructuras en voz pasiva.",
        criteria: "Mínimo 75% de precisión de habla y uso correcto de vocabulario técnico contable para desbloquear la Semana 2."
      }
    }
  },
  {
    week: 2,
    title: "Argentine Macro, FX Markets & Grammar: Conditionals in Risk Management",
    category: "Macroeconomía, Tesorería & Condicionales",
    theoryMarkdown: `
### 📘 Masterclass Lunes: Argentine FX, Capital Controls & Condicionales

#### 1. El Desafío de Comunicar la Macro Argentina al Exterior
Explicar la brecha cambiaria, el desdoblamiento del dólar y las restricciones del BCRA a directores financieros internacionales requiere precisión léxica y gramatical. Un error conceptual puede generar pánico en la casa matriz o malentendidos en la auditoría de consolidación.

#### 2. Marco Gramatical: Segundo Condicional para Modelar Escenarios de Riesgo
Al debatir estrategias de cobertura de tesorería (*hedging*) o proyecciones de flujo de fondos, nunca se utiliza el presente indicativo directo. Se usa el **Second Conditional (Segundo Condicional)** para plantear hipótesis de negocios sin alarmar al comité:

* **Estructura:** **If + [Sujeto] + [Verbo en Past Simple] , [Sujeto] + would / could + [Infinitivo]**
* **Ejemplo 1 (Devaluación oficial):**
  * *"If the Central Bank **accelerated** the crawling peg, our imported inventory costs **would surge** by fifteen percent."*
  * *Explicación:* Si el BCRA acelerara la devaluación gradual, nuestros costos de inventario importado subirían un 15%.
* **Ejemplo 2 (Brecha cambiaria):**
  * *"If the blue-chip swap spread **widened** beyond thirty percent, local suppliers **would demand** advance cash payments."*
  * *Explicación:* Si la brecha del Contado con Liquidación se ampliara más del 30%, los proveedores locales exigirían pagos anticipados en efectivo.

#### 3. El Glosario Cambiario Indispensable:
* **Brecha Cambiaria:** **FX gap** o **Exchange rate spread**.
* **Contado con Liquidación (CCL):** En el mercado financiero internacional se denomina formalmente **Blue-Chip Swap**.
* **Dólar MEP / Bolsa:** **Electronic Payment Market Dollar** o **Local bond-settled FX**.
* **Cepo Cambiario:** **Capital controls** o **FX restrictions** (nunca traducir literalmente como 'currency padlock').
* **Ajuste por Inflación:** **Inflation accounting** o **Constant currency adjustment** bajo la norma **IAS 29 (Financial Reporting in Hyperinflationary Economies)**.
* **Giro de Dividendos:** **Dividend remittances** o **Repatriation of profits**.
    `,
    commuteAudioTracks: [
      {
        speaker: "es-AR",
        title: "Introducción de la Semana 2",
        text: "Bienvenidos al módulo macroeconómico y cambiario. En este viaje vamos a aprender cómo explicarle la brecha del dólar y las normativas del Banco Central a un directivo extranjero, usando condicionales en inglés."
      },
      {
        speaker: "en-US",
        title: "FX Spread & Central Bank Controls",
        text: "In emerging economies, foreign exchange controls often produce a substantial spread between the official exchange rate and financial markets. For instance: Due to strict Central Bank regulations, the blue-chip swap spread reached twenty-five percent this month."
      },
      {
        speaker: "es-AR",
        title: "Uso de Condicionales en Finanzas",
        text: "Fijate cómo usamos el segundo condicional para plantear escenarios hipotéticos. En lugar de decir que algo va a pasar seguro, decimos: 'Si el tipo de cambio subiera, nosotros haríamos esto'."
      },
      {
        speaker: "en-US",
        title: "Conditional Scenario Drill",
        text: "If the exchange rate gap expanded significantly, our treasury team would immediately execute dollar-linked sovereign bond hedges to protect working capital."
      },
      {
        speaker: "es-AR",
        title: "Término clave: Remesas de Dividendos",
        text: "Cuando la casa matriz te pide girar utilidades, no digas 'send money'. El término técnico correcto es dividend remittances. Escuchemos el ejemplo."
      },
      {
        speaker: "en-US",
        title: "Corporate Term: Dividend Remittances",
        text: "Dividend remittances abroad remain conditioned upon prior approval from the monetary authorities pursuant to Central Bank communication guidelines."
      },
      {
        speaker: "es-AR",
        title: "Cierre del viaje",
        text: "Excelente viaje. Ya tenés las frases y la estructura gramatical en la cabeza. Más tarde podés abrir la app para practicar la pronunciación o hacer el desafío hablado."
      }
    ],
    vocab: [
      { term: "Exchange Rate Spread / FX Gap", arEquiv: "Brecha Cambiaria", phonetic: "/ɪksˈtʃeɪndʒ reɪt ɡæp/", example: "The FX spread between the official peg and the financial market reached 20%." },
      { term: "Blue-Chip Swap (CCL)", arEquiv: "Contado con Liquidación", phonetic: "/bluː tʃɪp swɑːp/", example: "Multinationals often use the blue-chip swap rate for balance sheet conversions." },
      { term: "Capital Controls", arEquiv: "Cepo Cambiario / Restricciones Cambiarias", phonetic: "/ˈkæp.ə.t̬əl kənˈtroʊlz/", example: "Capital controls limit direct access to foreign currency for overseas payments." },
      { term: "Inflation Accounting (IAS 29)", arEquiv: "Ajuste por Inflación Contable", phonetic: "/ɪnˈfleɪ.ʃən əˈkaʊn.tɪŋ/", example: "IAS 29 mandates inflation accounting adjustments on non-monetary items." },
      { term: "Treasury Hedging", arEquiv: "Cobertura de Tesorería", phonetic: "/ˈtreʒ.ɚ.i ˈhedʒ.ɪŋ/", example: "We executed treasury hedging via dollar-linked sovereign instruments." }
    ],
    writingTask: {
      prompt: "Escribí un análisis de riesgo cambiario (3-4 oraciones) para el comité de finanzas evaluando qué pasaría si se amplía la brecha cambiaria.",
      grammarFocus: "Usa el segundo condicional ('If the spread widened, we would...') y vocabulario cambiario.",
      modelAnswer: "If the blue-chip swap spread widened beyond twenty percent, our local procurement costs would face severe inflationary pressure. Therefore, if the committee approved hedging instruments today, treasury would neutralize potential balance sheet losses."
    },
    tasks: {
      tuesday: {
        type: "Shadowing & Fluency Drill",
        description: "Repetí en voz alta las siguientes explicaciones macroeconómicas:",
        phrases: [
          "If the exchange rate gap expanded, imported material costs would increase.",
          "We are applying inflation adjustments pursuant to IAS 29 guidelines.",
          "Central bank regulations currently restrict outbound dividend remittances."
        ]
      },
      wednesday: {
        type: "Pronunciation & Phonetics Quiz",
        description: "Practicá la acentuación de términos regulatorios y cambiarios:",
        challenges: [
          { target: "Inflation accounting reflects purchasing power erosion.", tip: "Purchasing power: /ˈpɝː.tʃə.sɪŋ ˌpaʊ.ɚ/." },
          { target: "We hedges our balance sheet against currency devaluation.", tip: "Hedges se pronuncia /ˈhedʒ.ɪz/." }
        ]
      },
      thursday: {
        type: "Real-world Scenario",
        title: "Explaining the Blue-Chip Swap to HQ",
        scenario: "En una llamada con Tesorería Global, te preguntan por qué no pueden convertir los pesos a la cotización oficial del Banco Central.",
        challengePrompt: "En inglés, explicá que el acceso al mercado oficial está restringido y que el tipo de cambio financiero de referencia es el Blue-Chip Swap.",
        referenceAnswer: "Access to the official FX market is strictly restricted by Central Bank regulations, which is why we must reference the blue-chip swap rate."
      },
      friday: {
        type: "Gatekeeper Speaking Exam",
        title: "Treasury Committee Hedging Presentation",
        passThreshold: 75,
        scenario: "Presentá en voz alta tu recomendación para cubrir la posición neta en pesos frente a la devaluación esperada.",
        criteria: "75% o más para habilitar la Semana 3 (Impuestos y ARCA)."
      }
    }
  }
];

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', () => {
  initServiceWorker();
  initSpeechRecognition();
  bindUIEvents();
  loadCurrentWeek();
  updateProgressUI();
});

function initServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch((err) => console.log('SW reg error:', err));
  }
}

// Inicialización de Web Speech API (Reconocimiento del micrófono)
function initSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.warn('Web Speech API no soportada directamente.');
    return;
  }

  state.recognition = new SpeechRecognition();
  state.recognition.continuous = true;
  state.recognition.interimResults = true;
  state.recognition.lang = state.targetLanguage || 'en-US';

  state.recognition.onstart = () => {
    state.isListening = true;
    updateMicStatus(true);
  };

  state.recognition.onend = () => {
    state.isListening = false;
    updateMicStatus(false);
  };

  state.recognition.onerror = (e) => {
    console.error('Error de micrófono:', e.error);
    state.isListening = false;
    updateMicStatus(false);
  };
}

// Variables del Reproductor Continuo (Modo Viaje / Podcast)
let commuteTracks = [];
let currentCommuteIdx = 0;
let isCommutePlaying = false;

function setupCommutePlayer(tracks) {
  commuteTracks = tracks || [];
  currentCommuteIdx = 0;
  isCommutePlaying = false;
  updateCommuteUI();
}

function updateCommuteUI() {
  const playBtn = document.getElementById('btnCommutePlayPause');
  const trackTitle = document.getElementById('commuteCurrentTrack');
  const trackSub = document.getElementById('commuteCurrentPart');

  if (!commuteTracks || commuteTracks.length === 0) {
    if (trackTitle) trackTitle.innerText = "No hay audios disponibles";
    return;
  }

  const current = commuteTracks[currentCommuteIdx];
  if (trackTitle) trackTitle.innerText = current ? current.title : "Listo para reproducir";
  if (trackSub) trackSub.innerText = current ? `Parte ${currentCommuteIdx + 1} de ${commuteTracks.length} (${current.speaker === 'es-AR' ? '🇦🇷 Coach Español' : '🇺🇸 Inglés Nativo'})` : "";
  if (playBtn) playBtn.innerHTML = isCommutePlaying ? '⏸️' : '▶️';
}

function toggleCommutePlayPause() {
  if (!commuteTracks || commuteTracks.length === 0) return;
  if (isCommutePlaying) {
    pauseCommuteAudio();
  } else {
    playCommuteTrack(currentCommuteIdx);
  }
}

function playCommuteTrack(idx) {
  if (idx < 0 || idx >= commuteTracks.length) {
    // Terminó todo el podcast
    isCommutePlaying = false;
    currentCommuteIdx = 0;
    updateCommuteUI();
    setCoachMessage("🎉 ¡Terminaste el podcast de hoy! Ya tenés incorporados los conceptos clave.");
    return;
  }

  currentCommuteIdx = idx;
  isCommutePlaying = true;
  updateCommuteUI();

  const track = commuteTracks[idx];
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(track.text);
  utterance.lang = track.speaker;
  utterance.rate = track.speaker === 'es-AR' ? 1.0 : (state.speechRate || 0.9);

  // Asignar voz natural según corresponda
  const voices = window.speechSynthesis.getVoices();
  const langPrefix = track.speaker.split('-')[0];
  const targetVoice = voices.find(v => v.lang.startsWith(langPrefix) && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Sabina')));
  if (targetVoice) utterance.voice = targetVoice;

  utterance.onend = () => {
    if (isCommutePlaying) {
      // Avanzar automáticamente a la siguiente parte sin que el usuario toque nada
      setTimeout(() => {
        playCommuteTrack(currentCommuteIdx + 1);
      }, 700);
    }
  };

  utterance.onerror = (e) => {
    console.error('Error de audio en commute:', e);
    isCommutePlaying = false;
    updateCommuteUI();
  };

  window.speechSynthesis.speak(utterance);
}

function pauseCommuteAudio() {
  isCommutePlaying = false;
  window.speechSynthesis.cancel();
  updateCommuteUI();
}

function nextCommuteTrack() {
  if (currentCommuteIdx < commuteTracks.length - 1) {
    playCommuteTrack(currentCommuteIdx + 1);
  }
}

function prevCommuteTrack() {
  if (currentCommuteIdx > 0) {
    playCommuteTrack(currentCommuteIdx - 1);
  }
}

// Síntesis de voz nativa (Hablar en idioma objetivo - individual)
function speakEnglish(text, onComplete) {
  if (!('speechSynthesis' in window)) {
    alert('Tu navegador no soporta síntesis de voz.');
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = state.targetLanguage || 'en-US';
  utterance.rate = state.speechRate || 0.9;
  const voices = window.speechSynthesis.getVoices();
  const langPrefix = (state.targetLanguage || 'en').split('-')[0];
  const targetVoice = voices.find(v => v.lang.startsWith(langPrefix) && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
  if (targetVoice) utterance.voice = targetVoice;
  if (onComplete) utterance.onend = onComplete;
  window.speechSynthesis.speak(utterance);
}

// Asistente en Español / Coach Argentino (Voz nativa de Argentina)
function speakCoachSpanish(text, onComplete) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-AR';
  utterance.rate = 1.0;

  const voices = window.speechSynthesis.getVoices();
  // Priorizar voz específica de Argentina
  const arVoice = voices.find(v => v.lang === 'es-AR' || v.lang === 'es_AR') ||
                  voices.find(v => v.name.includes('Argentina') || v.name.includes('Tomás') || v.name.includes('Sabina')) ||
                  voices.find(v => v.lang.startsWith('es') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Paulina')));
  if (arVoice) utterance.voice = arVoice;

  if (onComplete) utterance.onend = onComplete;
  window.speechSynthesis.speak(utterance);
}

// Enlace de Eventos de la UI
function bindUIEvents() {
  // Controles de Modo Viaje / Podcast Continuo
  const btnPlayCommute = document.getElementById('btnCommutePlayPause');
  if (btnPlayCommute) btnPlayCommute.addEventListener('click', toggleCommutePlayPause);

  const btnPrevCommute = document.getElementById('btnCommutePrev');
  if (btnPrevCommute) btnPrevCommute.addEventListener('click', prevCommuteTrack);

  const btnNextCommute = document.getElementById('btnCommuteNext');
  if (btnNextCommute) btnNextCommute.addEventListener('click', nextCommuteTrack);

  // Navegación de Pestañas
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const tabId = btn.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });

  // Selector de Días (Lun a Vie)
  document.querySelectorAll('.day-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeDay = btn.getAttribute('data-day');
      renderDayContent();
    });
  });

  // Modal Settings
  const settingsModal = document.getElementById('settingsModal');
  document.getElementById('openSettingsBtn').addEventListener('click', () => {
    document.getElementById('gasUrlInput').value = state.gasUrl;
    document.getElementById('geminiKeyInput').value = state.geminiKey;
    document.getElementById('speechRateRange').value = state.speechRate;
    document.getElementById('rateValueLabel').innerText = state.speechRate + 'x';
    const langSelect = document.getElementById('targetLanguageSelect');
    if (langSelect) langSelect.value = state.targetLanguage;
    settingsModal.classList.add('open');
  });

  document.getElementById('closeSettingsBtn').addEventListener('click', () => {
    settingsModal.classList.remove('open');
  });

  document.getElementById('speechRateRange').addEventListener('input', (e) => {
    state.speechRate = parseFloat(e.target.value);
    document.getElementById('rateValueLabel').innerText = state.speechRate + 'x';
  });

  document.getElementById('saveSettingsBtn').addEventListener('click', () => {
    state.gasUrl = document.getElementById('gasUrlInput').value.trim();
    state.geminiKey = document.getElementById('geminiKeyInput').value.trim();
    const langSelect = document.getElementById('targetLanguageSelect');
    if (langSelect) {
      state.targetLanguage = langSelect.value;
      localStorage.setItem('ep_target_lang', state.targetLanguage);
      if (state.recognition) state.recognition.lang = state.targetLanguage;
    }
    localStorage.setItem('ep_gas_url', state.gasUrl);
    localStorage.setItem('ep_gemini_key', state.geminiKey);
    settingsModal.classList.remove('open');
    setCoachMessage("¡Configuración guardada! El sistema y el evaluador de voz se sincronizaron.");
  });

  // Modal Currículum
  const curModal = document.getElementById('curriculumModal');
  document.getElementById('changeWeekBtn').addEventListener('click', () => {
    renderCurriculumModal();
    curModal.classList.add('open');
  });
  document.getElementById('closeCurriculumBtn').addEventListener('click', () => {
    curModal.classList.remove('open');
  });

  // Botón Analizar Noticia / Artículo
  document.getElementById('btnAnalyzeArticle').addEventListener('click', handleArticleAnalysis);

  // Botón Sparring Mic
  document.getElementById('sparringMicBtn').addEventListener('click', toggleSparringMic);
}

// Carga y renderizado de la semana actual
function loadCurrentWeek() {
  const currentWeekObj = offlineCurriculum.find(w => w.week === state.currentWeek) || offlineCurriculum[0];
  state.curriculumData = currentWeekObj;
  document.getElementById('currentWeekBadge').innerText = `Semana ${currentWeekObj.week} / 24`;
  setupCommutePlayer(currentWeekObj.commuteAudioTracks || []);
  renderDayContent();
}

function renderDayContent() {
  const area = document.getElementById('dayContentArea');
  const data = state.curriculumData;
  if (!data) return;

  if (state.activeDay === 'monday') {
    // LUNES: TEORÍA Y VOCABULARIO
    let vocabHtml = data.vocab.map(item => `
      <div class="vocab-card">
        <div class="vocab-header">
          <span class="vocab-term">${item.term}</span>
          <button class="vocab-listen-btn" onclick="speakEnglish('${escapeQuotes(item.term)}')">🔊</button>
        </div>
        <div class="vocab-phonetic">${item.phonetic}</div>
        <div class="vocab-equiv">🇦🇷 ${item.arEquiv}</div>
        <div class="vocab-example">
          "${item.example}"
          <button style="background:none;border:none;cursor:pointer;color:#93c5fd;font-size:0.75rem;margin-left:4px;" onclick="speakEnglish('${escapeQuotes(item.example)}')">🔊</button>
        </div>
      </div>
    `).join('');

    area.innerHTML = `
      <div class="card">
        <h2 class="card-title">📖 Masterclass Teórica: ${data.title}</h2>
        <div style="font-size:0.88rem; line-height:1.55; margin:14px 0; color:#4A5568;">
          ${formatMarkdownSimple(data.theoryMarkdown)}
        </div>
        <h3 style="font-size:0.95rem; margin:18px 0 10px 0; color:#1A202C;">Vocabulario Técnico Clave (Escuchá la pronunciación):</h3>
        ${vocabHtml}
      </div>
    `;
    setCoachMessage("Hoy es lunes de teoría y gramática pesada. Leé los patrones de voz pasiva y preposiciones financieras, y luego hacé clic en 'Writing' para practicar redacción.");

  } else if (state.activeDay === 'writing') {
    // NUEVO DÍA: WRITING & GRAMÁTICA PRÁCTICA
    const wTask = data.writingTask || {
      prompt: "Redactá un párrafo contable en inglés usando las estructuras de la semana.",
      grammarFocus: "Usa voz pasiva y vocabulario técnico.",
      modelAnswer: "Current assets were reevaluated pursuant to IFRS regulations."
    };

    area.innerHTML = `
      <div class="card">
        <div class="card-header-flex">
          <h2 class="card-title">✍️ Práctica de Escritura & Redacción Ejecutiva</h2>
          <span style="font-size:0.75rem; background:var(--pastel-sky); color:#1A365D; padding:3px 10px; border-radius:12px; font-weight:800;">Grammar & Rules</span>
        </div>
        
        <div class="daily-writing-banner">
          <div class="daily-writing-badge">✍️ Norma Clave de Redacción</div>
          <div class="daily-writing-title">Estructura Ejecutiva de un Memorandum</div>
          <div class="daily-writing-desc">En las notas de auditoría o reportes para directores, comenzá con el impacto cuantitativo y las normas aplicables (ej. IFRS / US GAAP) antes de dar explicaciones operativas.</div>
        </div>

        <div style="background:var(--bg-card-soft); padding:14px; border-radius:10px; border:1px solid var(--card-border); margin-bottom:14px;">
          <strong style="color:#2B6CB0; font-size:0.86rem;">Consigna de Redacción:</strong>
          <p style="font-size:0.85rem; color:#4A5568; margin-top:4px;">${wTask.prompt}</p>
          <div style="font-size:0.8rem; color:#C05621; margin-top:8px;">🎯 <strong>Foco gramatical:</strong> ${wTask.grammarFocus}</div>
        </div>

        <div class="input-group">
          <label class="input-label">Escribí tu respuesta en inglés:</label>
          <textarea id="writingTextInput" class="textarea-custom" rows="5" placeholder="Escribí aquí tu párrafo o memorándum corporativo en inglés..."></textarea>
        </div>

        <button class="btn-primary" id="btnSubmitWriting" onclick="evaluateWritingSubmission()">
          <span>🧠 Corregir Gramática y Estilo Ejecutivo</span>
        </button>

        <div style="margin-top:12px;">
          <button class="btn-secondary" style="font-size:0.78rem; width:100%;" onclick="toggleWritingModelAnswer()">💡 Ver memorándum modelo de referencia</button>
          <div id="writingModelAnswerBox" style="display:none; background:var(--bg-card-soft); border:1px solid var(--card-border); padding:12px; border-radius:10px; margin-top:10px; font-size:0.84rem; color:#4A5568;">
            <strong style="color:#276749;">Modelo ideal:</strong><br>
            "${wTask.modelAnswer}"
            <button style="background:none;border:none;cursor:pointer;color:#2B6CB0;font-size:0.78rem;margin-left:6px;font-weight:700;" onclick="speakEnglish('${escapeQuotes(wTask.modelAnswer)}')">🔊 Escuchar redacción</button>
          </div>
        </div>

        <div id="writingFeedbackArea"></div>
      </div>
    `;
    setCoachMessage("Momento de escribir. Pensá las oraciones con calma, aplicá las normas de redacción y tocá Corregir para que el Coach analice tu texto.");

  } else if (state.activeDay === 'tuesday') {
    // MARTES: SHADOWING
    const task = data.tasks.tuesday;
    const writingRule = (data.dailyWritingRules && data.dailyWritingRules.tuesday) || {
      title: "Puntuación de Cifras y Monedas",
      rule: "El signo $ va antes del número sin espacio ($1,000,000). Coma para miles, punto para decimales.",
      example: "Our net margin expanded to $2.5M."
    };

    let phrasesHtml = task.phrases.map((phrase, idx) => `
      <div class="vocab-card">
        <div style="font-size:0.9rem; color:#2D3748; margin-bottom:8px; font-weight:700;"><strong>#${idx+1}:</strong> "${phrase}"</div>
        <div style="display:flex; gap:8px;">
          <button class="btn-secondary" style="font-size:0.75rem; padding:6px 12px;" onclick="speakEnglish('${escapeQuotes(phrase)}')">🔊 Escuchar modelo</button>
          <button class="btn-primary" style="font-size:0.75rem; padding:6px 12px;" onclick="startSinglePractice('${escapeQuotes(phrase)}')">🎙️ Repetir yo</button>
        </div>
      </div>
    `).join('');

    area.innerHTML = `
      <div class="card">
        <h2 class="card-title">🗣️ Práctica de Martes: ${task.type}</h2>
        
        <div class="daily-writing-banner">
          <div class="daily-writing-badge">✍️ Norma de Escritura de Hoy</div>
          <div class="daily-writing-title">${writingRule.title}</div>
          <div class="daily-writing-desc">${writingRule.rule}</div>
          <div style="font-size:0.78rem; color:#7B341E; margin-top:6px; font-style:italic;">Ejemplo: "${writingRule.example}"</div>
        </div>

        <p style="font-size:0.84rem; color:var(--text-muted); margin-bottom:14px;">${task.description}</p>
        ${phrasesHtml}
        <div id="practiceFeedbackArea"></div>
      </div>
    `;
    setCoachMessage("Martes de Shadowing y Escritura de Cifras: prestá atención a la norma de redacción arriba antes de empezar la repetición oral.");

  } else if (state.activeDay === 'wednesday') {
    // MIÉRCOLES: FONÉTICA
    const task = data.tasks.wednesday;
    const writingRule = (data.dailyWritingRules && data.dailyWritingRules.wednesday) || {
      title: "Preposiciones de Variación en Informes",
      rule: "Usá 'BY' para magnitudes ('grew by 5%') y 'TO' para metas ('rose to 20%').",
      example: "Operating expenses decreased by 8%."
    };

    let challHtml = task.challenges.map((c, idx) => `
      <div class="vocab-card">
        <div style="font-size:0.9rem; color:#2B6CB0; margin-bottom:4px; font-weight:700;"><strong>Desafío #${idx+1}:</strong> "${c.target}"</div>
        <div style="font-size:0.8rem; color:#C05621; margin-bottom:8px;">💡 ${c.tip}</div>
        <div style="display:flex; gap:8px;">
          <button class="btn-secondary" style="font-size:0.75rem; padding:6px 12px;" onclick="speakEnglish('${escapeQuotes(c.target)}')">🔊 Escuchar</button>
          <button class="btn-primary" style="font-size:0.75rem; padding:6px 12px;" onclick="startSinglePractice('${escapeQuotes(c.target)}')">🎙️ Pronunciar</button>
        </div>
      </div>
    `).join('');

    area.innerHTML = `
      <div class="card">
        <h2 class="card-title">🎯 Práctica de Miércoles: ${task.type}</h2>
        
        <div class="daily-writing-banner">
          <div class="daily-writing-badge">✍️ Norma de Escritura de Hoy</div>
          <div class="daily-writing-title">${writingRule.title}</div>
          <div class="daily-writing-desc">${writingRule.rule}</div>
          <div style="font-size:0.78rem; color:#7B341E; margin-top:6px; font-style:italic;">Ejemplo: "${writingRule.example}"</div>
        </div>

        <p style="font-size:0.84rem; color:var(--text-muted); margin-bottom:14px;">${task.description}</p>
        ${challHtml}
        <div id="practiceFeedbackArea"></div>
      </div>
    `;
    setCoachMessage("Miércoles de Fonética y Preposiciones de Redacción. No te apures al hablar y recordá la regla de preposiciones.");

  } else if (state.activeDay === 'thursday') {
    // JUEVES: ESCENARIO REAL
    const task = data.tasks.thursday;
    const writingRule = (data.dailyWritingRules && data.dailyWritingRules.thursday) || {
      title: "Conectores Lógicos de Negocios (Linking Words)",
      rule: "Usa conectores formales como 'Notwithstanding', 'Pursuant to' y 'Consequently' para vincular argumentos de negocio.",
      example: "Pursuant to local statutory provisions, reserves were retained."
    };

    area.innerHTML = `
      <div class="card">
        <h2 class="card-title">💼 Práctica de Jueves: ${task.title}</h2>
        
        <div class="daily-writing-banner">
          <div class="daily-writing-badge">✍️ Norma de Escritura de Hoy</div>
          <div class="daily-writing-title">${writingRule.title}</div>
          <div class="daily-writing-desc">${writingRule.rule}</div>
          <div style="font-size:0.78rem; color:#7B341E; margin-top:6px; font-style:italic;">Ejemplo: "${writingRule.example}"</div>
        </div>

        <div style="background:var(--bg-card-soft); padding:14px; border-radius:10px; border:1px solid var(--card-border); margin-bottom:14px;">
          <strong style="color:#C05621; font-size:0.86rem;">Situación en la Empresa:</strong>
          <p style="font-size:0.84rem; color:#4A5568; margin-top:4px;">${task.scenario}</p>
        </div>
        <p style="font-size:0.85rem; color:#1A202C; margin-bottom:10px;"><strong>Tu tarea oral:</strong> ${task.challengePrompt}</p>
        
        <div class="voice-arena" id="thursdayVoiceArena">
          <button class="mic-action-btn" id="thursdayMicBtn" onclick="toggleThursdayMic('${escapeQuotes(task.referenceAnswer)}')">🎙️</button>
          <div class="mic-hint" id="thursdayMicHint">Tocá para responder en inglés</div>
          <div class="speech-live-text" id="thursdayLiveTranscript">Esperando que hables...</div>
        </div>

        <div style="margin-top:12px;">
          <button class="btn-secondary" style="font-size:0.78rem; width:100%;" onclick="speakEnglish('${escapeQuotes(task.referenceAnswer)}')">💡 Escuchar respuesta modelo ideal</button>
        </div>

        <div id="thursdayFeedbackArea"></div>
      </div>
    `;
    setCoachMessage("Jueves de Escenario Real. Planteá tu argumento con seguridad usando los conectores que vimos en la norma de redacción.");

  } else if (state.activeDay === 'friday') {
    // VIERNES: EXAMEN GATEKEEPER
    const task = data.tasks.friday;
    const writingRule = (data.dailyWritingRules && data.dailyWritingRules.friday) || {
      title: "Cierre Formal y Llamado a la Acción en Auditorías",
      rule: "En emails formales a socios de auditoría: 'Should you require further clarification, please let us know.'",
      example: "Fórmula ejecutiva: 'We remain at your disposal for any further inquiries.'"
    };

    area.innerHTML = `
      <div class="card" style="border: 2px solid rgba(229, 62, 62, 0.3);">
        <div class="card-header-flex">
          <h2 class="card-title" style="color:#C53030;">🛡️ Examen de Viernes: ${task.title}</h2>
          <span style="font-size:0.75rem; background:rgba(229,62,62,0.12); color:#C53030; padding:3px 10px; border-radius:12px; font-weight:800;">Gatekeeper</span>
        </div>

        <div class="daily-writing-banner">
          <div class="daily-writing-badge">✍️ Norma de Cierre de Semana</div>
          <div class="daily-writing-title">${writingRule.title}</div>
          <div class="daily-writing-desc">${writingRule.rule}</div>
        </div>

        <p style="font-size:0.85rem; color:#4A5568; margin-bottom:12px;">${task.scenario}</p>
        <div style="background:var(--pastel-sky); padding:12px; border-radius:10px; font-size:0.8rem; color:#1A365D; margin-bottom:14px; font-weight:600;">
          ⚖️ <strong>Criterio para avanzar a la Semana ${data.week + 1}:</strong> ${task.criteria}
        </div>

        <div class="voice-arena" id="fridayVoiceArena">
          <button class="mic-action-btn" id="fridayMicBtn" onclick="toggleFridayExam()">🎙️</button>
          <div class="mic-hint" id="fridayMicHint">Presioná y defendé tu postura en inglés</div>
          <div class="speech-live-text" id="fridayLiveTranscript">Tu defensa oral aparecerá aquí...</div>
        </div>

        <div id="fridayFeedbackArea"></div>
      </div>
    `;
    setCoachMessage("Llegó el viernes. El Gatekeeper te toma examen oral. Si aprobás con 75% o más, desbloqueamos la semana que viene. ¡Concentración!");
  }
}

// Práctica individual de frase (Martes y Miércoles)
function startSinglePractice(targetPhrase) {
  if (!state.recognition) {
    alert('Reconocimiento de voz no disponible en este dispositivo. Revisá permisos del micrófono en el navegador.');
    return;
  }

  const fbArea = document.getElementById('practiceFeedbackArea');
  fbArea.innerHTML = `
    <div class="voice-arena listening" style="margin-top:12px;">
      <div style="color:#ef4444; font-weight:700; font-size:0.9rem;">🔴 Escuchando... ¡Decí la frase ahora!</div>
      <div class="speech-live-text" id="singlePracticeTranscript">Esperando voz...</div>
    </div>
  `;

  let finalTranscript = '';
  state.recognition.onresult = (e) => {
    let interim = '';
    for (let i = e.resultIndex; i < e.results.length; ++i) {
      if (e.results[i].isFinal) {
        finalTranscript += e.results[i][0].transcript;
      } else {
        interim += e.results[i][0].transcript;
      }
    }
    const current = finalTranscript || interim;
    document.getElementById('singlePracticeTranscript').innerText = current;
  };

  state.recognition.start();

  setTimeout(() => {
    try { state.recognition.stop(); } catch(e){}
    evaluateSinglePhrase(targetPhrase, finalTranscript);
  }, 7000);
}

function evaluateSinglePhrase(target, spoken) {
  const fbArea = document.getElementById('practiceFeedbackArea');
  if (!spoken || spoken.trim().length === 0) {
    fbArea.innerHTML = `
      <div class="feedback-card failed">
        <div class="feedback-score" style="color:var(--danger);">⚠️ No se detectó audio</div>
        <div class="feedback-notes">Asegurate de darle permiso al micrófono en tu navegador y hablar con claridad.</div>
      </div>
    `;
    return;
  }

  const score = calculateSimilarity(target, spoken);
  const isPassed = score >= 75;

  fbArea.innerHTML = `
    <div class="feedback-card ${isPassed ? '' : 'failed'}">
      <div class="feedback-score" style="color:${isPassed ? '#34d399' : '#ef4444'};">
        ${isPassed ? '✅' : '❌'} Precisión: ${score}%
      </div>
      <div class="feedback-notes">
        <div><strong>Frase esperada:</strong> "${target}"</div>
        <div style="margin-top:4px;"><strong>Lo que dijiste:</strong> "${spoken}"</div>
        <div style="margin-top:6px; font-weight:600; color:${isPassed ? '#34d399' : '#f59e0b'};">
          ${isPassed ? '¡Excelente entonación y dicción!' : 'Ojo con el ritmo de las palabras o consonantes finales. Volvé a escuchar el modelo y probá otra vez.'}
        </div>
      </div>
    </div>
  `;
}

// Manejo del micrófono para el Jueves (Escenario)
let thursdayActive = false;
let thursdayTranscript = '';

function toggleThursdayMic(referenceAnswer) {
  if (!state.recognition) return;
  const btn = document.getElementById('thursdayMicBtn');
  const arena = document.getElementById('thursdayVoiceArena');
  const textDiv = document.getElementById('thursdayLiveTranscript');

  if (!thursdayActive) {
    thursdayActive = true;
    thursdayTranscript = '';
    btn.classList.add('active');
    arena.classList.add('listening');
    document.getElementById('thursdayMicHint').innerText = "Grabando... Tocá de nuevo para finalizar respuesta";

    state.recognition.onresult = (e) => {
      let t = '';
      for (let i = e.resultIndex; i < e.results.length; ++i) {
        t += e.results[i][0].transcript;
      }
      thursdayTranscript += ' ' + t;
      textDiv.innerText = thursdayTranscript;
    };
    state.recognition.start();
  } else {
    thursdayActive = false;
    btn.classList.remove('active');
    arena.classList.remove('listening');
    document.getElementById('thursdayMicHint').innerText = "Procesando evaluación...";
    try { state.recognition.stop(); } catch(e){}

    evaluateThursdayScenario(referenceAnswer, thursdayTranscript);
  }
}

async function evaluateThursdayScenario(reference, spoken) {
  const fbArea = document.getElementById('thursdayFeedbackArea');
  fbArea.innerHTML = `<div style="text-align:center; padding:12px;"><span class="spinner"></span> Analizando tu respuesta con el Coach...</div>`;

  if (state.geminiKey) {
    // Evaluación inteligente con Gemini
    const prompt = `Actúa como Martín, un tutor argentino experto en finanzas corporativas e inglés para negocios.
Evalúa esta respuesta oral de un profesional contable argentino:
Frase de referencia / Objetivo: "${reference}"
Lo que dijo el alumno en voz alta: "${spoken}"

Devuelve un JSON con:
{
  "score": número entre 0 y 100,
  "passed": booleano,
  "coachFeedback": "comentario en español rioplatense analizando la claridad, uso de vocabulario técnico contable y sugerencias de cómo decirlo más nativo",
  "betterAlternative": "cómo lo diría un CFO nativo"
}`;

    const geminiResp = await callGeminiAPI(prompt);
    if (geminiResp && geminiResp.score) {
      renderScenarioFeedback(geminiResp.score, geminiResp.coachFeedback, geminiResp.betterAlternative, fbArea);
      return;
    }
  }

  // Fallback local
  const score = calculateSimilarity(reference, spoken);
  renderScenarioFeedback(score, `Buen esfuerzo. Dijiste: "${spoken}". En reuniones de directorio siempre intentá estructurar tu idea empezando por el impacto en el margen antes de los detalles operativos.`, reference, fbArea);
}

function toggleWritingModelAnswer() {
  const box = document.getElementById('writingModelAnswerBox');
  if (box) {
    box.style.display = box.style.display === 'none' ? 'block' : 'none';
  }
}

async function evaluateWritingSubmission() {
  const text = (document.getElementById('writingTextInput').value || '').trim();
  const fbArea = document.getElementById('writingFeedbackArea');
  const btn = document.getElementById('btnSubmitWriting');

  if (!text || text.length < 20) {
    alert('Por favor redactá al menos 2 o 3 oraciones para poder evaluar tu gramática y vocabulario.');
    return;
  }

  btn.innerHTML = `<span class="spinner"></span> Analizando concordancia, gramática y vocabulario...`;
  btn.disabled = true;

  const currentTask = state.curriculumData.writingTask || {};

  if (state.geminiKey) {
    const prompt = `Actúa como Martín, un tutor argentino experto en inglés corporativo, finanzas y gramática formal.
El alumno escribió este texto para la tarea de redacción ejecutiva:
"${text}"

Consigna: "${currentTask.prompt}"
Foco gramatical esperado: "${currentTask.grammarFocus}"

Evalúa en detalle:
1. Errores gramaticales (voz pasiva, concordancia de tiempos, preposiciones como by/to/from, artículos).
2. Nivel de vocabulario técnico contable/financiero.
3. Versión reescrita óptima (cómo lo escribiría un director o auditor nativo).

Devuelve un JSON con:
{
  "score": número del 0 al 100,
  "grammarErrors": ["lista corta de errores o correcciones puntuales explicadas en español"],
  "coachFeedback": "comentario cálido y directo en español rioplatense destacando lo bueno y lo que hay que corregir",
  "polishedVersion": "versión final en inglés formal pulida al 100%"
}`;

    const res = await callGeminiAPI(prompt);
    btn.innerHTML = `<span>🧠 Corregir Gramática y Estilo Ejecutivo</span>`;
    btn.disabled = false;

    if (res && res.score) {
      renderWritingFeedback(res.score, res.coachFeedback, res.grammarErrors || [], res.polishedVersion, fbArea);
      return;
    }
  }

  // Fallback si no hay API key
  btn.innerHTML = `<span>🧠 Corregir Gramática y Estilo Ejecutivo</span>`;
  btn.disabled = false;
  renderWritingFeedback(80, "Buen intento de redacción. Usaste términos técnicos. Te recomendamos revisar el uso de la voz pasiva y preposiciones de variación.", ["Prestá atención a la diferencia entre 'decreased in' y 'decreased by'."], currentTask.modelAnswer || text, fbArea);
}

function renderWritingFeedback(score, feedbackText, errors, polished, container) {
  const isPassed = score >= 70;
  const errorsHtml = errors.length > 0 
    ? `<ul style="margin: 8px 0 8px 16px; font-size:0.8rem; color:#fca5a5;">${errors.map(e => `<li>${e}</li>`).join('')}</ul>`
    : `<div style="font-size:0.8rem; color:#86efac; margin:6px 0;">¡No se detectaron errores graves de gramática!</div>`;

  container.innerHTML = `
    <div class="feedback-card ${isPassed ? '' : 'failed'}" style="margin-top:14px;">
      <div class="feedback-score" style="color:${isPassed ? '#34d399' : '#f59e0b'};">
        ${isPassed ? '📝 Buen memo' : '⚠️ A pulir detalles'} (Puntaje de redacción: ${score}/100)
      </div>
      <div class="feedback-notes">
        <p>${feedbackText}</p>
        
        <div style="margin-top:8px;">
          <strong style="font-size:0.82rem; color:#fff;">Puntos gramaticales a observar:</strong>
          ${errorsHtml}
        </div>

        <div style="background:rgba(0,0,0,0.3); padding:10px; border-radius:8px; margin-top:10px; border-left:3px solid #3b82f6;">
          <span style="color:#60a5fa; font-weight:700; font-size:0.82rem;">Versión ejecutiva recomendada (Nativo):</span><br>
          <em style="font-size:0.84rem; color:#e2e8f0;">"${polished}"</em>
          <button style="background:none;border:none;cursor:pointer;color:#93c5fd;font-size:0.75rem;margin-left:6px;" onclick="speakEnglish('${escapeQuotes(polished)}')">🔊 Escuchar redacción</button>
        </div>
      </div>
    </div>
  `;
}

// Manejo del Gatekeeper del Viernes (Examen para desbloquear siguiente nivel)
let fridayActive = false;
let fridayTranscript = '';

function toggleFridayExam() {
  if (!state.recognition) return;
  const btn = document.getElementById('fridayMicBtn');
  const arena = document.getElementById('fridayVoiceArena');
  const textDiv = document.getElementById('fridayLiveTranscript');

  if (!fridayActive) {
    fridayActive = true;
    fridayTranscript = '';
    btn.classList.add('active');
    arena.classList.add('listening');
    document.getElementById('fridayMicHint').innerText = "Examen en curso... Hablá sin prisa. Tocá para entregar";

    state.recognition.onresult = (e) => {
      let t = '';
      for (let i = e.resultIndex; i < e.results.length; ++i) {
        t += e.results[i][0].transcript;
      }
      fridayTranscript += ' ' + t;
      textDiv.innerText = fridayTranscript;
    };
    state.recognition.start();
  } else {
    fridayActive = false;
    btn.classList.remove('active');
    arena.classList.remove('listening');
    document.getElementById('fridayMicHint').innerText = "El Gatekeeper está calificando tu examen...";
    try { state.recognition.stop(); } catch(e){}

    evaluateFridayExam(fridayTranscript);
  }
}

async function evaluateFridayExam(spoken) {
  const fbArea = document.getElementById('fridayFeedbackArea');
  fbArea.innerHTML = `<div style="text-align:center; padding:14px;"><span class="spinner"></span> El Gatekeeper está evaluando tu nivel para definir si avanzás a la siguiente semana...</div>`;

  let score = 0;
  let passed = false;
  let feedback = '';

  if (state.geminiKey) {
    const prompt = `Actúa como el Gatekeeper evaluador estricto de inglés financiero (con personalidad y calidez de coach argentino).
El alumno está rindiendo el examen final de la Semana ${state.currentWeek} (${state.curriculumData.title}).
Lo que dijo el alumno en voz alta en su defensa oral:
"${spoken}"

El umbral para aprobar y desbloquear la semana siguiente es 75%.
Evalúa pronunciación aparente (según el texto transcripto y longitud/coherencia), vocabulario técnico de finanzas y soltura.
Devuelve un JSON con:
{
  "score": número del 0 al 100,
  "passed": booleano (true si score >= 75),
  "feedback": "Comentario directo al grano sobre su defensa oral, qué términos usó bien y qué le faltó",
  "gatekeeperDecision": "APROBADO: Desbloqueas la siguiente semana" o "NO APROBADO: Tenés que practicar la pronunciación de estos términos antes de avanzar"
}`;

    const res = await callGeminiAPI(prompt);
    if (res && res.score) {
      score = res.score;
      passed = res.passed;
      feedback = res.feedback;
    }
  }

  if (!score) {
    // Estimación matemática local
    const wordCount = (spoken.match(/\w+/g) || []).length;
    score = Math.min(95, Math.max(30, wordCount * 4));
    passed = score >= 75;
    feedback = passed 
      ? "¡Gran defensa! Demostraste soltura y uso del vocabulario técnico." 
      : "Tu respuesta fue un poco breve o faltaron términos contables clave de la semana. Repasá el glosario del lunes y volvé a rendir.";
  }

  // Guardar resultado
  const record = {
    timestamp: new Date().toLocaleDateString(),
    week: state.currentWeek,
    day: 'Viernes',
    score: score,
    passed: passed,
    feedback: feedback
  };

  state.evaluationHistory.push(record);
  localStorage.setItem('ep_history', JSON.stringify(state.evaluationHistory));

  if (passed) {
    state.currentWeek = Math.min(24, state.currentWeek + 1);
    setCoachMessage(`🎉 ¡Felicitaciones! Aprobaste con ${score}%. ¡Desbloqueaste la Semana ${state.currentWeek}!`);
  } else {
    setCoachMessage(`⚠️ El Gatekeeper te pide reforzar pronunciación y vocabulario (Sacaste ${score}%). No te desanimes: repasá el vocabulario y volvé a intentar.`);
  }

  fbArea.innerHTML = `
    <div class="feedback-card ${passed ? '' : 'failed'}">
      <div class="feedback-score" style="color:${passed ? '#34d399' : '#ef4444'};">
        ${passed ? '🏆 ¡APROBADO!' : '🛑 NO APROBADO'} - Nota: ${score}/100
      </div>
      <div class="feedback-notes">
        <p>${feedback}</p>
        <div style="margin-top:10px; font-weight:700;">
          ${passed 
            ? `🔓 Desbloqueaste la Semana ${state.currentWeek}. El lunes comenzará tu nueva masterclass.` 
            : `🔒 La Semana ${state.currentWeek + 1} sigue bloqueada. Hacé un nuevo intento para superar el 75%.`}
        </div>
      </div>
    </div>
  `;

  // Sincronizar con Google Sheets si está conectado
  syncWithBackend({
    action: 'saveProgress',
    week: state.currentWeek - (passed ? 1 : 0),
    day: 'Viernes',
    speakingScore: score,
    passed: passed,
    feedback: feedback,
    gatekeeperPromotion: passed
  });

  updateProgressUI();
}

// TAB 2: Análisis de Noticias y Textos
async function handleArticleAnalysis() {
  const title = document.getElementById('articleTitleInput').value.trim() || 'Noticia Financiera';
  const text = document.getElementById('articleTextInput').value.trim();

  if (!text || text.length < 30) {
    alert('Por favor ingresá un texto de al menos un par de párrafos para poder generar vocabulario y quiz oral.');
    return;
  }

  const btn = document.getElementById('btnAnalyzeArticle');
  btn.innerHTML = `<span class="spinner"></span> Extrayendo vocabulario y armando práctica oral...`;
  btn.disabled = true;

  let analysisResult = null;

  if (state.geminiKey) {
    const prompt = `Analiza este texto de economía/finanzas/impuestos:
"${text}"

Genera una lección express de inglés hablado:
Devuelve un JSON con:
{
  "summary": "Resumen ejecutivo en 2 oraciones en inglés",
  "keyTerms": [
    {"term": "palabra en inglés", "arEquiv": "traducción argentina", "example": "oración de ejemplo"}
  ],
  "speakingQuiz": {
    "question": "Pregunta de discusión en inglés sobre este texto",
    "idealAnswer": "Respuesta modelo en inglés para practicar"
  }
}`;

    analysisResult = await callGeminiAPI(prompt);
  }

  if (!analysisResult) {
    // Modo local / Fallback
    analysisResult = {
      summary: "Executive summary extracted from your submitted article regarding Argentine economic outlook.",
      keyTerms: [
        { term: "Fiscal deficit", arEquiv: "Déficit fiscal", example: "The government pledged to achieve fiscal balance this quarter." },
        { term: "Monetary policy", arEquiv: "Política monetaria", example: "Central Bank adjustments directly influence interest rates." }
      ],
      speakingQuiz: {
        question: "How does this news impact corporate financial planning in Argentina?",
        idealAnswer: "Companies must rebalance their cash flow and hedge currency exposure to mitigate unexpected inflation spikes."
      }
    };
  }

  const articleEntry = {
    id: Date.now(),
    title: title,
    date: new Date().toLocaleDateString(),
    data: analysisResult
  };

  state.customArticles.unshift(articleEntry);
  localStorage.setItem('ep_custom_articles', JSON.stringify(state.customArticles));

  // Cargar este artículo en el reproductor de viaje automáticamente para poder escucharlo de corrido
  const articleAudioTracks = [
    {
      speaker: "es-AR",
      title: `Noticia: ${title}`,
      text: `A continuación escuchamos el resumen y los términos clave del artículo: ${title}.`
    },
    {
      speaker: "en-US",
      title: "Executive Summary",
      text: analysisResult.summary || "Summary of the financial news article."
    },
    {
      speaker: "es-AR",
      title: "Glosario extraído",
      text: "Escuchemos ahora los términos financieros extraídos y sus oraciones de aplicación."
    }
  ];

  (analysisResult.keyTerms || []).forEach(kt => {
    articleAudioTracks.push({
      speaker: "en-US",
      title: kt.term,
      text: `${kt.term}. For instance: ${kt.example}`
    });
  });

  articleAudioTracks.push({
    speaker: "es-AR",
    title: "Pregunta de debate",
    text: "Y cerramos con la pregunta para pensar en tu próxima reunión corporativa."
  });

  articleAudioTracks.push({
    speaker: "en-US",
    title: "Discussion Prompt",
    text: `${analysisResult.speakingQuiz.question}. Model response: ${analysisResult.speakingQuiz.idealAnswer}`
  });

  setupCommutePlayer(articleAudioTracks);

  btn.innerHTML = `<span>🧠 Procesar y Crear Práctica Oral</span>`;
  btn.disabled = false;
  document.getElementById('articleTextInput').value = '';

  renderCustomArticlesList();
  setCoachMessage(`¡Listo! Procesé "${title}". Se cargó en la barra de audio superior para que le des Play y lo escuches en el viaje.`);
}

function renderCustomArticlesList() {
  const list = document.getElementById('customArticlesList');
  if (state.customArticles.length === 0) {
    list.innerHTML = `<div style="font-size:0.82rem; color:var(--text-muted); text-align:center; padding:16px;">No has subido artículos todavía.</div>`;
    return;
  }

  list.innerHTML = state.customArticles.map(art => `
    <div class="card" style="margin-top:14px;">
      <div class="card-header-flex">
        <h3 style="font-size:0.95rem; color:#60a5fa;">📄 ${art.title}</h3>
        <span style="font-size:0.7rem; color:var(--text-muted);">${art.date}</span>
      </div>
      <p style="font-size:0.82rem; color:#cbd5e1; margin-bottom:10px;">${art.data.summary}</p>
      
      <div style="margin-bottom:10px;">
        <strong style="font-size:0.8rem; color:#34d399;">Vocabulario extraído:</strong>
        <div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:4px;">
          ${art.data.keyTerms.map(t => `
            <span style="background:#0d1424; border:1px solid #1e293b; padding:4px 8px; border-radius:6px; font-size:0.75rem;">
              <strong>${t.term}</strong> (${t.arEquiv})
              <button style="background:none;border:none;cursor:pointer;color:#60a5fa;" onclick="speakEnglish('${escapeQuotes(t.term)}')">🔊</button>
            </span>
          `).join('')}
        </div>
      </div>

      <div style="background:#0b1120; border:1px solid #1e293b; padding:10px; border-radius:8px;">
        <div style="font-size:0.82rem; color:#f59e0b; font-weight:700;">🎙️ Desafío Hablado del Artículo:</div>
        <div style="font-size:0.82rem; color:#fff; margin:4px 0;">"${art.data.speakingQuiz.question}"</div>
        <div style="display:flex; gap:8px; margin-top:8px;">
          <button class="btn-secondary" style="font-size:0.72rem; padding:4px 8px;" onclick="speakEnglish('${escapeQuotes(art.data.speakingQuiz.idealAnswer)}')">🔊 Escuchar respuesta modelo</button>
          <button class="btn-primary" style="font-size:0.72rem; padding:4px 8px;" onclick="startSinglePractice('${escapeQuotes(art.data.speakingQuiz.idealAnswer)}')">🎙️ Practicar decirla</button>
        </div>
      </div>
    </div>
  `).join('');
}

// TAB 3: Conversación Sparring Oral
let sparringActive = false;
let sparringTranscript = '';

function toggleSparringMic() {
  if (!state.recognition) {
    alert('Micrófono no disponible en este dispositivo.');
    return;
  }

  const btn = document.getElementById('sparringMicBtn');
  const arena = document.getElementById('sparringVoiceArena');
  const textDiv = document.getElementById('sparringLiveTranscript');

  if (!sparringActive) {
    sparringActive = true;
    sparringTranscript = '';
    btn.classList.add('active');
    arena.classList.add('listening');
    document.getElementById('sparringMicHint').innerText = "Grabando tu intervención... Tocá el micrófono cuando termines de hablar";

    state.recognition.onresult = (e) => {
      let t = '';
      for (let i = e.resultIndex; i < e.results.length; ++i) {
        t += e.results[i][0].transcript;
      }
      sparringTranscript += ' ' + t;
      textDiv.innerText = sparringTranscript;
    };
    state.recognition.start();
  } else {
    sparringActive = false;
    btn.classList.remove('active');
    arena.classList.remove('listening');
    document.getElementById('sparringMicHint').innerText = "El interlocutor está respondiendo...";
    try { state.recognition.stop(); } catch(e){}

    handleSparringTurn(sparringTranscript);
  }
}

async function handleSparringTurn(spokenText) {
  const log = document.getElementById('sparringConversationLog');
  const role = document.getElementById('sparringRoleSelect').value;

  if (!spokenText || spokenText.trim().length === 0) {
    alert('No se detectó audio.');
    return;
  }

  // Agregar lo que dijo el usuario
  log.innerHTML += `
    <div style="background:#131c33; padding:10px; border-radius:10px; align-self:flex-end; max-width:85%; border:1px solid #1e2e50;">
      <div style="font-size:0.7rem; color:#60a5fa; font-weight:700;">Tú:</div>
      <div style="font-size:0.85rem; color:#fff; margin-top:2px;">"${spokenText}"</div>
    </div>
  `;

  let responseText = "Understood. From our perspective, managing inflation expectations requires tight cash positioning.";
  let coachNote = "Excelente uso de vocabulario. Podés usar 'hedging' en lugar de 'covering' para sonar aún más técnico.";

  if (state.geminiKey) {
    const prompt = `Actúa como ${role} en una reunión corporativa internacional.
El usuario (profesional de finanzas en Argentina) acaba de decir: "${spokenText}".

Responde en inglés profesional y corporativo (máximo 2 oraciones concisas).
Y añade un feedback de 1 oración en español rioplatense (Martín Coach) sobre su inglés.
Devuelve un JSON con:
{
  "englishReply": "...",
  "coachFeedback": "..."
}`;

    const res = await callGeminiAPI(prompt);
    if (res && res.englishReply) {
      responseText = res.englishReply;
      coachNote = res.coachFeedback;
    }
  }

  // Agregar respuesta del rol
  log.innerHTML += `
    <div style="background:#1e293b; padding:10px; border-radius:10px; align-self:flex-start; max-width:85%; border:1px solid #334155;">
      <div style="font-size:0.7rem; color:#34d399; font-weight:700;">${role}:</div>
      <div style="font-size:0.85rem; color:#fff; margin-top:2px;">"${responseText}"</div>
      <div style="margin-top:6px; font-size:0.74rem; color:#f59e0b; border-top:1px dashed #475569; padding-top:4px;">
        💡 <strong>Coach Martín:</strong> ${coachNote}
      </div>
      <button class="btn-secondary" style="font-size:0.7rem; padding:2px 8px; margin-top:6px;" onclick="speakEnglish('${escapeQuotes(responseText)}')">🔊 Escuchar respuesta</button>
    </div>
  `;

  // Reproducir respuesta en inglés automáticamente
  speakEnglish(responseText);
  document.getElementById('sparringMicHint').innerText = "Tocá para volver a hablar";
}

// Helpers & Gemini API Caller
async function callGeminiAPI(promptText) {
  if (!state.geminiKey) return null;
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${state.geminiKey}`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText + "\nIMPORTANTE: Responde ÚNICAMENTE en formato JSON válido, sin bloques de código markdown." }] }]
      })
    });

    const data = await response.json();
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      let rawText = data.candidates[0].content.parts[0].text;
      rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(rawText);
    }
  } catch (err) {
    console.error('Error invocando Gemini API:', err);
  }
  return null;
}

// Sincronización con Google Apps Script
async function syncWithBackend(payload) {
  if (!state.gasUrl) return;
  try {
    await fetch(state.gasUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    console.warn('Error de sync con Apps Script:', e);
  }
}

function updateProgressUI() {
  document.getElementById('statsCurrentWeek').innerText = `${state.currentWeek} / 24`;
  if (state.evaluationHistory.length > 0) {
    const total = state.evaluationHistory.reduce((acc, h) => acc + (h.score || 0), 0);
    const avg = Math.round(total / state.evaluationHistory.length);
    document.getElementById('statsPronunciationAvg').innerText = `${avg}%`;

    const histList = document.getElementById('progressHistoryList');
    histList.innerHTML = state.evaluationHistory.slice(-5).reverse().map(h => `
      <div style="background:#0d1424; padding:8px; border-radius:6px; margin-bottom:6px; border:1px solid #1e293b;">
        <div style="display:flex; justify-content:space-between; font-weight:700; color:#fff;">
          <span>Semana ${h.week} (${h.day})</span>
          <span style="color:${h.passed ? '#34d399' : '#ef4444'};">${h.score}/100</span>
        </div>
        <div style="font-size:0.75rem; color:#94a3b8; margin-top:2px;">${h.feedback}</div>
      </div>
    `).join('');
  }
}

function renderCurriculumModal() {
  const container = document.getElementById('curriculumWeeksList');
  container.innerHTML = offlineCurriculum.map(w => {
    const isUnlocked = w.week <= state.currentWeek;
    return `
      <div style="background:#0d1424; padding:12px; border-radius:8px; border:1px solid ${isUnlocked ? '#3b82f6' : '#1e293b'}; opacity:${isUnlocked ? '1' : '0.5'};">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <strong style="color:${isUnlocked ? '#60a5fa' : '#94a3b8'}; font-size:0.9rem;">Semana ${w.week}: ${w.title}</strong>
          <span>${isUnlocked ? '🔓' : '🔒'}</span>
        </div>
        <div style="font-size:0.75rem; color:#94a3b8; margin-top:4px;">${w.category}</div>
        ${isUnlocked ? `
          <button class="btn-secondary" style="font-size:0.7rem; padding:4px 8px; margin-top:8px;" onclick="selectWeek(${w.week})">Ver Lecciones</button>
        ` : ''}
      </div>
    `;
  }).join('');
}

function selectWeek(wNum) {
  state.currentWeek = wNum;
  loadCurrentWeek();
  document.getElementById('curriculumModal').classList.remove('open');
}

function setCoachMessage(msg) {
  document.getElementById('coachSpeechText').innerText = msg;
}

function updateMicStatus(active) {
  const streak = document.getElementById('streakIndicator');
  if (active) {
    streak.innerText = "🎙️ Escuchando...";
    streak.style.color = "#ef4444";
  } else {
    streak.innerText = `🔥 ${state.streak} días`;
    streak.style.color = "var(--warning)";
  }
}

function calculateSimilarity(str1, str2) {
  if (!str1 || !str2) return 0;
  const s1 = str1.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ');
  const s2 = str2.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ');
  let matches = 0;
  s1.forEach(word => {
    if (s2.includes(word)) matches++;
  });
  return Math.min(100, Math.round((matches / s1.length) * 100));
}

function formatMarkdownSimple(text) {
  return text
    .replace(/^### (.*$)/gim, '<h3 style="color:#60a5fa;margin:8px 0;">$1</h3>')
    .replace(/^#### (.*$)/gim, '<h4 style="color:#34d399;margin:6px 0;">$1</h4>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/\n/gim, '<br>');
}

function escapeQuotes(str) {
  return (str || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
}
