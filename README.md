# SAP AI ERP Assistant

An AI-powered ERP Assistant built with **React, Spring Boot, PostgreSQL, SAP S/4HANA integration, and Generative AI**.

The system combines traditional ERP operations with AI-powered assistance, inventory intelligence, analytics, authentication, and SAP integration into a full-stack application.

---

## 🚀 Project Overview

The SAP AI ERP Assistant is a full-stack ERP application designed to manage core enterprise operations such as:

- Materials
- Vendors
- Purchase Orders
- Inventory
- Goods Receipt
- Goods Issue
- Inventory Transactions
- Dashboard & Analytics
- User Authentication
- Role-Based Authorization
- SAP S/4HANA Integration
- AI-Powered ERP Assistance

The project follows a layered architecture with a React frontend, Spring Boot backend, PostgreSQL database, SAP integration layer, and Generative AI layer.

---

## 🏗️ System Architecture

```text
                         ┌─────────────────────────┐
                         │       User / Employee   │
                         └────────────┬────────────┘
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │     React Frontend      │
                         │ Dashboard / ERP / AI UI │
                         └────────────┬────────────┘
                                      │ REST API
                                      ▼
                 ┌────────────────────────────────────────┐
                 │          Spring Boot Backend            │
                 │                                        │
                 │ Authentication & Authorization          │
                 │ ERP Services                            │
                 │ Inventory Intelligence                  │
                 │ Dashboard & Analytics                   │
                 │ AI Service                              │
                 │ SAP Connector                           │
                 └───────────────┬───────────────┬────────┘
                                 │               │
                    ┌────────────▼───────┐   ┌───▼────────────────┐
                    │     PostgreSQL     │   │   SAP S/4HANA      │
                    │    ERP Database    │   │   Integration      │
                    └────────────────────┘   └────────────────────┘
                                 │
                                 │
                    ┌────────────▼────────────┐
                    │     Generative AI       │
                    │     AI ERP Assistant    │
                    └────────────────────────┘