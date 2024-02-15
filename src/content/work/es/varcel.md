---
title: Varcel
publishDate: 2020-03-02 00:00:00
img: /assets/projects/varcel/banner.jpg
img_alt: banner del projecto varcel donde se muestra la pantalla de la aplicación para desplegar un proyecto
lang: es
description: |
  Aplicación full-stack de infraestructura como servicio (Clon de Vercel). Frontend con React.js, backend con Node.js y despliegue en AWS.
tags:
  - Diseño de Sistema
  - React.js
  - Node.js
  - DevOps
  - AWS
---

### Aplicación full-stack de infraestructura como servicio (Clon de Vercel)

#### Links

Demo: <a href="https://varcel.acerohernan.com" target="_blank">https://varcel.acerohernan.com</a>

Github: <a href="https://github.com/acerohernan/varcel" target="_blank">https://github.com/acerohernan/varcel</a>

#### Descripción

Me encanta la experiencia de desarrollo que Vercel brinda con una interfaz web para desplegar aplicaciones front-end en la nube con un solo click. Por ello, decidí crear una aplicación desde cero con la misma misión.

#### Funcionalidades

Las principales características implementadas son:

- Permitir que los usuarios inicien sesión con sus cuentas de GitHub.
- Proporcionar a los usuarios una aplicación GitHub para integrar sus repositorios públicos y privados en la aplicación.
- Permitir a los usuarios seleccionar un repositorio con código de aplicación front-end e implementarlo en la nube con un solo click.
- Permitir a los usuarios ver los logs de compilación y despliegue en tiempo real desde la página de despliegues en Varcel.
- Después de una despliegue exitoso, proporcionar un enlace único a los usuarios para acceder a su aplicación desde todo el mundo.
- Permitir a los usuarios activar automáticamente un despliegue cada vez que se modifica el código en el repositorio.

#### Desafíos Técnicos

Como sabemos, cada característica que debe implementarse conlleva la responsabilidad de evaluar las compensaciones para cada solución posible. En este caso, tuve las siguientes dificultades:

- Una aplicación front-end de alto rendimiento que proporciona una experiencia de usuario única para implementar y administrar todos los proyectos del usuario.
- Un servicio API-REST que autentica a los usuarios con GitHub, almacena información de los usuarios como proyectos e implementaciones, y pone en cola las implementaciones de los usuarios.
- Un servicio en tiempo real que puede escalarse horizontalmente utilizando un protocolo con estado como WebSockets y puede mostrar los registros de compilación e implementación en tiempo real a los usuarios.
- Un servicio que puede tener un endpoint público seguro para escuchar eventos de GitHub, p. cuando se envía un nuevo código o cuando se crea una nueva solicitud de extracción. (webhook)
- Una red de entrega de contenido (CDN) para que cada usuario distribuya todas sus aplicaciones en todo el mundo. Es importante tener una CDN para cada uno para controlar su uso y facturarlos correctamente.

#### Diseño de sistema

Una vez que tuve las características que quería implementar y todos los desafíos técnicos que necesitaba tener en cuenta, comencé a crear un diseño de sistema para definir todos los componentes que necesitará la aplicación.

<img src="/assets/projects/meet/system-design.png" alt="meet system design diagram" />

1. Cliente: Aplicación front-end multiplataforma que permite la correcta comunicación con la API REST y el servicio en tiempo real.
2. Servicio API REST: el servicio que proporciona autenticación social con una cuenta de GitHub, maneja las lecturas y escrituras de la información del usuario en la base de datos y pone en cola los proyectos que se implementarán para el servicio de creación.
3. Servicio de creación: el servicio encargado de descargar el código del repositorio de GitHub, crear el paquete de código e implementar toda la infraestructura necesaria para alojarlo en la nube. Consume las tareas pendientes de la cola de mensajes para evitar sobrecargar el servicio.
4. Servicio en tiempo real: El servicio encargado de enviar los registros desde el servicio del constructor a la aplicación cliente en tiempo real. Además, permitirá la comunicación bidireccional entre el cliente y el servicio constructor.
5. Webhook: endpoint público que solo escuchará nuevos eventos de GitHub en las cuentas del usuario para activar nuevas implementaciones.
6. CDN: una red de entrega de contenido específica para el usuario, para permitir distribuir la aplicación del usuario en todo el mundo.

#### Diseño de sistema para AWS

<img src="/assets/projects/meet/cloud-diagram.jpeg" alt="meet cloud-specific system design diagram" />

Este es el diagrama para implementar la aplicación en AWS. Debido a su complejidad, preferí mostrar solo la infraestructura para implementar en una única región de AWS. Ahora explicaré los componentes.

Primero, el punto de entrada para todo será la Ruta 53 para la resolución DNS.

En segundo lugar, la aplicación frontend será una SPA (aplicación de página única), por lo que su paquete se almacenará en un depósito S3 y se entregará en todo el mundo con CloudFront.

En tercer lugar, para alojar los servicios principales, necesitaré crear una VPC (Nube privada virtual) para la región principal con todos los componentes necesarios para comunicar las instancias EC2 con Internet (Internet Gateway, VPC Router, Load balancer, ECS Cluster). ). No incluí el balanceador de carga ni el clúster ECS en el diagrama para simplificarlo. Además, para garantizar la disponibilidad de los servicios, puedo implementar otras instancias en diferentes zonas de disponibilidad y utilizarlas como conmutación por error.

Cuarto, para la base de datos principal, usaré RDS para PostgreSQL, lo que permitirá implementar réplicas de lectura si es necesario y configurar un intervalo de respaldo.

En quinto lugar, para escalar horizontalmente el servicio en tiempo real, necesitaré implementar una instancia de ElasticCache para Redis que proporcione un estado compartido entre las instancias y una funcionalidad de publicación/subscripción para equilibrar la carga de los mensajes en tiempo real.

En sexto lugar, para poner en cola las implementaciones del usuario, usaré AWS SNS y SQS como cola de mensajes para almacenar y distribuir los mensajes en el clúster de Builder Service. Es importante configurar un enlace privado de VPC para establecer una conexión segura con estos servicios de AWS.

Finalmente, para alojar las aplicaciones del usuario, tendré un AWS CloudFront específico, un depósito S3 y una tabla de DynamoDB para cada usuario, de modo que cada vez que se cree una nueva implementación, el servicio Builder almacenará el paquete de front-end en el S3 del cliente y almacene la ubicación en la tabla de Dynamo DB. Cuando otra persona quiera visitar la aplicación del usuario, accederá a un subdominio creado para el usuario, el subdominio activará CloudFront, que le preguntará a DynamoDB dónde se encuentra el paquete de la aplicación y lo distribuirá de manera efectiva.

