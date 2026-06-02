# Registro de Interacciones con IA — Módulo 1

**Proyecto:** Rocket Elevators  
**Estudiante:** Juan Diego Lopez  
**Módulo:** AND-101 — Introducción a Claude Code  
**Período:** 2026-05-22 al 2026-06-01

---

## Entrada 1

**Tarea:** Configuración del entorno — Instalación de Claude Code CLI en Windows  
**Iteración:** 1  
**Instrucción usada:**

```bash
npm install -g @anthropic-ai/claude-code
```

**Resultados correctos:**

- El paquete npm se descargó e instaló correctamente.
- La versión quedó registrada y accesible mediante `claude --version`.

**Resultados incorrectos:**

- PowerShell bloqueó la ejecución del binario con el error: *"la ejecución de scripts está deshabilitada en este sistema"*.
- El CLI no respondía al comando `claude` a pesar de haberse instalado.

**Qué cambiaría:**

- Verificar la política de ejecución de PowerShell antes de instalar cualquier CLI de Node.js en Windows. La solución correcta fue ejecutar `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` en una terminal con permisos de administrador. Documentar este paso como prerequisito en la guía de inicio del módulo.

---

## Entrada 2

**Tarea:** Configuración del entorno — Autenticación de Claude Code  
**Iteración:** 1  
**Instrucción usada:**

```bash
claude auth login
```

**Resultados correctos:**

- El comando abrió correctamente el flujo de autenticación en el navegador.
- El token de sesión se almacenó de forma local sin necesidad de configuración adicional.

**Resultados incorrectos:**

- La cuenta gratuita de Anthropic no permite el uso completo del CLI. Se recibió un error de acceso indicando que la funcionalidad interactiva requiere una suscripción activa.
- No fue posible ejecutar prompts directamente hasta confirmar la suscripción Pro/Max.

**Qué cambiaría:**

- Informar a los estudiantes desde el inicio del módulo que Claude Code CLI requiere una suscripción Pro o Max. Añadir esta advertencia como nota destacada en la semana 1 del syllabus, antes de que los estudiantes intenten la instalación.

---

## Entrada 3

**Tarea:** Dashboard HTML — Creación de `dashboard_spec.md`  
**Iteración:** 1  
**Instrucción usada:**

> "Crea un archivo dashboard_spec.md que documente los requisitos del dashboard de operaciones de Rocket Elevators. Debe incluir objetivo, tecnologías, secciones del dashboard y componentes visuales."

**Resultados correctos:**

- Claude Code generó un documento estructurado con secciones claras: objetivo, tecnologías (HTML, CSS, JavaScript vanilla), descripción de cada componente del dashboard y estructura de archivos.
- El formato en Markdown fue limpio y bien organizado.
- La estructura propuesta fue directamente utilizable como guía para la generación posterior del HTML.

**Resultados incorrectos:**

- El documento no incluyó criterios de calidad de datos ni validaciones esperadas en los KPIs. Esto generó ambigüedad al momento de implementar las tarjetas de métricas en el HTML.
- Faltó especificar el comportamiento esperado cuando los datos no están disponibles (estados vacíos).

**Qué cambiaría:**

- Incluir en el prompt inicial una solicitud explícita de sección "Criterios de calidad" y "Manejo de errores". Un prompt más completo desde el inicio evita iteraciones correctivas posteriores.

---

## Entrada 4

**Tarea:** Dashboard HTML — Generación de `index.html`  
**Iteración:** 2  
**Instrucción usada:**

> "Basándote en dashboard_spec.md, genera un archivo index.html completo con HTML semántico, CSS embebido con variables, y JavaScript vanilla para un dashboard de operaciones de Rocket Elevators. Incluye tarjetas KPI, tabla de ascensores y gráfica de estados."

**Resultados correctos:**

- Claude Code comprendió el contexto del archivo spec y generó una estructura HTML coherente con las secciones solicitadas.
- Las variables CSS se aplicaron correctamente para el sistema de colores.

**Resultados incorrectos:**

- El comando generado superó los 14,027 bytes, lo que causó un error en PowerShell: *"El argumento es demasiado largo"*. El archivo no se escribió en disco.
- PowerShell no puede manejar cadenas de texto tan largas como argumentos de comandos directos.

**Qué cambiaría:**

- Para archivos HTML extensos, indicarle a Claude Code que use su herramienta `Write` para escribir directamente al sistema de archivos, en lugar de generar un comando de shell. Alternativamente, dividir la generación en partes: estructura HTML, CSS y JavaScript por separado.

---

## Entrada 5

**Tarea:** Dashboard HTML — Corrección del JavaScript  
**Iteración:** 3  
**Instrucción usada:**

> "Revisa el JavaScript en index.html. Reemplaza todos los usos de 'var' por 'const' o 'let' según corresponda. Usa JavaScript moderno (ES6+): arrow functions, template literals y destructuring donde sea apropiado."

