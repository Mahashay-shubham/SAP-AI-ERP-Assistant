# SAP AI ERP Assistant

## 1. Project Overview

SAP AI ERP Assistant is an AI-powered ERP application designed to combine ERP management, analytics, SAP integration, and an AI assistant in a full-stack architecture.

The application provides ERP functionality through a React frontend and Spring Boot backend, with PostgreSQL used for application persistence.

## 2. Technology Stack

### Frontend
- React
- Vite
- JavaScript
- Axios
- CSS

### Backend
- Java
- Spring Boot
- Spring Security
- JWT Authentication
- Spring Data JPA
- Hibernate
- REST APIs

### Database
- PostgreSQL
- Database: `sap_erp_db`

### SAP Integration
- SAP S/4HANA concepts
- SAP API / OData integration
- SAP S/4HANA integration layer

### AI
- AI-powered ERP Assistant
- ERP context preparation
- Generative AI integration

## 3. System Architecture

```text
                    User
                     |
                     v
              React Frontend
                     |
                     v
              REST API Layer
                     |
                     v
             Spring Boot Backend
                     |
        +------------+------------+
        |            |            |
        v            v            v
 Authentication   ERP Services   AI Service
        |            |            |
        |            v            |
        |       PostgreSQL        |
        |                         |
        +----------+--------------+
                   |
                   v
             SAP Integration
                   |
                   v
              SAP S/4HANA