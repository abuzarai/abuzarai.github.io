+++
title = "triage-bot"
weight = 2
description = "bilingual ticket triage + draft replies (QLoRA · Qwen)"
[extra]
link = "https://huggingface.co/abuzarkhan/bilingual-ticket-triage"

[taxonomies]
tags = ["nlp", "fine-tuning"]
+++

An end-to-end support automation system for teams whose customers write in
*Roman Urdu* — "mera order kab aayega" — often code-switched with Urdu script
and English in a single message.

Tickets come in by email or web form and get triaged in one structured call:
category (8 classes), urgency, sentiment, and key entities (order ID,
product). A reply draft is then generated in the customer's own language,
grounded in your uploaded knowledge-base policy documents (PDF/DOCX/MD) and
checked for groundedness. **Nothing ships without a human review:** tickets
land in a review-first inbox where an operator approves, corrects, or
discards each draft.

At its core is a QLoRA fine-tune of Qwen2.5-3B-Instruct that hits **80.4%
category accuracy** (0-shot: 25%; an unnamed 70B baseline: 63.5%) with
**100% valid JSON output**, at zero per-inference cost on local hardware via
Ollama. One Pydantic schema and one prompt template are shared across
training, evaluation, the API, and the UI — no drift between what was trained
and what runs.

Published to Hugging Face: [LoRA adapter (~57 MB)](https://huggingface.co/abuzarkhan/bilingual-ticket-triage-adapter),
dataset, GGUF weights, and a live [Gradio demo Space](https://huggingface.co/spaces/abuzarkhan/bilingual-ticket-triage)
that runs the fine-tuned model on ZeroGPU in the browser ([code: GitHub repo](https://github.com/abuzarai/support-ticket-automation)).

**Built with:** FastAPI · SQLite · Ollama · QLoRA/Qwen2.5-3B · vanilla JS SPA
dashboard · Pydantic shared schema · Gradio demo.