**Resultados correctos:**

- Claude Code identificó correctamente todos los usos de `var` y los reemplazó con `const` o `let` según el contexto de mutabilidad de cada variable.
- Las arrow functions se aplicaron de forma consistente en los callbacks y funciones de transformación de datos.
- El uso de template literals mejoró la legibilidad del código de generación de HTML dinámico.

**Resultados incorrectos:**

- En dos casos, Claude Code usó `let` donde `const` era más apropiado (variables que nunca se reasignan). Requirió una revisión manual posterior.
- No se aplicó destructuring en todos los lugares donde era posible; solo en los más obvios.

**Qué cambiaría:**

- Agregar al prompt la instrucción: *"Prefiere const sobre let siempre que la variable no se reasigne"*. Para el destructuring, ser más explícito: *"Aplica destructuring en todos los parámetros de objeto y en los resultados de funciones que retornen objetos."*

---

## Entrada 6

**Tarea:** Dashboard HTML — Comentarios JSDoc  
**Iteración:** 4  
**Instrucción usada:**

> "Agrega comentarios JSDoc completos a todas las funciones en el bloque de script de index.html. Cada función debe tener descripción, @param con tipo y descripción, y @returns donde aplique."

**Resultados correctos:**

- Claude Code agregó comentarios JSDoc correctos a todas las funciones detectadas.
- Los tipos de parámetros fueron inferidos correctamente del contexto (e.g., `@param {Array<Object>} elevators`).
- El resultado fue compatible con herramientas de generación de documentación automática.
- Las descripciones fueron concisas y precisas, sin redundancias.

**Resultados incorrectos:**

- No se identificaron errores significativos en esta iteración. El resultado fue directamente utilizable.

**Qué cambiaría:**

- Esta iteración confirmó que los prompts específicos y acotados producen mejores resultados. Cuando la tarea tiene un alcance limitado y bien definido (solo agregar JSDoc), Claude Code responde con alta precisión. Aplicar este principio de "un objetivo por prompt" en iteraciones futuras.

---

## Entrada 7

**Tarea:** Análisis de datos — Primera versión de `data_analysis_spec.md`  
**Iteración:** 1  
**Instrucción usada:**

> "Crea un archivo data_analysis_spec.md con las especificaciones para el análisis del dataset de licencias de ascensores. Debe cubrir carga de datos, limpieza, métricas y visualizaciones."

**Resultados correctos:**

- Claude Code generó una especificación detallada con secciones bien organizadas.
- La descripción de columnas clave fue precisa y útil como referencia durante el análisis.
- Las notas del dataset (campos redactados, formato de fechas, ciudad embebida) fueron identificadas correctamente.

**Resultados incorrectos:**

- La especificación generada incluía secciones que el módulo 1 no solicitaba: modelado predictivo, integración con APIs externas y análisis de series de tiempo. Esto inflaba el alcance del entregable innecesariamente.
- La sección de "Objetivos del análisis" mezclaba tareas de nivel básico con tareas avanzadas sin jerarquización.

**Qué cambiaría:**

- Delimitar explícitamente el alcance en el prompt: *"El análisis es exploratorio y descriptivo únicamente. No incluyas modelado predictivo, machine learning ni integraciones externas."* Agregar siempre una restricción de alcance cuando el dominio puede interpretarse de forma amplia.

---

## Entrada 8

**Tarea:** Análisis de datos — Instalación de librerías Python  
**Iteración:** 1  
**Instrucción usada:**

> "Genera el notebook de análisis de datos usando pandas, numpy y matplotlib."

**Resultados correctos:**

- Claude Code identificó las dependencias necesarias y las listó claramente antes de intentar la generación del notebook.

**Resultados incorrectos:**

- El entorno Python del proyecto no tenía instaladas las librerías requeridas (`pandas`, `numpy`, `matplotlib`). El intento de importación en el notebook falló con `ModuleNotFoundError`.
- Claude Code asumió que las librerías estaban disponibles sin verificar el entorno previamente.

**Qué cambiaría:**

- Verificar el entorno antes de solicitar generación de código que dependa de librerías externas. La solución fue ejecutar `pip install pandas numpy matplotlib` manualmente. En el prompt, agregar: *"Antes de generar el notebook, confirma qué librerías están disponibles o incluye los comandos de instalación necesarios."*

---

## Entrada 9

**Tarea:** Análisis de datos — Generación del notebook `data_analysis.ipynb`  
**Iteración:** 2  
**Instrucción usada:**

> "Genera el archivo notebooks/data_analysis.ipynb con celdas de markdown y código Python para: carga del CSV, exploración básica, análisis de calidad de datos, métricas operacionales y tres visualizaciones. Todo en español."

**Resultados correctos:**

