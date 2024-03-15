---
title: Meet
publishDate: 2020-03-04 00:00:00
img: /assets/projects/meet/banner.jpg
img_alt: Pantalla principal de la aplicación antes de ingresar a una video conferencia
lang: es
description: |
  Aplicación full-stack de video conferencia con despliegue en multiples regiones. Frontend realizado con React.js, backend con Go y despliegue en Amazon Web Services.
tags:
  - Diseño de sistema
  - React.js
  - Go
  - DevOps
  - AWS
hide: true
---

### Aplicación de video conferencia en tiempo real

#### Links

Demo: <a href="https://meet.acerohernan.com" target="_blank">https://meet.acerohernan.com</a>

Github: <a href="https://github.com/acerohernan/meet" target="_blank">https://github.com/acerohernan/meet</a>

#### Descripción

Siempre me ha sorprendido ver cómo Google Meet nos permite comunicarnos con personas de todo el mundo, por eso decidí hacer un proyecto de código abierto que replique su funcionalidad y permita escalar al máximo número de usuarios posible.

#### Funcionalidades

El objetivo principal del proyecto es ser una aplicación de videoconferencia escalable y para lograrlo necesitaba separar las funcionalidades de la siguiente manera:

- Permitir a los participantes crear una llamada desde cualquier parte del mundo.
- Permitir que los participantes tengan comunicación bidireccional en tiempo real con el servidor.
- Permitir a los participantes enviar y recibir media (audio y video) de todos los participantes conectados en la sala.
- Permitir que los administradores de la sala expulsar o silenciar a cualquier participante.
- Permitir que los participantes vean a todos los participantes conectados en tiempo real.
- Permitir que los invitados soliciten acceso a la llamada en tiempo real.

#### Desafíos Técnicos

Como sabemos, cada característica que debe implementarse conlleva la responsabilidad de evaluar las ventajas y desventajas de cada solución posible. En este caso, tuve los siguientes retos:

- Una aplicación del lado del servidor que puede escalarse horizontalmente utilizando un protocolo con estado como web sockets.
- Capacidad para desplegar muchos servidores en diferentes regiones del mundo que sean cercanas al usuario final.
- Recibir audio y video a través de conexiones WebRTC y reenviarlos a todos los participantes, en lugar de tener conexiones activas entre los participantes. (Unidad de Reenvío Selectivo)
- Equilibrar la carga de mensajes en tiempo real para evitar sobrecargar el servidor que aloja la sala.

#### Diseño de sistema

Una vez que tuve las características que quería implementar y todos los desafíos técnicos que necesitaba tener en cuenta, comencé a crear un diseño de sistema para definir todos los componentes que necesitará la aplicación.

<img src="/assets/projects/meet/system-design.png" alt="meet system design diagram" />

1. Cliente: una aplicación front-end de alto rendimiento que puede proporcionar una buena experiencia de usuario y respaldar la comunicación con el servidor.
2. SFU: La Unidad de Reenvío Selectivo (Selective Forwaring Unit), es el componente principal que es el servidor encargado de mantener el estado de todos los participantes conectados y reenviar todos los mensajes, audio y video en tiempo real a todos los participantes.
3. Base de datos en memoria: para la comunicación en tiempo real, necesitaba una base de datos rápida y eficiente que pudiera almacenar todo el estado que quería compartir entre todos los servidores, por ejemplo, que servidor alberga una sala específica o que servidor tiene una conexión un participante específico. Conociendo que el estado no necesita ser persistente y solo debe estar disponible mientras una sala está activa, elegí usar una base de datos en memoria como Redis.
4. Cola de mensajes: para tener la capacidad de escalar cada servidor horizontalmente y soportar la cantidad máxima de participantes conectados al mismo tiempo en una sala específica, cada servidor estará suscrito a una cola específica que recibirá mensajes en tiempo real de otros servidores. Este enfoque permitirá equilibrar la carga de mensajes entrantes evitando sobrecargar el servidor.

#### Diseño de sistema para AWS

Una vez completado el diseño del sistema, es hora de elegir el proveedor de la nube y qué componentes me ayudarán a crear la infraestructura.

<img src="/assets/projects/meet/cloud-diagram.jpeg" alt="meet cloud-specific system design diagram" />

Este diagrama muestra todos los componentes principales de la infraestructura para desplegar el sistema en AWS. A continuación los explicaré detalladamente:

Primero, el punto de entrada para todo será Route53 para la resolución DNS.

En segundo lugar, la aplicación frontend será una SPA (aplicación de página única), por lo que su contenido se almacenará en un bucket de S3 y se distribuirá en todo el mundo con CloudFront.

En tercer lugar, para alojar el servidor, necesitaré crear una VPC (nube privada virtual) para la región principal con todos los componentes necesarios para comunicar la instancia con el internet (Internet Gateway, VPC Router, Load balancer, ECS Cluster). No incluí el balanceador de carga ni el clúster ECS en el diagrama para simplificarlo. Además, para garantizar la disponibilidad del servicio, puedo implementar otras instancias del servidor en otra zona de disponibilidad y conectarlo al balanceador de carga para usarlas como respaldo si ocurre algún error.

En cuarto lugar, la cola de mensajes y el almacenamiento en memoria serán proporcionados por ElastiCache para Redis, que admite el almacenamiento y la funcionalidad de publicación/subscripción. Para usarlo, crearé un clúster de Elasticache para implementar una instancia maestra de Redis y, según el rendimiento, poder escalarlo verticalmente hasta que necesitemos distribuir la carga de lectura con otras réplicas de lectura en distintas regiones.

Finalmente, para escalar a otras regiones de AWS, podemos deplegar otras VPC y conectarlas con la VPC de la región principal con "VPC peering connection", esto permitirá que nuestros servidores dentro de la otra región se conecten a la instancia principal de Redis. Como dije antes, si la instancia de Redis no se puede escalar verticalmente, podemos crear una réplica de lectura para distribuir la carga en otras regiones.
