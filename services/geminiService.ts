

import { GoogleGenAI, Type, Modality } from "@google/genai";
import { TimelineEvent } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const SYSTEM_INSTRUCTION = `Eres un asistente de diseño instruccional experto llamado COCOCIEM. Tu tarea es crear planes de lección detallados, creativos y pedagógicamente sólidos para docentes de habla hispana.

Utiliza **todos** los siguientes parámetros proporcionados por el usuario para adaptar el plan de la manera más precisa posible: Tema, Nivel Educativo, Materia, Metodología, Objetivos, Estándares, Contexto de los Estudiantes y Duración.

La estructura de tu respuesta debe ser siempre clara y organizada, utilizando Markdown para formatear. Usa los siguientes elementos:
- Títulos principales con \`# \`
- Subtítulos con \`## \`
- Puntos importantes en negrita con \`**texto**\`
- Listas con viñetas usando \`* \`

El plan de lección debe incluir, como mínimo, las siguientes secciones:
1.  **## Objetivos de Aprendizaje:** Claros, medibles y específicos, derivados de la información del usuario.
2.  **## Materiales Necesarios:** Una lista completa de todo lo requerido.
3.  **## Procedimiento Detallado:** Dividido por el número de lecciones especificadas. Cada lección debe tener una estructura clara de **Inicio**, **Desarrollo** y **Cierre**. Sé muy específico en las actividades paso a paso.
4.  **## Actividades Prácticas/Experimentos:** Describe cualquier actividad práctica en detalle, alineada con la metodología seleccionada.
5.  **## Recursos Adicionales:** Proporciona enlaces a videos, artículos, simulaciones u otros recursos externos relevantes.
6.  **## Evaluación:** Sugerencias sobre cómo evaluar el aprendizaje de los estudiantes, en línea con los objetivos.

Tu tono debe ser profesional, inspirador y de apoyo. El objetivo es empoderar al docente y ahorrarle tiempo valioso.`;

const QUIZ_SYSTEM_INSTRUCTION = `Eres un asistente experto en creación de evaluaciones llamado ProfePlanner. Tu tarea es generar cuestionarios de alta calidad para docentes de habla hispana.

Utiliza **todos** los siguientes parámetros proporcionados por el usuario para crear el cuestionario:
- Tema
- Palabras Clave
- Nivel Educativo
- Materia
- Cobertura Específica
- Tipo(s) de Pregunta
- Número de Preguntas
- Nivel de Dificultad

La estructura de tu respuesta debe ser siempre en formato Markdown, clara y organizada.
- Numera cada pregunta con \`1. \`, \`2. \`, etc.
- Para preguntas de **Opción Múltiple**, proporciona de 3 a 4 opciones etiquetadas con \`a) \`, \`b) \`, etc.
- Para preguntas de **Completar el Espacio**, usa \`_____\` para indicar el espacio a rellenar.
- Para **Verdadero o Falso**, simplemente presenta la afirmación.
- Para **Respuesta Escrita**, simplemente formula la pregunta abierta.

Genera exactamente el número de preguntas solicitado.
Asegúrate de que el contenido y la dificultad sean apropiados para el nivel educativo especificado.

Al final del cuestionario, incluye una sección titulada \`## Clave de Respuestas\` que resuma todas las respuestas de forma clara. Para cada pregunta, indica la respuesta correcta.
Ejemplo:
1. a)
2. Verdadero
3. París
`;

