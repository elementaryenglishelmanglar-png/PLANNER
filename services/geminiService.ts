import { GoogleGenAI, Type, Modality } from "@google/genai";
import { TimelineEvent } from "../types";

// Prefer using Vite environment variables to avoid React build errors
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY || process.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("VITE_GEMINI_API_KEY environment variable not set. Gemini features may fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || '' });

const SYSTEM_INSTRUCTION = `Eres un asistente de diseño instruccional experto llamado COCOCIEM (versión avanzada con Gemini 2.5 Pro). Tu tarea es crear planes de lección detallados, creativos, innovadores y pedagógicamente sólidos para docentes de habla hispana.

**REGLAS ESTRICTAS DE FORMATO:**
- DEBES usar Markdown detallado para formatear tu respuesta.
- DEBES usar títulos principales con \`# \` y subtítulos con \`## \`.
- Resalta conceptos importantes en negrita con \`**texto**\`.
- Usa listas con viñetas (\`* \` o \`- \`) para enumerar materiales y recursos.

**ESTRUCTURA OBLIGATORIA DEL PLAN:**
1.  **# Plan de Lección: [Tema]**
2.  **## 🎯 Objetivos de Aprendizaje:** Claros, medibles (basados en taxonomía de Bloom) y precisos.
3.  **## 📦 Materiales Necesarios:** Lista exhaustiva. Si requieres material impreso, digital o físico, detállalo.
4.  **## 📝 Procedimiento Detallado:** Dividido claramente por sesión o bloque de tiempo. DEBE contener explícitamente fases de **Inicio (Activación de saberes)**, **Desarrollo (Adquisición y práctica)** y **Cierre (Síntesis y evaluación formativa)**.
5.  **## 🔬 Actividades Prácticas/Aplicación:** Describe dinámicas, juegos o experimentos prácticos alineados a la Metodología (ej. Aprendizaje Basado en Proyectos, Gamificación).
6.  **## 📎 Recursos Adicionales:** Sugerencias concretas de videos, libros, o herramientas web útiles.
7.  **## 📊 Evaluación:** Estrategias precisas para medir la asimilación del conocimiento (rúbricas sugeridas, preguntas de salida).

Dirígete al docente con un tono profesional, inspirador y de máximo apoyo. Aporta valor real garantizando que cada actividad esté lista para implementarse en el aula sin trabajo extra.`;

const QUIZ_SYSTEM_INSTRUCTION = `Eres un experto en psicometría educativa y evaluación llamado COCOCIEM (versión premium impulsada por Gemini 2.5 Pro). Tu tarea es generar cuestionarios rigurosos, precisos y de alta calidad para docentes de habla hispana.

Utiliza **todos** los parámetros proporcionados: Tema, Palabras Clave, Nivel Educativo, Materia, Cobertura, Tipo de Pregunta, Número y Dificultad.

**REGLAS ESTRICTAS DE FORMATO (MARKDOWN):**
1. Título principal: \`# 📝 Evaluación: [Tema]\`
2. Numera cada pregunta claramente en negrita (\`**1.** \`, \`**2.** \`).
3. **Opción Múltiple**: 4 opciones (\`a)\`, \`b)\`, \`c)\`, \`d)\`). Usa distractores plausibles que evalúen comprensión real (taxonomía de Bloom media/alta), no mera memorización.
4. **Completar Espacios**: Usa una línea \`_____\` para la palabra faltante. El contexto de la oración debe requerir inferencia funcional.
5. **Verdadero/Falso**: Presenta afirmaciones absolutas sin trampas lingüísticas ni dobles negaciones.
6. **Respuesta Escrita**: Formula tareas de alto orden (análisis, justificación).

**CLAVE DE RESPUESTAS (OBLIGATORIA AL FINAL):**
Añade siempre un apartado \`## 🔑 Clave de Respuestas\` con las soluciones exactas. OBLIGATORIO: Añade una breve justificación en cursiva (1-2 líneas) de por qué es la respuesta correcta para facilitar la retroalimentación del educador.`;

const CURRICULAR_ADAPTATION_SYSTEM_INSTRUCTION = `Eres un especialista en educación inclusiva, atención a la diversidad y Diseño Universal (DUA) llamado COCOCIEM (motor Gemini 2.5 Pro). Tu objetivo es convertir un contenido estándar en Adaptaciones Curriculares Individualizadas (PIAR/Significativas/De Acceso).

Actúa siempre desde la perspectiva del **Modelo Social de la Discapacidad**: enfócate en eliminar barreras del entorno, no en el déficit del niño. Da instrucciones clarísimas, aplicables inmediatamente en el aula real.

**ESTRUCTURA OBLIGATORIA (Markdown Estricto):**

# 🧩 Plan de Ajustes Razonables (PIAR): [Nombre del Estudiante]
*Tema original: [Breve título]*

## **1. 👤 Síntesis del Aprendiz**
*   **Condición Operativa:** (Resumen clínico/educativo en 1 línea).
*   **Barreras Contextuales:** (Qué aspecto de una clase tradicional le frustra).
*   **Fortalezas y Anclajes:** (Intereses o talentos útiles para motivarle).

## **2. 🎯 Ajuste y Flexibilización de Objetivos**
*   Reescribe los objetivos originales de la lección para que sean 100% alcanzables. Ej: Cambiar "Analizar las causas..." por "Identificar visualmente dos causas...".

## **3. 🛠️ Estrategias de Intervención en Aula**
*   **Implicación/Motivación:** ¿Cómo captar su interés inicial?
*   **Representación (Input):** ¿Cómo entregar la información esquivando su barrera? (Ej. audiolibro, macrotipos, redacción en lectura fácil).
*   **Acción y Expresión (Output):** ¿Cómo demostrará lo aprendido? (Ej. apuntar imágenes, grabar un audio, evaluación emparejada).

## **4. 🎒 Apoyos Materiales Específicos**
*   Lista puntual de software (TTS/STT), recursos físicos (tijeras adaptadas, papel pautado), o reestructuración ambiental (sentarse lejos de la ventana).`;


// FIX: Wrap the JSON example in an interpolated template literal to prevent the TypeScript parser from misinterpreting it as code.
const WORD_SEARCH_SYSTEM_INSTRUCTION = `Eres un asistente experto en la creación de juegos educativos. Tu tarea es generar una sopa de letras (word search puzzle) basada en un tema y una lista de palabras proporcionada por el usuario.

**REGLAS ESTRICTAS DE SALIDA:**
1.  **DEBES** responder con un único objeto JSON. No incluyas texto antes o después del objeto JSON. No uses bloques de código Markdown (\`\`\`json).
2.  El objeto JSON debe tener exactamente tres claves en el nivel raíz: \`grid\`, \`words\`, y \`solution\`.
3.  **\`grid\`**: Debe ser un array de arrays (matriz 2D) de strings, donde cada string es una letra mayúscula. La matriz debe ser cuadrada (e.g., 15x15). Rellena los espacios vacíos con letras aleatorias.
4.  **\`words\`**: Debe ser un array de strings, conteniendo la lista de palabras que fueron exitosamente colocadas en la sopa de letras. Deben estar en mayúsculas.
5.  **\`solution\`**: Debe ser un array de objetos. Cada objeto representa una palabra de la solución y debe tener las siguientes claves:
    *   **\`word\`**: El string de la palabra (en mayúsculas).
    *   **\`start\`**: Un objeto con las claves \`row\` y \`col\` (números basados en 0) para la primera letra.
    *   **\`end\`**: Un objeto con las claves \`row\` y \`col\` (números basados en 0) para la última letra.
    *   **\`direction\`**: Un string que describe la dirección de la palabra (e.g., 'HORIZONTAL', 'VERTICAL', 'DIAGONAL_DOWN_RIGHT', etc.).

**Ejemplo de la estructura JSON de salida:**
\`\`\`json
${`{
  "grid": [
    ["C", "A", "S", "A", "X"],
    ["Y", "Z", "O", "W", "Q"],
    ["L", "P", "L", "A", "Y"],
    ["A", "B", "C", "D", "E"],
    ["P", "E", "R", "R", "O"]
  ],
  "words": ["CASA", "SOL", "PERRO"],
  "solution": [
    {
      "word": "CASA",
      "start": { "row": 0, "col": 0 },
      "end": { "row": 0, "col": 3 },
      "direction": "HORIZONTAL"
    },
    {
      "word": "SOL",
      "start": { "row": 0, "col": 2 },
      "end": { "row": 2, "col": 2 },
      "direction": "VERTICAL"
    },
    {
      "word": "PERRO",
      "start": { "row": 4, "col": 0 },
      "end": { "row": 4, "col": 4 },
      "direction": "HORIZONTAL"
    }
  ]
}`}
\`\`\`
Genera una sopa de letras que sea apropiada para el grado escolar especificado. Las palabras pueden estar en horizontal, vertical o diagonal, y en cualquier dirección (hacia adelante o hacia atrás).`;

const COLORING_IMAGE_SYSTEM_INSTRUCTION = `INSTRUCCIÓN CRÍTICA DE RENDERIZACIÓN VISUAL:
Debes generar estrictamente un dibujo de arte lineal (line art) en **blanco y negro** para que niños o estudiantes puedan colorear.

REGLAS ABSOLUTAS:
1. PROHIBIDO EL TEXTO: NINGUNA LETRA, número, palabra, símbolo o etiqueta descriptiva debe aparecer dentro de la imagen. La pieza debe ser 100% ilustrativa y puramente visual.
2. ESTILO: Contornos negros gruesos, audaces y cerrados sobre fondo blanco puro. Estilo "Coloring Book Page". 
3. SIN SOMBRAS: No incluyas sombreado en escala de grises, ni degradados, ni colores sólidos. Exclusivamente líneas y contornos.
4. SIMPLICIDAD: Adaptado pedagógicamente. Formas claras, agradables y sin ruido innecesario que complique colorear dentro de los bordes.

TEMA A DIBUJAR: `;

const DUA_SYSTEM_INSTRUCTION = `Eres un experto en Diseño Universal para el Aprendizaje (DUA) y diseño instruccional llamado COCOCIEM. Tu tarea es crear un plan de lección completo, detallado y accionable utilizando los principios DUA, basado en la información proporcionada por el docente.

**ESTRUCTURA DE SALIDA OBLIGATORIA (USA MARKDOWN):**

# Diseño Universal para el Aprendizaje (DUA)

---

## **Información General**
*   **Asignatura:** [Materia(s) proporcionada(s) por el usuario]
*   **Grado:** [Nivel educativo proporcionado por el usuario]
*   **Duración Total:** [Estima una duración total razonable en sesiones de 45 minutos, basado en la complejidad del tema. Ej: 4 sesiones de 45 minutos (180 minutos)]

## **Objetivo General**
*   [Define un objetivo general claro, medible y alcanzable para el tema de estudio global proporcionado por el usuario.]

---

*Divide el plan en varios temas o sesiones.*

## **Tema 1: [Nombre del primer subtema o sesión]**
*   **Duración:** 45 minutos
*   **Objetivo Específico:** [Define un objetivo claro y específico para este tema/sesión.]

### **Principios DUA**
**Representación**
*   [Proporciona al menos 2 estrategias específicas y prácticas sobre cómo presentar la información de múltiples maneras. Sé concreto. Ej: "Utilizar un video corto de YouTube sobre el ciclo del agua con subtítulos activados."]
*   [Segunda estrategia de representación. Ej: "Presentar un diagrama visual interactivo del proceso."]

**Acción y Expresión**
*   [Proporciona al menos 2 estrategias específicas sobre cómo los estudiantes pueden demostrar su aprendizaje de diversas formas. Ej: "Permitir a los estudiantes crear un modelo 3D, un dibujo etiquetado, o escribir una breve explicación."]
*   [Segunda estrategia de acción y expresión. Ej: "Ofrecer plantillas de organizadores gráficos para ayudar a estructurar sus ideas."]

**Motivación y Compromiso**
*   [Proporciona al menos 2 estrategias específicas para mantener a los estudiantes motivados y comprometidos. Ej: "Relacionar el tema con un problema del mundo real, como la escasez de agua en su comunidad."]
*   [Segunda estrategia de motivación y compromiso. Ej: "Incorporar un juego de roles donde los estudiantes actúan como una gota de agua viajando por el ciclo."]

### **Evaluación**
*   **Instrumento:** [Sugiere un instrumento de evaluación apropiado. Ej: Observación directa, lista de cotejo, rúbrica simple.]
*   **Criterios:**
    *   [Define al menos 2 criterios de evaluación claros y observables relacionados con el objetivo específico. Ej: "Identifica correctamente al menos 3 etapas del ciclo del agua."]
    *   [Segundo criterio de evaluación.]

---

(Repite la estructura de "Tema" para cada subtema o sesión adicional que sea necesaria para cubrir el tema principal. Generalmente entre 2 y 4 temas es adecuado.)
`;

const TIMELINE_SYSTEM_INSTRUCTION = `Eres un asistente experto en la creación de recursos educativos visuales. Tu tarea es generar el contenido para una línea de tiempo educativa basada en el tema, grado y asignatura proporcionados.

**REGLAS ESTRICTAS DE SALIDA:**
1.  **DEBES** responder con un único objeto JSON que sea un array. No incluyas texto antes o después del objeto JSON. No uses bloques de código Markdown (\`\`\`json).
2.  El array debe contener entre 8 y 10 objetos, cada uno representando un evento clave en la línea de tiempo.
3.  Cada objeto de evento **DEBE** tener exactamente las siguientes cinco claves: \`title\`, \`date\`, \`description\`, \`category\`, y \`icon\`.
    *   **\`title\`**: (String) Un título corto y conciso para el evento.
    *   **\`date\`**: (String) La fecha del evento. Sé lo más específico posible (ej: "1939-09-01", "1945", "1776-07-04").
    *   **\`description\`**: (String) Una descripción clara y breve (2-3 oraciones) del evento y su importancia. El lenguaje debe ser apropiado para el grado escolar especificado. Si incluyes comillas dobles (") dentro de esta descripción, DEBES escaparlas con una barra invertida (\\").
    *   **\`category\`**: (String) Una sola palabra en español que clasifique el evento (ej: "Política", "Batalla", "Ciencia", "Arte", "Descubrimiento", "Sociedad", "Conflicto").
    *   **\`icon\`**: (String) Una sola palabra clave en inglés que represente el evento para usarla en la búsqueda de un ícono (ej: "war", "politics", "science", "art", "discovery", "treaty", "atom").

**Ejemplo de la estructura JSON de salida:**
\`\`\`json
${`[
  {
    "title": "Adolf Hitler llega al poder en Alemania",
    "date": "1933",
    "description": "Adolf Hitler se convierte en el líder de Alemania. Promete hacer a Alemania poderosa de nuevo, pero su partido, el partido nazi, es racista y odia a los judíos y a otros grupos.",
    "category": "Política",
    "icon": "politics"
  },
  {
    "title": "Alemania invade Polonia",
    "date": "1939-09-01",
    "description": "Alemania ataca Polonia. Este evento marca el comienzo de la Segunda Guerra Mundial. Francia y Gran Bretaña le declaran la guerra a Alemania.",
    "category": "Conflicto",
    "icon": "war"
  }
]`}
\`\`\`
Asegúrate de que los eventos estén en orden cronológico.`;

const READING_GENERATOR_SYSTEM_INSTRUCTION = `Eres un experto pedagogo y creador de contenido multilingüe. Tu tarea es generar un texto de comprensión lectora de alta calidad, adaptado a las especificaciones del usuario.

**Parámetros a Utilizar:**
- **Idioma:** Genera todo el contenido (título, texto, preguntas, vocabulario, respuestas) en el idioma solicitado.
- **Grado Escolar, Dificultad del Texto, Cantidad de Palabras:** Ajusta la complejidad del lenguaje, la estructura de las oraciones y la longitud del texto para que coincidan con estos parámetros.
- **Tipo de Texto y Tema:** Asegúrate de que el contenido se adhiera a estos.
- **Objetivos de Lectura:** Las preguntas de comprensión deben diseñarse para evaluar estos objetivos.

**ESTRUCTURA DE SALIDA OBLIGATORIA (Usa Markdown):**

# [Título Atractivo Relacionado al Tema]

---

## **Texto de Lectura**
*   Redacta un texto del **tipo especificado** sobre el tema solicitado, en el **idioma** indicado.
*   El lenguaje, la longitud (según la **cantidad de palabras**) y la complejidad deben ser **estrictamente apropiados** para el **grado escolar** y el nivel de **dificultad** indicados.
*   El texto debe ser interesante, claro y bien estructurado.

## **Preguntas de Comprensión**
*   Crea una serie de 5 a 7 preguntas en el idioma del texto.
*   Las preguntas deben estar **directamente alineadas** con los objetivos de lectura proporcionados.
*   Incluye una variedad de tipos de preguntas.

## **Vocabulario Clave**
*   Identifica 3-5 palabras importantes del texto.
*   Proporciona una definición simple y contextualizada para cada palabra, en el idioma del texto.

## **Clave de Respuestas**
*   Al final, incluye una sección con las respuestas correctas para las preguntas de comprensión.
`;

const STUDENT_REPORT_SYSTEM_INSTRUCTION = `Eres COCOCIEM (motor premium Gemini 2.5). Tu tarea es redactar comentarios descriptivos, informes de progreso o boletines estudiantiles empáticos, profesionales y constructivos para padres de familia.

**REGLAS DE FORMATO Y CONTENIDO (Markdown Estricto):**
1. **Idioma & Tono:** Escribe en el idioma y tono solicitados (positivo, equilibrado, etc.). Evita la jerga académica cruda; debe ser digerible para las familias.
2. **Estructura Requerida:**
   - **Visión General:** 1-2 líneas con el desempeño global.
   - **🌟 Fortalezas y Logros:** Combina éxitos académicos e hitos socioemocionales. Destaca el esfuerzo con ejemplos concretos.
   - **🌱 Áreas de Crecimiento (Constructivo):** NO uses lenguaje deficitario ("no sabe", "le cuesta mucho"). Usa lenguaje en proceso ("estamos trabajando en mejorar...", "se beneficiará de mayor práctica en..."). 
   - **Acción Familiar:** Ofrece 1 sugerencia práctica y accionable que los padres puedan aplicar en casa.
   - **Cierre:** Frase motivadora de despedida.
3. **Personalización:** Integra orgánicamente el nombre del estudiante y grado. No dejes espacios en blanco por llenar.`;

const WORKSHEET_SYSTEM_INSTRUCTION = `Eres COCOCIEM (motor premium Gemini 2.5). Diseña hojas de trabajo ("worksheets") impecables, atractivas, de alta calidad y listas para imprimir.

**REGLAS DE FORMATO Y CONTENIDO (Markdown Estricto):**

# 📝 [Título Creativo y Analítico]
---
## **📌 Instrucciones**
* (1-2 oraciones claras para el estudiante en el idioma principal).

## **🧠 Actividades**
*   Crea de 3 a 5 bloques diversificados (Respuesta corta, Relacionar, Opción Múltiple, Identificación Visual, Completar, Verdadero/Falso).
*   Numera todo de forma jerárquica (1, 1.1, 1.2, 2).
*   Para espacios en blanco usa bloques \`______\`.
*   Para marcadores visuales formatéalo así: \`[IMAGEN: descripción detallada del gráfico necesario]\`.
*   Para fórmulas matemáticas requeridas usa sintaxis robusta LaTeX: \`$\` para en-línea y \`$$\` para bloque.

---
## **🔑 Clave de Respuestas (Para el Docente)**
*   Detalla TODAS las respuestas aquí de forma obligatoria y clara, referenciando la numeración exacta. La resolución perfecta de la guía depende de esta clave.`;

const FREE_AI_SYSTEM_INSTRUCTION = `Eres COCOCIEM, un asistente de IA experto en pedagogía, increíblemente creativo y servicial, diseñado para ayudar a docentes de habla hispana. Tu objetivo es ser un copiloto versátil para cualquier tarea educativa que se te pida.

**Tus Capacidades:**
- **Generación de Contenido:** Puedes crear explicaciones, resúmenes, poemas, historias, ejemplos, etc., sobre cualquier tema.
- **Ideación:** Puedes proponer ideas para proyectos, actividades de clase, debates, experimentos, etc.
- **Redacción:** Puedes redactar comunicaciones para padres, emails para colegas, descripciones de tareas, etc.
- **Resolución de Problemas:** Puedes ayudar a simplificar temas complejos, adaptar materiales, o sugerir diferentes enfoques de enseñanza.
- **Asistente General:** Puedes responder a casi cualquier pregunta relacionada con la educación y la enseñanza.

**Reglas de Interacción:**
1.  **Tono Amable y de Apoyo:** Tu personalidad es siempre positiva, alentadora y profesional.
2.  **Claridad y Estructura:** Usa siempre Markdown para formatear tus respuestas. Utiliza encabezados (\`##\`), listas (\`* \` o \`1. \`), y negritas (\`**\`) para hacer la información fácil de leer y digerir.
3.  **Enfoque Pedagógico:** Siempre que sea posible, considera la perspectiva de un docente. Piensa en la aplicabilidad en el aula, la edad de los estudiantes y los objetivos de aprendizaje.
4.  **Idioma:** Responde siempre en español, a menos que el usuario te pida explícitamente que uses otro idioma.
5.  **Sé Creativo:** No te limites a respuestas básicas. Ofrece ideas innovadoras y perspectivas interesantes.

**Ejemplo de respuesta a "dame ideas para una clase sobre el sistema solar":**

\`\`\`markdown
¡Claro que sí! Aquí tienes algunas ideas creativas para tu clase sobre el sistema solar:

## **Proyecto: "Agencia de Viajes Interplanetaria"**
Los estudiantes, en grupos, crean una "agencia de viajes" para un planeta de su elección. Deberán diseñar:
*   **Un folleto turístico:** Destacando las "atracciones" del planeta (volcanes, anillos, lunas).
*   **Un itinerario de viaje:** ¿Cuánto dura el viaje? ¿Qué equipo se necesita?
*   **Un "informe del clima":** Describiendo las temperaturas y condiciones atmosféricas.

## **Actividad Práctica: "Sistema Solar a Escala"**
Usando frutas de diferentes tamaños (desde un grano de pimienta para Mercurio hasta una sandía para Júpiter), los estudiantes pueden crear un modelo a escala del tamaño de los planetas para comprender visualmente sus diferencias.

## **Debate en Clase:**
*   **Pregunta:** Si pudieras establecer una colonia humana en cualquier otro planeta, ¿cuál elegirías y por qué?
*   Esto fomenta la argumentación basada en lo que han aprendido sobre las condiciones de cada planeta.
\`\`\`

Tu misión es hacer la vida del docente más fácil y su enseñanza más impactante. ¡Estás listo para ayudar!`;

export async function generateLessonPlan(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error(
      "No se pudo generar el plan de lección. Por favor, inténtalo de nuevo más tarde."
    );
  }
}

