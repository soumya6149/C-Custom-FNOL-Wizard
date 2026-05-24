# Guidewire ClaimCenter — Custom FNOL Wizard

[![Guidewire ClaimCenter](https://img.shields.io/badge/Guidewire-ClaimCenter-orange?style=flat-square)](https://www.guidewire.com)
[![Language: Gosu](https://img.shields.io/badge/Language-Gosu-blue?style=flat-square)](https://gosu-lang.github.io/)
[![PCF](https://img.shields.io/badge/UI-PCF%20Wizard-green?style=flat-square)](https://docs.guidewire.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
![CI](https://github.com/soumya6149/CC-Custom-FNOL-Wizard/actions/workflows/validate.yml/badge.svg)

---

A **production-style Guidewire ClaimCenter customization** implementing a complete
4-step **First Notice of Loss (FNOL) intake wizard** using native ClaimCenter technologies:

- **PCF** (Page Configuration Framework) — Multi-step wizard UI screens
- **Gosu** — Business logic helpers, validations, policy search, claim submission
- **GRS** (Guidewire Rule Set) — Validation rules engine with 6 business rules
- **CCTestBase** — Unit tests for all validation scenarios

---

## Business Scenario

When a loss event occurs, an adjuster or CSR needs to quickly capture:
1. The affected **policy** and verify active coverage on the loss date
2. The **loss event details** (type, cause, location, description)
3. **Reporter/claimant information** and injury indicators
4. A final **review** before submitting the claim to the ClaimCenter system

This wizard replaces the default FNOL flow with a custom, guided experience that
enforces business rules at every step and automates post-submission tasks.

---

## Project Structure

```
CC-Custom-FNOL-Wizard/
│
├── modules/
│   └── configuration/
│       │
│       ├── config/
│       │   ├── web/pcf/claim/fnol/
│       │   │   ├── NewFNOLWizard.pcf                   # Wizard container & step bindings
│       │   │   ├── NewFNOLWizard_PolicySearch.pcf       # Step 1: Policy search & validation
│       │   │   ├── NewFNOLWizard_LossDetails.pcf        # Step 2: Loss type, cause, description
│       │   │   ├── NewFNOLWizard_ClaimantInfo.pcf       # Step 3: Reporter & injury info
│       │   │   └── NewFNOLWizard_Review.pcf             # Step 4: Summary & submit
│       │   │
│       │   └── rules/Validation/
│       │       └── FNOLValidationRules.grs              # 6 business validation rules
│       │
│       └── gsrc/gw/fnol/
│           ├── FNOLWizardHelper.gs                      # Claim submission, assignment, activity
│           ├── FNOLValidationHelper.gs                  # Step-level & full validation logic
│           ├── FNOLPolicySearchHelper.gs                # Policy lookup & coverage verification
│           └── test/
│               └── FNOLWizardHelperTest.gs              # CCTestBase unit tests
│
├── .github/
│   └── workflows/
│       └── validate.yml                                 # GitHub Actions CI — structure + XML checks
│
└── docs/
    └── screenshots/                                     # UI screenshots (add your own)
```

---

## FNOL Wizard Flow

```
[Start FNOL]
      │
      ▼
┌─────────────────┐
│  Step 1         │  Enter policy number + loss date
│  Policy Search  │  → Validate coverage active on loss date
│                 │  → Auto-populate insured name & policy type
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Step 2         │  Select LossType + LossCause
│  Loss Details   │  → Enter loss location & description (min 20 chars)
│                 │  → Auto-set CAT flag for weather-related causes
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Step 3         │  Enter reporter name, phone, relation
│  Claimant Info  │  → Conditional injury panel for bodily injury LossTypes
│                 │  → Injury severity & hospital fields
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Step 4         │  Read-only summary of all entered data
│  Review         │  → Confirm & Submit
└────────┬────────┘
         │
         ▼
[submitFNOL()]
  ├── Set Claim.State = Open
  ├── Auto-assign adjuster group by LossType
  ├── Create FNOL acknowledgment activity (due next day)
  ├── Initialize $0 reserves for all exposures
  └── Route CAT claims to CAT Adjusters team
```

---

## Gosu Helper Classes

### `FNOLWizardHelper.gs`
Central submission handler. Called on final wizard step.

| Method | Purpose |
|---|---|
| `submitFNOL(claim)` | Main entry: sets state, assigns adjuster, creates activity, initializes reserves |
| `assignClaimToAdjusterGroup(claim)` | Routes by LossType: Auto, BI, Property, WC, GL |
| `createFNOLActivity(claim)` | Creates `fnol_acknowledgment` activity due next business day |
| `initializeReserves(claim)` | Sets $0 pending reserves for all exposures |
| `routeToCATTeam(claim)` | Assigns CAT Adjusters group + creates urgent CAT alert activity |

### `FNOLValidationHelper.gs`
Step-level and full-form validation logic.

| Method | Validates |
|---|---|
| `validatePolicySearch(claim)` | Policy number, loss date range, policy coverage period |
| `validateLossDetails(claim)` | LossType, LossCause, description length, loss location |
| `validateClaimantInfo(claim)` | Reporter name, phone format, ReporterType |
| `validateAll(claim)` | Aggregates all step errors for pre-submit check |

### `FNOLPolicySearchHelper.gs`
Policy lookup and coverage verification.

| Method | Purpose |
|---|---|
| `findPolicyByNumber(policyNumber, lossDate, claim)` | Queries Policy entity, validates coverage dates, populates claim |
| `hasCoverageForLossType(policy, lossType, lossDate)` | Returns true if matching active coverage exists |

---

## Validation Rules (`.grs`)

| Rule ID | Severity | Business Rule |
|---|---|---|
| `LossDateNotFuture` | ❌ Error | Loss date cannot be future-dated |
| `LossDateWithinPolicyPeriod` | ❌ Error | Loss date must be within policy effective/expiration |
| `DescriptionMinLength` | ❌ Error | Claim description must be ≥ 20 characters |
| `ReporterContactRequired` | ❌ Error | Reporter name and phone are mandatory |
| `InjuryDescriptionRecommended` | ⚠️ Warning | Bodily injury claims should include injury description |
| `CatastropheFlagCheck` | ⚠️ Warning | Weather-related causes should be CAT-flagged |

---

## How to Deploy in ClaimCenter Studio

```bash
# 1. Clone the repository
git clone https://github.com/soumya6149/CC-Custom-FNOL-Wizard.git

# 2. Copy modules/ into your ClaimCenter project root
cp -r CC-Custom-FNOL-Wizard/modules/ <your-cc-project>/

# 3. In Guidewire Studio:
#    - Right-click project → Refresh
#    - PCF files: config/web/pcf/claim/fnol/
#    - Gosu files: gsrc/gw/fnol/  (auto-compiled)
#    - Rules: config/rules/Validation/

# 4. Build & deploy to ClaimCenter development server
# 5. Navigate: ClaimCenter UI → New Claim → FNOL Wizard launches
```

---

## Compatibility

| Guidewire Version | Status |
|---|---|
| ClaimCenter 9.x (On-Premise) | ✅ Compatible |
| ClaimCenter 10.x (On-Premise) | ✅ Compatible |
| ClaimCenter Cloud (Jasmine+) | ✅ Compatible |

---

## Author

**Soumya** — Senior Guidewire ClaimCenter Developer  
🔗 [LinkedIn](https://linkedin.com/in/soumya6149) | 💻 [GitHub](https://github.com/soumya6149)

---

## License

MIT License — see [LICENSE](LICENSE) for details.
