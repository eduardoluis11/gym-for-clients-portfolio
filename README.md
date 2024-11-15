# Web App para Clientes

Esta web app es solo para los clientes del Gimnasio.

Desde aquí los clientes solo podrán ver sus propios datos. NO PODRÁN VER LOS DATOS DE OTROS CLIENTES.

También podrán ver su propio código QR desde aquí.

Además, solo podrán ver sus propias notificaciones.

## Actualización del 10/24 de Eduardo

Para instalar todos los paquetes npm de React necesarios de una sola vez, basta con usar el siguiente comando:

```bash
npm install --legacy-peer-deps
```

### Paquete npm agregado

Agregué el paquete npm de "date-fns" para poder formatear las fechas de las notificaciones push.

Esto instalará el next, el firebase, y cualquier otro paquete necesario sin tener que estar instalando cada paquete por separado.

## Actualización del 8/24 de Eduardo

### Notificaciones Push

#### Notificaciones desde un Ordenador vs Notificaciones desde Dispositivos Móviles

Al parecer, las notificaciones push para la versión de ordenadores solo las recibirán los usuarios si minimzan y se salen de las web apps de React. NO podrán ver las notificaciones push DENTRO de la web app si usan la web app desde un portátil u otro ordenador. Sin embargo, las notificaciones push siempre les deberían salir en los dispositivos móviles, estés dentro o fuera de la web app de React. 

Para que los usuarios puedan recibir notificaciones push DENTRO de la web app de React, tienen que meterse desde un android o un iphone. Tendré que descargarme el android studio o cualquier otro emulador de android para probar si las notificaciones push de mi web app funcionan en android. Ya creo que entendí esto: noto que, si yo envío la notificación push desde la web app de React, y sigo con la web app de React abierta, NO recibo ninguna notificación push en mi portátil. Pero, si minimizo el navegador con esa web app de REact, y envío la notificación push desde la web app de Django, entonces sí me sale la notificación push de la web app de React. Tal vez en dispositivos móviles, si me saldría la notificación push, aun aunque tuviera abierta la web app de React.

### Posibles Problemas de Ciberseguridad

Idealmente, los archivos firebase.js y firebase-messaging-sw.js no se deberían subir a GitHub, ya que tienen credenciales que deberían mantenerse en secreto. SIN EMBARGO, para que las web apps de React sean lo más fácil posible de usar, tuve que subir esos archivos al repositorio de GitHub.

Necesito esos 2 archivos para que las notificaciones push funcionen.

## Instrucciones

### Instala los paquetes de React usando npm

Instala los paquetes de React usando npm. Primero, instala el Next.js. Para ello, ejecuta el siguiente comando en la terminal:

```bash
npm install next --legacy-peer-deps
```

Luego, instala el JWT Decode usando npm. Para ello, ejecuta el siguiente comando en el terminal:

```bash
npm install jwt-decode --legacy-peer-deps
```

### Instala Firebase

Para poder recibir Notificaciones Push, necesitas tener el Firebase instalado.

Para instalar Firebase, usa el siguiente comando:

```bash
npm install firebase --legacy-peer-deps
```

## Uso de Inteligencias Artificiales Generativas
Se usó Copilot de GitHub, ChatGPT, y otras inteligencias artificiales para crear parte del código de esta web app.

## Otras observaciones



This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