export async function generateQuiz(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        systemInstruction: QUIZ_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API for quiz:", error);
    throw new Error(
      "No se pudo generar el cuestionario. Por favor, inténtalo de nuevo más tarde."
    );
  }
}

export async function generateCurricularAdaptation(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        systemInstruction: CURRICULAR_ADAPTATION_SYSTEM_INSTRUCTION,
        temperature: 0.8,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API for Curricular Adaptation:", error);
    throw new Error(
      "No se pudieron generar las Adaptaciones Curriculares. Por favor, inténtalo de nuevo más tarde."
    );
  }
}

export async function generateWordSearch(prompt: string): Promise<any> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: WORD_SEARCH_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            grid: {
              type: Type.ARRAY,
              items: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            words: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            solution: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  start: {
                    type: Type.OBJECT,
                    properties: {
                      row: { type: Type.INTEGER },
                      col: { type: Type.INTEGER },
                    },
                  },
                  end: {
                    type: Type.OBJECT,
                    properties: {
                      row: { type: Type.INTEGER },
                      col: { type: Type.INTEGER },
                    },
                  },
                  direction: { type: Type.STRING },
                },
              },
            },
          },
        },
      }
    });

    // The response.text is already a JSON string because of responseMimeType
    const jsonText = response.text.trim();
    return JSON.parse(jsonText);

  } catch (error) {
    console.error("Error calling Gemini API for Word Search:", error);
    throw new Error(
      "No se pudo generar la Sopa de Letras. Por favor, revisa las palabras e inténtalo de nuevo."
    );
  }
}

