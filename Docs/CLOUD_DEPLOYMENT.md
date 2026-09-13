# Phase 14 — SAP BTP / Cloud Deployment

## 1. Objective

The objective of Phase 14 was to deploy the SAP AI ERP Assistant application from the local development environment to SAP Business Technology Platform (SAP BTP).

The application was deployed using the Cloud Foundry environment available in SAP BTP.

The deployment includes:

- React frontend
- Spring Boot backend
- REST API communication
- PostgreSQL cloud database
- JWT-based authentication and role-based authorization
- SAP BTP Cloud Foundry hosting

---

## 2. SAP BTP Environment

The application was deployed to the SAP BTP Cloud Foundry environment.

### Cloud Foundry Details

- Organization: `459b8bd0trial`
- Space: `dev`
- Region: `ap21`
- Deployment Platform: SAP BTP Cloud Foundry

---

## 3. Application Deployment

Two separate applications were deployed to SAP BTP.

### Backend

The Spring Boot backend was deployed as:

```text
sap-ai-erp-backend