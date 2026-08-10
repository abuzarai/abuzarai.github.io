+++
title = "insafdaar"
weight = 1
description = "legal case-management web app (Express · React · PostgreSQL)"
[extra]
link = "https://github.com/abuzarai/insafdaar-webapp"

[taxonomies]
tags = ["fullstack", "ai", "react"]
+++

A full-stack legal case-management platform for Pakistani courts and law
firms: cases, hearings, documents, and billing in one system.

The interesting part is what happens *between* the CRUD screens. Every case
walks a 13-stage lifecycle modeled as a state machine — no case ever lands in
the wrong stage. Across three portals (client, advocate, admin), users get JWT
auth with role-based access, OTP-based e-contract signing, and PDF
invoice/voucher generation with payment verification — plus OCR document
extraction, AI-ranked advocate matching, Google Calendar and Meet integration,
real-time notifications, and scheduled email reminders. The React SPA with
Tailwind CSS is bilingual (English/Urdu via react-i18next), served behind
Nginx, deployed on Oracle Cloud with Docker Compose and CI/CD via GitHub
Actions.

Three standalone AI microservices plug in via REST APIs and webhooks:

- **[AI Document Drafting](https://github.com/abuzarai/drafting-assistant)** —
  FastAPI service on Cloud Run. Generates 9 types of legal documents
  (plaints, affidavits, appeals, contracts) with Gemini 2.5 Flash on Vertex
  AI — case context assembled from the database, run through a multi-stage
  generation pipeline, exported as formatted DOCX/PDF. Supports section-level
  regeneration with custom advocate instructions.

- **[Voice Intake Agent](https://github.com/abuzarai/voice-intake-agent)** —
  FastAPI service on Cloud Run. Set up bilingual (Urdu/English) intake
  interviews over WebSocket audio. GCP Speech-to-Text for real-time
  transcription, Gemini 2.5 Flash for conversation flow and entity
  extraction; structured JSON out with parties, locations, dates, amounts.
  Audio stored in GCS with 7-day retention.

- **[Legal RAG Assistant](https://github.com/abuzarai/legal-rag-assistant)** —
  FastAPI service on Cloud Run with self-hosted Weaviate (v4) on GCE.
  Ingests Pakistani case law and CPC section PDFs from Google Drive, chunks
  and embeds them (Gemini text-embedding-005), and answers legal questions
  with cited sources via hybrid search and Gemini 2.5 Flash.

**Built with:** Express · React · PostgreSQL · Gemini 2.5 Flash · FastAPI ·
Weaviate · Docker.