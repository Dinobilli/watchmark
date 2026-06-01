# Codex for Open Source Application Draft: Watchmark

Use this as raw material for the form. Edit names, URLs, and maintainer details before submitting.

## Project

Watchmark

## Repository URL

Add the public GitHub URL after publishing this repository.

## One-line summary

An MIT-licensed website change monitor that stores page baselines, detects meaningful text changes, and produces local AI-style summaries for Korean public notices, shopping/product pages, and competitor intelligence.

## Why it matters

Many people and small teams manually re-check web pages: government notices, grant deadlines, shopping product pages, competitor pricing, hiring pages, and terms pages. Existing monitors often only say "changed" without explaining what matters. Watchmark focuses on meaningful-content extraction and readable summaries, with a Korea-first use case that can grow into hosted alerts.

## How Codex is used

- Generate regression fixtures for public-sector notices, product pages, and noisy pages with boilerplate churn.
- Review scraper and normalizer changes for edge cases across HTML structures and Korean text.
- Build release workflows, PR review checklists, and maintainer automation around the open-source monitor engine.
- Improve documentation and examples for self-hosted users.

## Open-source status

The project is MIT licensed. The current MVP includes a Bun/Hono HTTP API, browser dashboard, deterministic local summarizer, tests, docs, CI, issue templates, release notes, a roadmap, and a security policy. It does not require private APIs to run.

## Requested support

ChatGPT Pro with Codex would support rapid development of the open-source engine, scraper fixtures, tests, docs, and release workflow. API credits could later support optional AI summaries and evaluation datasets for dense Korean pages.

## 500-character form answer: why this repo qualifies

Watchmark는 한국 공공기관 공지, 지원사업, 쇼핑몰 상품 페이지, 경쟁사 가격/채용/약관 변화를 추적하는 MIT 오픈소스 모니터입니다. 단순 변경 알림이 아니라 의미 있는 텍스트 변화와 요약을 제공해 개인, 소상공인, 커뮤니티가 반복 확인 업무를 줄일 수 있습니다. CI, 테스트, 릴리스, 이슈 템플릿과 로드맵을 갖춘 공개 MVP입니다.

## 500-character form answer: API credit usage

API 크레딧은 선택형 AI 요약과 평가 데이터 구축에 사용하겠습니다. 한국어 공공 공지, 쇼핑 상품 페이지, 약관/채용 페이지의 긴 변경 내역을 요약하고, PR마다 fixture 기반 회귀 테스트와 릴리스 노트/이슈 분류 자동화를 돌려 유지관리 부담을 줄이겠습니다. 기본 MVP는 로컬 요약으로 동작해 API 키 없이도 사용할 수 있습니다.
