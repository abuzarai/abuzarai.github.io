+++
title = "Insafdaar"
description = "Legal case management for Pakistani law firms: cases, hearings, documents, and billing, wrapped around AI voice intake, document drafting, and legal RAG."
weight = 1

[extra]
repository = "https://github.com/abuzarai/insafdaar-webapp"
technologies = ["React", "Express", "PostgreSQL", "FastAPI", "Gemini", "Docker"]
+++

The interesting part is what happens *between* the CRUD screens. Every case
walks a 13-stage lifecycle modeled as a state machine; no case ever lands in
the wrong stage.

Across three portals (client, advocate, admin), users get JWT auth with
role-based access, OTP-based e-contract signing, and PDF invoice/voucher
generation with payment verification. OCR extracts documents, advocate
matching ranks lawyers by fit, and Google Calendar and Meet plug in for
scheduling. The React SPA with Tailwind CSS is bilingual (English/Urdu via
react-i18next), served behind Nginx, deployed on Oracle Cloud with Docker
Compose and CI/CD via GitHub Actions.

Three standalone AI microservices, all FastAPI on Cloud Run, plug in via
REST APIs and webhooks:

- **[AI Document Drafting](https://github.com/abuzarai/drafting-assistant)**:
  generates 9 types of legal documents (plaints, affidavits, appeals,
  contracts) with Gemini 2.5 Flash on Vertex AI; it pulls case context from
  the database, runs it through a multi-stage generation pipeline, and
  exports formatted DOCX/PDF. Supports section-level regeneration with
  custom advocate instructions.

- **[Voice Intake Agent](https://github.com/abuzarai/voice-intake-agent)**:
  conducts bilingual (Urdu/English) intake interviews over WebSocket audio,
  with GCP Speech-to-Text for real-time transcription and Gemini 2.5 Flash
  for conversation flow and entity extraction; structured JSON out with
  parties, locations, dates, amounts. Audio stays in GCS for 7 days.

- **[Legal RAG Assistant](https://github.com/abuzarai/legal-rag-assistant)**:
  self-hosted Weaviate (v4) on GCE; ingests Pakistani case law and CPC
  section PDFs from Google Drive, chunks and embeds them (Gemini
  text-embedding-005), and answers legal questions with cited sources via
  hybrid search and Gemini 2.5 Flash.
