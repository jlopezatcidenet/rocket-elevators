# Rocket Elevators — Especificación de Análisis de Datos

## Objetivo

Realizar un análisis inicial del dataset de licencias de ascensores
para confirmar que los datos son utilizables para el dashboard
de operaciones.

---

## Fuente de Datos

| Propiedad | Valor |

|---|---|
| Archivo | `data/elevator_licenses.csv` |
| Formato | CSV con encabezados |
| Registros aproximados | ~45,383 ascensores |

---

## Columnas Clave

| Columna | Tipo | Descripción |

|---|---|---|
| `ElevatingDevicesNumber` | Integer | Identificador único del ascensor |
| `LocationoftheElevatingDevice` | String | Dirección + ciudad + código postal |
| `ElevatingDevicesLicenseNumber` | String | Número de licencia |
| `LICENSESTATUS` | Categórico | Estado: ACTIVE, BY REQUEST, CANCELLED_NOT_RENEWED |
| `LICENSEEXPIRYDATE` | Fecha DD-Mon-YY | Fecha de vencimiento de la licencia |
| `LICENSEHOLDER` | String | Nombre del titular de la licencia |

---

## Objetivos del Análisis

### 1. Carga y Exploración Básica

- Cargar el CSV con pandas
- Mostrar dimensiones (filas y columnas)
- Mostrar primeras filas
- Mostrar tipos de datos por columna

### 2. Calidad de Datos

- Contar valores nulos por columna
- Detectar duplicados en ElevatingDevicesNumber
- Veredicto: ¿datos utilizables? SI/NO

### 3. Métricas Operacionales

- Total de ascensores
- Total activos (LICENSESTATUS = ACTIVE)
- Total con licencia vencida (LICENSEEXPIRYDATE < hoy)
- Porcentaje de activos sobre el total

### 4. Visualizaciones

| Gráfica | Tipo | Propósito |

|---|---|---|
| Distribución de estados | Gráfica de barras | Ver proporción ACTIVE vs otros |
| Top 10 ciudades | Barras horizontales | Concentración geográfica |
| Licencias vencidas vs activas | Barras | Estado general de la flota |

---

## Notas del Dataset

| Problema | Observación | Acción |

|---|---|---|
| Campos redactados | LICENSEHOLDERACCOUNTNUMBER contiene "data redacted" | Excluir del análisis |
| Formato de fechas | DD-Mon-YY requiere parseo cuidadoso | Usar pd.to_datetime con errors='coerce' |
| Ciudad embebida | Ciudad está dentro de LocationoftheElevatingDevice | Extraer con regex |

---

## Criterios de Calidad

Los datos son UTILIZABLES si:

- ElevatingDevicesNumber tiene menos de 5% de nulos
- LICENSESTATUS tiene menos de 5% de nulos
- LICENSEEXPIRYDATE tiene menos de 10% de nulos
- No hay duplicados en ElevatingDevicesNumber

---

## Entregables

| Entregable | Ubicación |

|---|---|
| Notebook completo | `notebooks/data_analysis.ipynb` |
| Gráficas exportadas | `docs/charts/` |
