# SAP AI ERP Assistant — Database

## Database Technology

The SAP AI ERP Assistant uses PostgreSQL as its application database.

- Database: PostgreSQL
- Database Name: `sap_erp_db`
- Schema: `public`
- ORM: Hibernate / JPA
- Persistence Layer: Spring Data JPA

## Purpose

The PostgreSQL database stores the application's ERP data and supports the Spring Boot backend.

The database is used by the backend for:

- Materials
- Vendors
- Purchase Orders
- Inventory transactions
- User and authentication data
- ERP analytics and reporting data

## Application Integration

The Spring Boot backend connects to PostgreSQL through the configured datasource.

JPA/Hibernate is responsible for mapping Java entities to database tables and managing persistence operations.

## Verification

The database connection has been verified during automated backend testing.

The application successfully connected to PostgreSQL and initialized the JPA `EntityManagerFactory`.

## Architecture

```text
React Frontend
      ↓
Spring Boot REST API
      ↓
Service Layer
      ↓
Spring Data JPA / Hibernate
      ↓
PostgreSQL
      ↓
sap_erp_db