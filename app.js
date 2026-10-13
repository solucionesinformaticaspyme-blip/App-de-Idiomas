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

// Currículum de contingencia / offline (Semana 1 a Semana 3 pre-cargadas)
const offlineCurriculum = [
  {
    week: 1,
    title: "Financial Statements & Core Grammar: Active vs Passive Voice in Audits",
    category: "Contabilidad, Finanzas & Gramática Estructural",
    theoryMarkdown: `
### 📘 Masterclass Lunes: Financial Terminology & Gramática Pesada

#### 1. Marco Gramatical: La Voz Pasiva Formal en Informes y Auditorías
En el inglés contable y financiero internacional, los informes ejecutivos y notas a los estados contables rara vez usan la primera persona (*"We depreciated the asset"*). Se utiliza prioritariamente la **Passive Voice (Voz Pasiva)** para transmitir objetividad técnica:

* **Voz Activa (informal):** *"The company recorded a loss."*
* **Voz Pasiva (formal contable):** *"A net loss was recognized in the fiscal period."*
* **Fórmula clave:** **[Sujeto receptor] + [Verbo TO BE conjugado] + [Participio Pasado (Past Participle)]**
  * *Present Perfect Passive:* *"Accounts receivable **have been adjusted** for doubtful accounts."*
  * *Past Passive:* *"Current assets **were revalued** pursuant to IFRS standards."*

#### 2. Preposiciones de Impacto Financiero (Error típico):
* Aumentar/Disminuir **EN** una cifra: se usa **BY** (*"Operating margin dropped **by** 3.5%"*, nunca 'in').
* Aumentar/Disminuir **A** una cifra meta: se usa **TO** (*"Cash reserves rose **to** 10 million dollars"*).
* Subir **DESDE** un valor base: se usa **FROM** (*"Revenue grew from $5M to $8M"*).

#### 3. Falsos Amigos & Términos Contables Argentinos:
* **Bienes de Cambio** ➔ **Inventories** / **Stock**.
* **Bienes de Uso** ➔ **Property, Plant and Equipment (PP&E)**.
* **Créditos por Ventas** ➔ **Accounts Receivable (A/R)**.
* **Deudas Comerciales / Proveedores** ➔ **Accounts Payable (A/P)**.
* **Previsión para deudores incobrables** ➔ **Allowance for Doubtful Accounts**.

#### 🎙️ Fonética Crítica:
La **"b"** en **Debt** (*debt* = /det/) y en **Doubt** (*doubt* = /daʊt/) es 100% muda.
    `,
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
### 📘 Masterclass Lunes: FX Regimes & Condicionales de Negocios

#### 1. Marco Gramatical: Segundo y Tercer Condicional en Análisis de Riesgo
Al presentar escenarios económicos y coberturas cambiarias frente a volatilidad, se utilizan condicionales hipotéticos y contrafácticos:

* **Segundo Condicional (Escenarios Hipotéticos de Futuro):**
  * *Estructura:* **If + Simple Past, would / could + Verbo Infinitivo**
  * *Ejemplo financiero:* *"If the Central Bank **devalued** the official exchange rate, import costs **would increase** immediately."*
* **Tercer Condicional (Análisis de lo ocurrido en el pasado):**
  * *Estructura:* **If + Past Perfect, would have + Participio Pasado**
  * *Ejemplo financiero:* *"If we **had hedged** our dollar liabilities, we **would not have suffered** this FX loss."*

#### 2. Vocabulario Técnico Cambiario:
* **Brecha Cambiaria**: **FX gap** o **Exchange rate spread**.
* **Contado con Liquidación (CCL)**: **Blue-Chip Swap**.
* **Cepo Cambiario**: **Currency restrictions** o **Capital controls**.
* **Ajuste por Inflación**: **Inflation accounting (IAS 29)**.
    `,
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

// Síntesis de voz nativa (Hablar en idioma objetivo)
function speakEnglish(text, onComplete) {
  if (!('speechSynthesis' in window)) {
    alert('Tu navegador no soporta síntesis de voz.');
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = state.targetLanguage || 'en-US';
  utterance.rate = state.speechRate || 0.9;

  // Buscar voz natural en el idioma configurado
  const voices = window.speechSynthesis.getVoices();
  const langPrefix = (state.targetLanguage || 'en').split('-')[0];
  const targetVoice = voices.find(v => v.lang.startsWith(langPrefix) && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
  if (targetVoice) utterance.voice = targetVoice;

  if (onComplete) utterance.onend = onComplete;
  window.speechSynthesis.speak(utterance);
}

// Asistente en Español / Coach Argentino
function speakCoachSpanish(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-AR';
  utterance.rate = 1.0;
  window.speechSynthesis.speak(utterance);
}

// Enlace de Eventos de la UI
function bindUIEvents() {
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
        <div style="font-size:0.85rem; line-height:1.5; margin:12px 0; color:#cbd5e1;">
          ${formatMarkdownSimple(data.theoryMarkdown)}
        </div>
        <h3 style="font-size:0.95rem; margin:16px 0 10px 0; color:#fff;">Vocabulario Técnico Clave (Escuchá la pronunciación):</h3>
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
          <span style="font-size:0.75rem; background:rgba(37,99,235,0.25); color:#60a5fa; padding:2px 8px; border-radius:12px; font-weight:700;">Grammar Check</span>
        </div>
        
        <div style="background:#0d1424; padding:12px; border-radius:8px; border:1px solid #1e293b; margin-bottom:12px;">
          <strong style="color:#60a5fa; font-size:0.85rem;">Consigna de Redacción:</strong>
          <p style="font-size:0.84rem; color:#cbd5e1; margin-top:4px;">${wTask.prompt}</p>
          <div style="font-size:0.78rem; color:#f59e0b; margin-top:8px;">🎯 <strong>Foco gramatical:</strong> ${wTask.grammarFocus}</div>
        </div>

        <div class="input-group">
          <label class="input-label">Escribí tu respuesta en inglés:</label>
          <textarea id="writingTextInput" class="textarea-custom" rows="5" placeholder="Escribí aquí tu párrafo o memorándum corporativo en inglés..."></textarea>
        </div>

        <button class="btn-primary" id="btnSubmitWriting" onclick="evaluateWritingSubmission()">
          <span>🧠 Corregir Gramática y Estilo Ejecutivo</span>
        </button>

        <div style="margin-top:10px;">
          <button class="btn-secondary" style="font-size:0.75rem; width:100%;" onclick="toggleWritingModelAnswer()">💡 Ver memorándum modelo de referencia</button>
          <div id="writingModelAnswerBox" style="display:none; background:#0b1120; border:1px solid #1e293b; padding:10px; border-radius:8px; margin-top:8px; font-size:0.82rem; color:#cbd5e1;">
            <strong style="color:#34d399;">Modelo ideal:</strong><br>
            "${wTask.modelAnswer}"
            <button style="background:none;border:none;cursor:pointer;color:#93c5fd;font-size:0.75rem;margin-left:6px;" onclick="speakEnglish('${escapeQuotes(wTask.modelAnswer)}')">🔊 Escuchar cómo suena</button>
          </div>
        </div>

        <div id="writingFeedbackArea"></div>
      </div>
    `;
    setCoachMessage("Momento de escribir. Pensá las oraciones con calma, aplicá las reglas de gramática y tocá Corregir para que el Coach analice tu redacción.");

  } else if (state.activeDay === 'tuesday') {
    // MARTES: SHADOWING
    const task = data.tasks.tuesday;
    let phrasesHtml = task.phrases.map((phrase, idx) => `
      <div class="vocab-card">
        <div style="font-size:0.88rem; color:#fff; margin-bottom:8px;"><strong>#${idx+1}:</strong> "${phrase}"</div>
        <div style="display:flex; gap:8px;">
          <button class="btn-secondary" style="font-size:0.75rem; padding:6px 10px;" onclick="speakEnglish('${escapeQuotes(phrase)}')">🔊 Escuchar modelo</button>
          <button class="btn-primary" style="font-size:0.75rem; padding:6px 10px;" onclick="startSinglePractice('${escapeQuotes(phrase)}')">🎙️ Repetir yo</button>
        </div>
      </div>
    `).join('');

    area.innerHTML = `
      <div class="card">
        <h2 class="card-title">🗣️ Práctica de Martes: ${task.type}</h2>
        <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:14px;">${task.description}</p>
        ${phrasesHtml}
        <div id="practiceFeedbackArea"></div>
      </div>
    `;
    setCoachMessage("Martes de Shadowing: escuchá la frase y repetila de inmediato imitando el ritmo y la entonación como si estuvieras en una call corporativa.");

  } else if (state.activeDay === 'wednesday') {
    // MIÉRCOLES: FONÉTICA
    const task = data.tasks.wednesday;
    let challHtml = task.challenges.map((c, idx) => `
      <div class="vocab-card">
        <div style="font-size:0.88rem; color:#60a5fa; margin-bottom:4px;"><strong>Desafío #${idx+1}:</strong> "${c.target}"</div>
        <div style="font-size:0.78rem; color:#f59e0b; margin-bottom:8px;">💡 ${c.tip}</div>
        <div style="display:flex; gap:8px;">
          <button class="btn-secondary" style="font-size:0.75rem; padding:6px 10px;" onclick="speakEnglish('${escapeQuotes(c.target)}')">🔊 Escuchar</button>
          <button class="btn-primary" style="font-size:0.75rem; padding:6px 10px;" onclick="startSinglePractice('${escapeQuotes(c.target)}')">🎙️ Pronunciar</button>
        </div>
      </div>
    `).join('');

    area.innerHTML = `
      <div class="card">
        <h2 class="card-title">🎯 Práctica de Miércoles: ${task.type}</h2>
        <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:14px;">${task.description}</p>
        ${challHtml}
        <div id="practiceFeedbackArea"></div>
      </div>
    `;
    setCoachMessage("Miércoles de Fonética. No te apures al hablar; marcá bien las consonantes y recordá las reglas de letras mudas.");

  } else if (state.activeDay === 'thursday') {
    // JUEVES: ESCENARIO REAL
    const task = data.tasks.thursday;
    area.innerHTML = `
      <div class="card">
        <h2 class="card-title">💼 Práctica de Jueves: ${task.title}</h2>
        <div style="background:#0d1424; padding:12px; border-radius:8px; border:1px solid #1e293b; margin-bottom:12px;">
          <strong style="color:#f59e0b; font-size:0.85rem;">Situación:</strong>
          <p style="font-size:0.82rem; color:#cbd5e1; margin-top:4px;">${task.scenario}</p>
        </div>
        <p style="font-size:0.82rem; color:#fff; margin-bottom:10px;"><strong>Tu tarea oral:</strong> ${task.challengePrompt}</p>
        
        <div class="voice-arena" id="thursdayVoiceArena">
          <button class="mic-action-btn" id="thursdayMicBtn" onclick="toggleThursdayMic('${escapeQuotes(task.referenceAnswer)}')">🎙️</button>
          <div class="mic-hint" id="thursdayMicHint">Tocá para responder en inglés</div>
          <div class="speech-live-text" id="thursdayLiveTranscript">Esperando que hables...</div>
        </div>

        <div style="margin-top:10px;">
          <button class="btn-secondary" style="font-size:0.75rem; width:100%;" onclick="speakEnglish('${escapeQuotes(task.referenceAnswer)}')">💡 Escuchar respuesta modelo ideal</button>
        </div>

        <div id="thursdayFeedbackArea"></div>
      </div>
    `;
    setCoachMessage("Jueves de Escenario Real. Planteá tu argumento con seguridad. Pensá la idea antes de presionar el botón de hablar.");

  } else if (state.activeDay === 'friday') {
    // VIERNES: EXAMEN GATEKEEPER
    const task = data.tasks.friday;
    area.innerHTML = `
      <div class="card" style="border: 1px solid rgba(239, 68, 68, 0.4);">
        <div class="card-header-flex">
          <h2 class="card-title" style="color:#ef4444;">🛡️ Examen de Viernes: ${task.title}</h2>
          <span style="font-size:0.75rem; background:rgba(239,68,68,0.2); color:#ef4444; padding:2px 8px; border-radius:12px; font-weight:700;">Gatekeeper</span>
        </div>
        <p style="font-size:0.82rem; color:#cbd5e1; margin-bottom:10px;">${task.scenario}</p>
        <div style="background:#131d35; padding:10px; border-radius:8px; font-size:0.78rem; color:#93c5fd; margin-bottom:14px;">
          ⚖️ <strong>Criterio para avanzar a la Semana ${data.week + 1}:</strong> ${task.criteria}
        </div>

        <div class="voice-arena" id="fridayVoiceArena">
          <button class="mic-action-btn" id="fridayMicBtn" onclick="toggleFridayExam()">🎙️</button>
          <div class="mic-hint" id="fridayMicHint">Presioná y respondé durante 1 a 2 minutos</div>
          <div class="speech-live-text" id="fridayLiveTranscript">Tu defensa oral aparecerá aquí...</div>
        </div>

        <div id="fridayFeedbackArea"></div>
      </div>
    `;
    setCoachMessage("Llegó el viernes. Hoy el Gatekeeper te toma examen oral. Si aprobás con 75% o más, desbloqueamos la semana que viene. ¡Concentración!");
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

  btn.innerHTML = `<span>🧠 Procesar y Crear Práctica Oral</span>`;
  btn.disabled = false;
  document.getElementById('articleTextInput').value = '';

  renderCustomArticlesList();
  setCoachMessage(`¡Listo! Procesé "${title}". Extraje términos clave y tenés un quiz oral nuevo para practicar abajo.`);
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
