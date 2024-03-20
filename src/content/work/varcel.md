---
title: Varcel
publishDate: 2020-03-02 00:00:00
img: /assets/projects/varcel/banner.jpg
img_alt: varcel banner featuring the configuration page for creating a deployment
lang: en
description: |
  Full-stack infrastructure as a service application (Vercel clone). Frontend with React.js, backend with Node.js and deployment in AWS.
tags:
  - System Desing
  - React.js
  - Node.js
  - DevOps
  - AWS
hide: true
---

### Full-stack infrastructure as a service application (Vercel clone).

#### Links

Demo: <a href="https://varcel.acerohernan.com" target="_blank">https://varcel.acerohernan.com</a>

Github: <a href="https://github.com/acerohernan/varcel" target="_blank">https://github.com/acerohernan/varcel</a>

#### Overview

I love the delightful developer experience that Vercel provides with a web interface for deploying front-end applications to the cloud with one click. For this reason, I decided to create an application from scratch with the same functionality.

#### Features

The main features implemented are:

- Allow users to log in using their GitHub accounts.
- Provide users with a GitHub App for creating a seamless integration with their public and private repositories in GitHub
- Allow users to select a repository and deploy it to the cloud with only one click
- Allow users to see the build and deployment logs in real-time from Varcel’s deployment page
- After a successful deployment, provide a unique link to users for accessing their application from all over the world.
- Allow users to automatically trigger a deployment each time there’s a new code pushed to the repository

#### Technical Challenges

As we know, every feature that needs to be implemented comes with the responsibility of evaluating trade-offs for each possible solution. In this case, I had the next difficulties:

- A front-end application that provides a good user experience and allows a seamless communicacion with the API REST service and the real-time service.
- An API-REST service that authenticates users with GitHub, stores users’ information like projects and deployments, and queues pending users’ deployments.
- A real-time service that can scale horizontally using a stateful protocol like WebSockets and can show the build and deployment logs in real-time to the users.
- A service that has a secure public endpoint for listening to new GitHub events e.g. when new code is pushed or when a new pull request is created. (Webhook)
- A content delivery network (CDN) for every user to distribute all their applications to all over the world. It’s important to have a CDN for each one to control their usage and bill them correctly.

#### System Design

Once I had the features I wanted to implement and all the technical challenges I needed to consider, I created a cloud-agnostic system design to define all the components the application would need.

<img src="/assets/projects/varcel/system-design.jpeg" alt="meet system design diagram" />

1. Client: A multi-platform front-end application that allows the correct communication with the API REST and the real-time service.
2. API REST service: The service that provides social authentication with a GitHub account, handles the reads and writes of the user’s information to the database, and queues the projects to be deployed for the builder service. 
3. Builder service: The service in charge of downloading the code from the GitHub repository, building the code bundle, and deploying all the required infrastructure to host it in the cloud. It consumes the pending tasks from the message queue to avoid overloading the service. 
4. Real-time service: The service in charge of sending the logs from the builder service to the front-end application in real-time. Also, it will allow the bi-directional communication between the front-end and the builder service.
5. Webhook: Public endpoint that only listens for new GitHub events on the user’s accounts for triggering new deployments. 
6. CDN: A content delivery network specific for the user, to allow distributing the user’s application all over the world

#### AWS System Design

<img src="/assets/projects/varcel/cloud-diagram.jpeg" alt="meet cloud-specific system design diagram" />

This is the diagram for deploying the application to AWS. Due to its complexity, I preferred to show only the infrastructure for deploying in a single AWS Region. Now I will explain the components.

First, the entry point for everything will be Route53 for DNS resolution. 

Second, the frontend application will be an SPA (Single Page Application) so its bundle will be stored in an S3 bucket and delivered worldwide with CloudFront. 

Third, for hosting the main services, I’ll need to create a VPC (Virtual Private Cloud) for the main region with all the required components to communicate the EC2 instances with the internet (Internet Gateway, VPC Router, Load balancer, ECS Cluster). I didn’t include the load balancer and ECS cluster in the diagram to simplify it. Furthermore, to ensure the availability of the services, I can deploy other instances in different availability zones and use them as a failover.

Fourth, for the main database, I will use RDS for PostgreSQL which will allow deploy read replicas if necessary and set up a backup interval.

Fifth, for scaling the real-time service horizontally, I will need to deploy a ElasticCache for Redis instance that will provide a shared state between the instances and a pub/sub functionality for load balancing the real-time messages.

Sixth, for queueing the user’s deployments, I’ll use AWS SNS and SQS as a message queue for storing and distributing the messages in the Builder Service cluster. It’s important to configure a VPC private link to establish a secure connection with these AWS services.

Finally, for hosting the user’s applications, I will have a specific AWS CloudFront, an S3 bucket, and a DynamoDB table for each user, so, every time a new deployment is created, the Builder service will store the front-end bundle to the client’s S3 and store the location to it in the Dynamo DB’s table. When another person wants to visit the user’s app, it will hit a subdomain created for the user, the subdomain will trigger CloudFront, which will ask DynamoDB where is located the app’s bundle and it will distribute it effectively.