# Changelog

All notable changes to this project will be documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.0.0] - 2026-05-24

### Added
- `NewFNOLWizard.pcf` — 4-step FNOL wizard container with step bindings
- `NewFNOLWizard_PolicySearch.pcf` — Step 1: Policy lookup and loss date validation
- `NewFNOLWizard_LossDetails.pcf` — Step 2: Loss type, cause, location, description
- `NewFNOLWizard_ClaimantInfo.pcf` — Step 3: Reporter info, injury indicator panel
- `NewFNOLWizard_Review.pcf` — Step 4: Read-only review and submit
- `FNOLWizardHelper.gs` — Claim submission, adjuster assignment, activity creation, reserve init
- `FNOLValidationHelper.gs` — Step-level and full form validation logic
- `FNOLPolicySearchHelper.gs` — Policy query, coverage period check, claim population
- `FNOLValidationRules.grs` — 6 validation rules (4 Errors, 2 Warnings)
- `FNOLWizardHelperTest.gs` — CCTestBase unit tests for all validation scenarios
- `.github/workflows/validate.yml` — GitHub Actions CI for structure + XML checks
- `README.md`, `LICENSE`, `.gitignore`, `CONTRIBUTING.md`, `CHANGELOG.md`

### Compatibility
- Guidewire ClaimCenter 9.x, 10.x, Cloud (Jasmine+)

---

## [Unreleased]
- Add `DisplayKey.properties` sample file for all message keys
- Add sample LOB extension for Commercial Auto
- Add Assignment Rules `.grs` companion project