- Claude Code interpretó correctamente la estructura del notebook con celdas alternadas de markdown y código.
- La lógica de análisis propuesta fue coherente con la especificación en `data_analysis_spec.md`.

**Resultados incorrectos:**

- La generación del archivo `.ipynb` (que es JSON estructurado) causó un error de timeout/parser en PowerShell debido al tamaño y complejidad del JSON generado.
- PowerShell presentó un prompt de confirmación inesperado (`[Y] Yes [N] No`) que interrumpió el flujo automatizado.

**Qué cambiaría:**

- Para archivos JSON complejos como notebooks de Jupyter, siempre usar la herramienta `Write` de Claude Code en lugar de comandos de shell. Si aparece un prompt de confirmación, proceder con "Yes" y documentar que esto es esperado para escrituras de archivos grandes. Considerar dividir el notebook en secciones si el tamaño sigue siendo problemático.

---

## Entrada 10

**Tarea:** Análisis de datos — Notebook generado exitosamente en español  
**Iteración:** 3  
**Instrucción usada:**

> "Usa la herramienta Write para crear el archivo notebooks/data_analysis.ipynb directamente. El notebook debe tener todas las celdas markdown en español, con títulos descriptivos y comentarios explicativos en el código Python."

**Resultados correctos:**

- El notebook fue generado exitosamente con la herramienta `Write`, evitando los problemas de PowerShell de la iteración anterior.
- Todas las celdas markdown estaban en español, con títulos claros que facilitaron la navegación y comprensión del análisis.
- Los comentarios en el código Python fueron descriptivos y en español, reduciendo la curva de comprensión para revisores no técnicos.
- Las tres visualizaciones (distribución de estados, top 10 ciudades, licencias vencidas vs activas) se generaron correctamente con `matplotlib`.
- El notebook resultó directamente ejecutable sin modificaciones.

**Resultados incorrectos:**

- No se identificaron errores en esta iteración. La combinación de la herramienta correcta (`Write`) con un prompt bien especificado produjo el resultado esperado en el primer intento.

**Qué cambiaría:**

- Establecer como práctica estándar usar la herramienta `Write` de Claude Code para cualquier archivo que supere ~5KB o que tenga estructura JSON compleja. Documentar este aprendizaje como guía para futuras tareas del módulo.

---

## Patrones Identificados

### Técnicas de prompting que funcionaron mejor

- **Prompts acotados y de objetivo único:** Las instrucciones con una sola tarea clara (como "agrega JSDoc a todas las funciones") produjeron resultados más precisos que los prompts con múltiples objetivos simultáneos. Las entradas 6 y 10 son los mejores ejemplos.
- **Restricciones de alcance explícitas:** Agregar frases como "solo incluye X, no incluyas Y" redujo la tendencia de Claude Code a generar contenido fuera del alcance del módulo. Aprendido en la entrada 7.
- **Referenciar archivos existentes:** Indicar *"basándote en dashboard_spec.md"* o *"según data_analysis_spec.md"* produjo outputs más coherentes con el contexto del proyecto que describir los requisitos desde cero en cada prompt.
- **Especificar la herramienta de escritura:** Pedir explícitamente que se use la herramienta `Write` para archivos grandes evitó errores de shell y timeouts. Aprendido en las entradas 4 y 9.
- **Incluir estándares de código en el prompt:** Mencionar explícitamente "JavaScript moderno (ES6+)" o "código Python con comentarios en español" produjo código de mayor calidad sin necesidad de revisión posterior.

### Errores que se repitieron

- **Limitaciones de PowerShell con texto largo:** Apareció en las entradas 4 y 9. PowerShell no maneja bien argumentos o comandos que superan cierto tamaño. Este fue el error más frecuente y el más costoso en tiempo de depuración.
- **Suposición de entorno preconfigurado:** Claude Code asumió en múltiples ocasiones que las herramientas (librerías Python, permisos de ejecución) ya estaban disponibles, sin verificar el estado real del entorno. Esto causó fallos en las entradas 1 y 8.
- **Alcance no delimitado:** Sin restricciones explícitas, Claude Code tiende a generar soluciones más amplias que las requeridas por el módulo. Afectó las entradas 3 y 7.

### Evolución de la calidad de los prompts

Las primeras interacciones del módulo usaron prompts genéricos que produjeron resultados funcionales pero imprecisos, requiriendo múltiples iteraciones correctivas. A medida que avanzó el módulo, los prompts incorporaron: (1) referencia a archivos de contexto existentes, (2) restricciones de alcance explícitas, (3) especificación del estándar de código esperado, y (4) indicación de la herramienta de escritura a utilizar. Esta evolución redujo el número promedio de iteraciones por tarea de 3-4 en la primera semana a 1-2 en la tercera semana, y eliminó por completo los errores de scope en las últimas entregas del módulo.