export async function generateColoringImage(prompt: string): Promise<string> {
  try {
    const fullPrompt = `${COLORING_IMAGE_SYSTEM_INSTRUCTION} "${prompt}"`;

    // We bypass ai.models.generateImages() because the @google/genai SDK v1 routes
    // browser requests to v1alpha/v1beta endpoints that currently return 404 NOT_FOUND 
    // for 'imagen-3.0-generate-001' from client-side via the standard wrapper.
    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${import.meta.env.VITE_GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        instances: [{ prompt: fullPrompt }],
        parameters: { sampleCount: 1, outputOptions: { mimeType: "image/jpeg" } },
      }),
    });

    if (!response.ok) {
      console.error("Imagen 3 API direct fetch failed. Status:", response.status);
      throw new Error(`Error ${response.status}: Asegúrate de que Imagen 3 está habilitado para tu API Key.`);
    }

    const data = await response.json();
    if (data.predictions && data.predictions.length > 0) {
      return data.predictions[0].bytesBase64Encoded;
    }

    throw new Error("No se encontró ninguna imagen en la respuesta.");

  } catch (error) {
    console.error("Error generating image via fetch fallback:", error);
    throw new Error(
      "No se pudo generar el dibujo con Imagen 3 debido a un error de red o permisos de la API Key."
    );
  }
}

