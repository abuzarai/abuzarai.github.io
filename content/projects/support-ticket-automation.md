+++
title = "Support Ticket Analysis & Response Automation"
description = "Support automation that triages tickets and drafts replies in the customer's own language via a QLoRA fine-tune of Qwen2.5-3B. Nothing ships without human review."
weight = 2

[extra]
repository = "https://github.com/abuzarai/support-ticket-automation"
technologies = ["FastAPI", "QLoRA", "Qwen2.5-3B", "Ollama", "SQLite"]
+++

Customers in Pakistan write support tickets in *Roman Urdu* ("mera order kab aayega"),
often code-switched with Urdu script and English in a single message.

Tickets come in by email or web form and get triaged in one structured call:
category (8 classes), urgency, sentiment, and key entities (order ID,
product). A reply draft is then generated in the customer's own language,
grounded in your uploaded knowledge-base policy documents (PDF/DOCX/MD) and
checked for groundedness. Nothing ships without a human review: tickets
land in a review-first inbox where an operator approves, corrects, or
discards each draft.

The engine is a QLoRA fine-tune of Qwen2.5-3B-Instruct that hits **80.4%
category accuracy** (0-shot: 25%; an unnamed 70B baseline: 63.5%) with
**100% valid JSON output**, at zero per-inference cost on local hardware via
Ollama. One Pydantic schema and one prompt template are shared across
training, evaluation, the API, and the UI; no drift between what was trained
and what runs.

Published to Hugging Face: [LoRA adapter (~57 MB)](https://huggingface.co/abuzarkhan/bilingual-ticket-triage-adapter),
[dataset](https://huggingface.co/datasets/abuzarkhan/bilingual-ticket-triage-dataset), [GGUF weights](https://huggingface.co/abuzarkhan/bilingual-ticket-triage-gguf), and a live [Gradio demo Space](https://huggingface.co/spaces/abuzarkhan/bilingual-ticket-triage)
that runs the fine-tuned model on ZeroGPU in the browser.
