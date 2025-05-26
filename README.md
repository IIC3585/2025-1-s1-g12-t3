# Proyecto de Intercambio de Monedas (Vue y Svelte)

Este proyecto consiste en construir dos versiones de una aplicación de Intercambio de Monedas, una utilizando Vue.js y la otra utilizando Svelte.js, como parte de un desafío de desarrollo.

## El Desafío

El núcleo de este desafío es desarrollar la misma funcionalidad de aplicación utilizando dos frameworks JavaScript populares diferentes: Vue.js y Svelte.js. El objetivo es construir la aplicación primero en Vue y luego replicar sus características principales en Svelte.

Nuestro grupo (Grupo 12) tiene la tarea de construir la aplicación **MoneyExchange**.

## Aplicación MoneyExchange

La aplicación MoneyExchange es un conversor de divisas que permite a los usuarios intercambiar entre diferentes monedas. Las características clave incluyen:

- **Tasas de Cambio en Tiempo Real:** Se conecta con una API externa para obtener las tasas de cambio actuales.
- **Interfaz Fácil de Usar:** Entrada simple para la cantidad y selección de las monedas 'desde' y 'hacia'.
- **Conversión Inversa:** Capacidad para intercambiar fácilmente las monedas 'desde' y 'hacia'.
- **Datos Históricos:** (Opcional, basado en la originalidad) Mostrar datos históricos de tasas de cambio.

La aplicación está diseñada utilizando múltiples componentes e incluye soluciones para la gestión del estado y el manejo de estilos.

## Estructura del Proyecto

El espacio de trabajo contiene dos directorios principales:

- `money-exchange-vue/`: Contiene la implementación de la aplicación MoneyExchange en Vue.js.
- `money-exchange-svelte/`: Contiene la implementación de la aplicación MoneyExchange en Svelte.js.

## Configuración y Ejecución

Cada directorio de proyecto (`money-exchange-vue` y `money-exchange-svelte`) tiene su propio `package.json` y dependencias. Para configurar y ejecutar cada aplicación, navega al directorio respectivo en tu terminal y sigue los pasos estándar para proyectos de Vue/Svelte:

1.  **Instalar Dependencias:**

    ```bash
    npm install
    # o
    yarn install
    # o
    pnpm install
    ```

2.  **Configurar Clave de API:**
    Ambas aplicaciones requieren claves de API para los servicios de intercambio de divisas. Crea un archivo `.env` en el directorio raíz de cada proyecto (`money-exchange-vue/.env` y `money-exchange-svelte/.env`) y añade las claves de API necesarias. Consulta el código del proyecto (por ejemplo, `src/services/currencyService.ts` o `.js`) para identificar las variables de entorno requeridas (por ejemplo, `VITE_CURRENCY_API_KEY`, `VITE_OPEN_EXCHANGE_API_ID`).

3.  **Ejecutar el Servidor de Desarrollo:**

    ```bash
    npm run dev
    # o
    yarn dev
    # o
    pnpm dev
    ```

Esto iniciará un servidor de desarrollo local y podrás acceder a la aplicación en tu navegador.

## Despliegue

La versión de Svelte de la aplicación está desplegada y puede verse aquí:
[https://t4-svelte.web.app/](https://t4-svelte.web.app/)

## Evaluación

El proyecto será evaluado en base a la calidad del trabajo (60%) y la efectividad de la presentación (40%). Se fomenta y premiará la originalidad en las características e implementación.

## Presentaciones

Nuestro grupo (Grupo 12) presentará la **versión Svelte de MoneyExchange** el Miércoles 28 de mayo.