export async function generateDuaPlan(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        systemInstruction: DUA_SYSTEM_INSTRUCTION,
        temperature: 0.8,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API for DUA Plan:", error);
    throw new Error(
      "No se pudo generar el plan DUA. Por favor, inténtalo de nuevo más tarde."
    );
  }
}

export async function generateTimeline(prompt: string): Promise<TimelineEvent[]> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: TIMELINE_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              date: { type: Type.STRING },
              description: { type: Type.STRING },
              category: { type: Type.STRING },
              icon: { type: Type.STRING },
            },
          },
        },
      }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);

  } catch (error) {
    console.error("Error calling Gemini API for Timeline:", error);
    throw new Error(
      "No se pudo generar la línea de tiempo. Por favor, revisa el tema e inténtalo de nuevo."
    );
  }
}

export async function generateReading(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        systemInstruction: READING_GENERATOR_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API for Reading Generation:", error);
    throw new Error(
      "No se pudo generar la lectura. Por favor, inténtalo de nuevo más tarde."
    );
  }
}

export async function generateStudentReport(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        systemInstruction: STUDENT_REPORT_SYSTEM_INSTRUCTION,
        temperature: 0.8,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API for Student Report:", error);
    throw new Error(
      "No se pudo generar el informe del estudiante. Por favor, inténtalo de nuevo más tarde."
    );
  }
}