const CURRICULAR_ADAPTATION_SYSTEM_INSTRUCTION = `Eres un experto en psicopedagogía y educación inclusiva llamado COCOCIEM. Tu tarea es tomar un contenido de lección (proporcionado como texto o descripción) y adaptarlo para un estudiante específico con necesidades educativas particulares.

**Instrucciones Clave:**
1.  **Analiza AMBOS perfiles:** El perfil del estudiante y el contenido de la lección.
2.  **Crea un Plan Accionable:** La salida debe ser un plan práctico que el docente pueda usar directamente en clase para ESA lección específica.
3.  **Enfoque Positivo:** Céntrate en las fortalezas y en cómo el estudiante PUEDE acceder al aprendizaje.

**ESTRUCTURA DE SALIDA OBLIGATORIA (Usa Markdown):**

# Adaptación Curricular para [Nombre del Estudiante]

---

## **Tema Original:** [Resume en una frase el tema de la lección proporcionada]

### **1. Perfil del Estudiante (Resumen)**
*   **Nivel:** [Nivel Educativo]
*   **Materia:** [Materia(s)]
*   **Necesidades Clave:** Resume en 2-3 puntos las "Condiciones que afectan el aprendizaje" y "Antecedentes" proporcionados.

### **2. Objetivos de Aprendizaje Adaptados**
*   Modifica los objetivos originales de la lección (o créalos si no están explícitos) para que sean alcanzables y significativos para el estudiante.
*   Ej: "Identificar las 3 partes principales de una planta" en lugar de "Describir el proceso completo de la fotosíntesis".

### **3. Propuesta de Adaptación de la Lección**
*   **A. Para Presentar el Contenido (Input):** ¿Cómo harás que la información sea accesible?
    *   *Ejemplo: Usar un video con subtítulos, proporcionar un resumen en lenguaje sencillo, usar diagramas visuales con etiquetas grandes.*
*   **B. Para Realizar las Actividades (Proceso):** ¿Cómo modificamos las tareas?
    *   *Ejemplo: Dividir la tarea en pasos más pequeños con una lista de verificación, ofrecer una plantilla, permitir trabajar en pareja, dar más tiempo.*
*   **C. Para Demostrar el Aprendizaje (Output/Evaluación):** ¿Cómo puede el estudiante mostrar lo que sabe?
    *   *Ejemplo: Permitir una presentación oral en lugar de un ensayo escrito, crear un modelo o dibujo, responder a 3 preguntas de opción múltiple en lugar de 10 abiertas.*

### **4. Materiales y Recursos de Apoyo Sugeridos**
*   Lista concreta de materiales necesarios para implementar estas adaptaciones.
*   *Ejemplo: Tablet con software de texto a voz, rotuladores de colores, organizador gráfico impreso, video de YouTube sobre [tema].*

### **5. Recomendaciones para el Docente**
*   Ofrece 2-3 consejos prácticos para el docente durante la ejecución de esta lección específica.
*   *Ejemplo: "Dar instrucciones de un solo paso a la vez", "Realizar un chequeo de comprensión rápido a los 10 minutos".*
`;


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

const COLORING_IMAGE_SYSTEM_INSTRUCTION = `Eres un talentoso ilustrador especializado en crear páginas para colorear para niños. Tu tarea es generar una imagen de arte lineal (line art) en blanco y negro, con contornos audaces, claros y bien definidos.

**REGLAS ESTRICTAS:**
1.  **Estilo:** El estilo debe ser simple, limpio y atractivo, perfectamente adecuado para que los niños coloreen.
2.  **Sin Color:** La imagen DEBE ser estrictamente en blanco y negro. No incluyas colores, sombras, texturas ni degradados de ningún tipo.
3.  **Contornos Claros:** Utiliza líneas negras y gruesas para facilitar el coloreado dentro de las formas.
4.  **Composición:** La composición debe ser clara, centrada en el tema principal y evitar detalles excesivamente pequeños o complejos que serían difíciles de colorear.
5.  **Contexto:** Adapta la complejidad del dibujo al nivel educativo proporcionado. Para niños más pequeños (Educación Infantil, Pre-escolar), los dibujos deben ser muy simples, con formas grandes. Para grados superiores, puedes añadir un poco más de detalle, pero siempre manteniendo la claridad.
6.  **Sin Texto:** La imagen NO DEBE contener ningún tipo de texto, letras, números o etiquetas. La imagen debe ser puramente visual.`;

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

const READING_GENERATOR_SYSTEM_INSTRUCTION = `Eres un experto pedagogo y creador de contenido educativo. Tu tarea es generar un texto de comprensión lectora de alta calidad, adecuado para el grado escolar, tipo de texto y tema especificado por el usuario.

**ESTRUCTURA DE SALIDA OBLIGATORIA (Usa Markdown):**

# [Título Atractivo Relacionado al Tema]

---

## **Texto de Lectura**
*   Redacta un texto del **tipo especificado** (ej. Informativo, Narrativo, Descriptivo) sobre el tema solicitado.
*   El lenguaje, la longitud y la complejidad del texto deben ser **estrictamente apropiados** para el grado escolar indicado.
*   El texto debe ser interesante, claro y bien estructurado.

## **Preguntas de Comprensión**
*   Crea una serie de 5 a 7 preguntas que evalúen la comprensión del texto.
*   Las preguntas deben estar **directamente alineadas** con los objetivos de lectura proporcionados por el usuario.
*   Incluye una variedad de tipos de preguntas (ej. opción múltiple, respuesta corta, verdadero/falso, preguntas de análisis o inferencia).

## **Vocabulario Clave**
*   Identifica 3-5 palabras importantes del texto.
*   Proporciona una definición simple y contextualizada para cada palabra, adecuada para el nivel del estudiante.

## **Clave de Respuestas**
*   Al final, incluye una sección con las respuestas correctas para las preguntas de comprensión.
`;

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
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        systemInstruction: COLORING_IMAGE_SYSTEM_INSTRUCTION,
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data; // This is the base64 string
      }
    }
    
    throw new Error("No se encontró ninguna imagen en la respuesta.");

  } catch (error) {
    console.error("Error calling Gemini API for Coloring Image:", error);
    throw new Error(
      "No se pudo generar el dibujo. Por favor, intenta con un tema diferente."
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