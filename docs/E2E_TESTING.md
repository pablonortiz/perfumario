# 🧪 E2E Testing con Maestro

Documentación completa de tests End-to-End (E2E) para Perfumario usando Maestro.

## 📋 Tabla de Contenidos

- [¿Qué es Maestro?](#qué-es-maestro)
- [Instalación](#instalación)
- [Estructura de Tests](#estructura-de-tests)
- [Ejecutar Tests](#ejecutar-tests)
- [Escribir Tests](#escribir-tests)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

---

## ¿Qué es Maestro?

[Maestro](https://maestro.mobile.dev/) es un framework de testing E2E para aplicaciones móviles (iOS y Android) que es:

- **Simple**: Sintaxis YAML declarativa y fácil de leer
- **Rápido**: Tests más rápidos que Detox o Appium
- **Confiable**: Menos flaky tests gracias a su sistema de espera inteligente
- **Multi-plataforma**: Un solo test para iOS y Android

### Ventajas sobre Detox/Appium
- ✅ No requiere instrumentación del código
- ✅ Configuración mínima
- ✅ Tests más estables
- ✅ Debugging más fácil con Maestro Studio
- ✅ Soporte nativo para React Native

---

## 📦 Instalación

### 1. Instalar Maestro CLI

**macOS/Linux:**
\`\`\`bash
curl -Ls "https://get.maestro.mobile.dev" | bash
\`\`\`

**Windows:**
\`\`\`bash
# Usando WSL2
curl -Ls "https://get.maestro.mobile.dev" | bash
\`\`\`

### 2. Verificar Instalación

\`\`\`bash
maestro --version
\`\`\`

### 3. Instalar Simuladores/Emuladores

**iOS (macOS only):**
\`\`\`bash
# Los simuladores vienen con Xcode
xcode-select --install
\`\`\`

**Android:**
\`\`\`bash
# Instalar Android Studio y crear un emulador AVD
\`\`\`

---

## 🏗️ Estructura de Tests

\`\`\`
.maestro/
├── config.yaml                  # Configuración global
└── flows/                       # Tests organizados por flujo
    ├── 01-app-launch.yaml      # ✅ Test básico de inicio
    ├── 02-search-perfume.yaml  # 🔍 Búsqueda
    ├── 03-add-perfume.yaml     # ➕ Crear perfume
    ├── 04-filter-perfumes.yaml # 🎯 Filtros
    ├── 05-update-stock.yaml    # 📊 Actualizar stock
    ├── 06-edit-perfume.yaml    # ✏️ Editar perfume
    ├── 07-delete-perfume.yaml  # 🗑️ Eliminar perfume
    ├── 08-generate-pdf.yaml    # 📄 Generar PDF
    ├── 09-brand-management.yaml # 🏷️ Gestión de marcas
    ├── 10-pull-to-refresh.yaml # 🔄 Pull to refresh
    └── 11-complete-journey.yaml # 🎯 Smoke test completo
\`\`\`

### Convención de Nombres

- **Prefijo numérico**: Orden de ejecución (01, 02, 03...)
- **Nombre descriptivo**: `feature-action.yaml`
- **Smoke tests**: Marcados con "complete" o "journey"

---

## 🚀 Ejecutar Tests

### Tests Locales

#### 1. Preparar la App

**iOS:**
\`\`\`bash
# Opción 1: Desarrollo con Expo Go
npm start

# Opción 2: Build de desarrollo
npm run ios
\`\`\`

**Android:**
\`\`\`bash
# Opción 1: Desarrollo con Expo Go
npm start

# Opción 2: Build de desarrollo
npm run android
\`\`\`

#### 2. Ejecutar Tests

**Todos los tests:**
\`\`\`bash
npm run test:e2e
# o
maestro test .maestro/flows
\`\`\`

**Un solo test:**
\`\`\`bash
npm run test:e2e:single .maestro/flows/01-app-launch.yaml
# o
maestro test .maestro/flows/01-app-launch.yaml
\`\`\`

**Smoke test rápido:**
\`\`\`bash
npm run test:e2e:smoke
# o
maestro test .maestro/flows/11-complete-journey.yaml
\`\`\`

**Modo watch (re-ejecuta al cambiar):**
\`\`\`bash
npm run test:e2e:watch
# o
maestro test --watch .maestro/flows
\`\`\`

### Debugging con Maestro Studio

Maestro Studio es una herramienta interactiva para crear y debuggear tests:

\`\`\`bash
maestro studio
\`\`\`

Esto abre una interfaz web donde puedes:
- 👆 Grabar interacciones en la app
- 🔍 Inspeccionar elementos de la UI
- ✏️ Editar tests en vivo
- ▶️ Ejecutar comandos individuales

---

## ✍️ Escribir Tests

### Sintaxis Básica

Cada test es un archivo YAML con esta estructura:

\`\`\`yaml
appId: com.pnortiz.perfumario
---
# Descripción del test
- launchApp
- tapOn: "Botón"
- inputText: "Texto"
- assertVisible: "Elemento"
\`\`\`

### Comandos Más Usados

#### Navegación y Acciones
\`\`\`yaml
# Iniciar app
- launchApp

# Tap en elemento
- tapOn: "Texto del botón"
- tapOn:
    id: "buttonId"
- tapOn:
    accessibilityLabel: "Label"

# Input de texto
- inputText: "Mi texto"
- clearKeychain  # Limpiar input

# Scroll
- scroll
- scroll:
    direction: DOWN
    distance: 200

# Swipe
- swipe:
    direction: LEFT
    duration: 500
\`\`\`

#### Aserciones
\`\`\`yaml
# Verificar elemento visible
- assertVisible: "Texto"
- assertVisible:
    id: "elementId"

# Verificar elemento NO visible
- assertNotVisible: "Texto"

# Aserciones booleanas
- assertTrue: ${maestro.copilot.appHasLoaded}
\`\`\`

#### Esperas
\`\`\`yaml
# Esperar animaciones
- waitForAnimationToEnd

# Esperar elemento
- extendedWaitUntil:
    visible: "Elemento"
    timeout: 10000
\`\`\`

### Ejemplo Completo

\`\`\`yaml
appId: com.pnortiz.perfumario
---
# Test: Flujo completo de agregar perfume
- launchApp
- waitForAnimationToEnd

# Abrir modal
- tapOn:
    accessibilityLabel: "Añadir perfume"
- assertVisible: "Añadir perfume"

# Llenar formulario
- tapOn:
    text: "Nombre del perfume"
- inputText: "Chanel No. 5"

# Seleccionar género
- tapOn: "Mujer"

# Seleccionar marca
- tapOn:
    text: "Nombre de la marca"
- inputText: "Chanel"

# Guardar
- tapOn: "Guardar"
- waitForAnimationToEnd

# Verificar éxito
- assertVisible: "Chanel No. 5"
\`\`\`

### Best Practices

1. **Usar identificadores estables**
   \`\`\`yaml
   # ✅ Bien
   - tapOn:
       accessibilityLabel: "add_perfume_button"

   # ❌ Evitar (puede cambiar con traducciones)
   - tapOn: "Añadir perfume"
   \`\`\`

2. **Esperar entre acciones**
   \`\`\`yaml
   - tapOn: "Guardar"
   - waitForAnimationToEnd  # ✅ Importante
   - assertVisible: "Éxito"
   \`\`\`

3. **Tests independientes**
   - Cada test debe poder ejecutarse solo
   - No depender del estado de tests anteriores
   - Limpiar datos al final si es necesario

4. **Nombres descriptivos**
   \`\`\`yaml
   # ✅ Bien
   # Test: Usuario puede filtrar perfumes por género femenino

   # ❌ Evitar
   # Test 4
   \`\`\`

5. **Manejar múltiples idiomas**
   \`\`\`yaml
   # Usar | para múltiples opciones
   - assertVisible: "Guardar|Save"
   - tapOn: "Confirmar|Confirm"
   \`\`\`

---

## 🤖 CI/CD Integration

Los tests E2E se ejecutan automáticamente en GitHub Actions para Pull Requests.

### Workflow Actual

\`\`\`yaml
e2e-tests:
  runs-on: macos-latest  # Necesario para iOS Simulator
  needs: [lint, type-check]
  steps:
    - Install Maestro
    - Setup iOS Simulator
    - Build app
    - Run smoke test
    - Run all tests
    - Upload results
\`\`\`

### Ejecutar Localmente como CI

\`\`\`bash
# Simular CI pipeline localmente
npm run lint
npx tsc --noEmit
npm run test:e2e:smoke
npm run test:e2e
\`\`\`

---

## 🐛 Troubleshooting

### Problema: "App not found"

**Solución:**
\`\`\`bash
# Verificar que la app está instalada
maestro test --debug .maestro/flows/01-app-launch.yaml

# Verificar appId correcto
adb shell pm list packages | grep perfumario  # Android
xcrun simctl listapps booted | grep perfumario  # iOS
\`\`\`

### Problema: "Element not found"

**Solución:**
1. Usar Maestro Studio para inspeccionar elementos:
   \`\`\`bash
   maestro studio
   \`\`\`

2. Verificar que el elemento existe:
   \`\`\`yaml
   - extendedWaitUntil:
       visible: "Elemento"
       timeout: 10000
   \`\`\`

3. Usar regex para matching flexible:
   \`\`\`yaml
   - assertVisible: ".*perfume.*"
   \`\`\`

### Problema: Tests flaky

**Soluciones:**
1. Agregar más `waitForAnimationToEnd`
2. Aumentar timeouts:
   \`\`\`yaml
   - extendedWaitUntil:
       visible: "Elemento"
       timeout: 15000
   \`\`\`
3. Verificar estado antes de interactuar:
   \`\`\`yaml
   - assertVisible: "Botón"
   - tapOn: "Botón"
   \`\`\`

### Problema: Simulador no responde

**Solución:**
\`\`\`bash
# iOS
killall Simulator
open -a Simulator

# Android
adb kill-server
adb start-server
\`\`\`

---

## 📊 Cobertura de Tests

### Tests Implementados

| #  | Test | Flujo | Estado |
|----|------|-------|--------|
| 01 | App Launch | Inicio básico | ✅ |
| 02 | Search | Búsqueda de perfumes | ✅ |
| 03 | Add Perfume | Crear nuevo perfume | ✅ |
| 04 | Filter | Filtros por género/marca | ✅ |
| 05 | Update Stock | Actualizar inventario | ✅ |
| 06 | Edit Perfume | Editar perfume existente | ✅ |
| 07 | Delete Perfume | Eliminar perfume | ✅ |
| 08 | Generate PDF | Exportar reporte | ✅ |
| 09 | Brand Management | Gestión de marcas | ✅ |
| 10 | Pull to Refresh | Actualizar lista | ✅ |
| 11 | Complete Journey | Smoke test completo | ✅ |

**Total**: 11 tests cubriendo los flujos principales

---

## 🎯 Próximos Pasos

### Tests Adicionales Recomendados

1. **Offline Mode**
   - Verificar funcionamiento sin conexión
   - Sincronización al reconectar

2. **Validaciones de Formulario**
   - Campos requeridos
   - Validaciones de formato

3. **Estados de Error**
   - Errores de red
   - Errores de API

4. **Dark Mode**
   - Cambio de tema
   - Persistencia de preferencia

5. **Multilenguaje**
   - Cambio de idioma
   - Verificar traducciones

### Mejoras Futuras

- 🎥 Screenshots automáticos en fallos
- 📈 Reportes de cobertura
- 🔄 Tests de regresión visual
- ⚡ Paralelización de tests

---

## 📚 Recursos Adicionales

- [Maestro Docs](https://maestro.mobile.dev/getting-started/installing-maestro)
- [Maestro Examples](https://github.com/mobile-dev-inc/maestro/tree/main/maestro-test/src/androidTest/resources/e2e)
- [Maestro Discord](https://discord.gg/maestro)

---

## 🤝 Contribuir

Al agregar nuevas funcionalidades, por favor:

1. ✅ Agregar tests E2E correspondientes
2. ✅ Seguir la convención de nombres
3. ✅ Documentar casos edge
4. ✅ Verificar que pasan en CI/CD

---

**Última actualización**: 2025-11-05
**Mantenido por**: Claude AI Assistant