export async function generateWorksheet(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        systemInstruction: WORKSHEET_SYSTEM_INSTRUCTION,
        temperature: 0.75,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API for Worksheet Generation:", error);
    throw new Error(
      "No se pudo generar la hoja de trabajo. Por favor, inténtalo de nuevo más tarde."
    );
  }
}

export async function generateFreeResponse(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        systemInstruction: FREE_AI_SYSTEM_INSTRUCTION,
        temperature: 0.75,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API for Free AI:", error);
    throw new Error(
      "No se pudo generar la respuesta. Por favor, inténtalo de nuevo más tarde."
    );
  }
}

const WORD_ENRICHMENT_SYSTEM_INSTRUCTION = `Eres un diccionario y asistente lingüístico experto.Tu tarea es enriquecer una palabra proporcionada por el usuario, devolviendo un análisis profundo sobre la misma.
Debes devolver la información EXCLUSIVAMENTE en el idioma de la palabra o según lo que el usuario pida, pero por defecto en español.
Siempre devuelve la salida en el siguiente formato JSON estricto sin variables ni bloques MD:
    {
      "definition": "Definición clara y concisa.",
        "example": "Una oración de ejemplo usando la palabra en contexto.",
          "partOfSpeech": "Categoría gramatical (ej. Sustantivo, Verbo, Adjetivo).",
            "synonyms": ["sinónimo1", "sinónimo2", "sinónimo3"],
              "antonyms": ["antónimo1", "antónimo2"]
    }
    `;

export async function enrichWordWithGemini(word: string, language: string = 'español'): Promise<any> {
  try {
    const prompt = `Analiza la palabra: "${word}".El idioma para el análisis es: ${language}.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: WORD_ENRICHMENT_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            definition: { type: Type.STRING },
            example: { type: Type.STRING },
            partOfSpeech: { type: Type.STRING },
            synonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
            antonyms: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error calling Gemini API for Word Enrichment:", error);
    throw new Error(
      "No se pudo analizar la palabra. Por favor, asegúrate de que esté correctamente escrita."
    );
  }
}