# Deployment Guide — CC-Custom-FNOL-Wizard

## Prerequisites

- Guidewire ClaimCenter 9.x / 10.x / Cloud (Jasmine+) installed and running
- Guidewire Studio (Eclipse-based IDE) configured for your CC project
- Git installed locally
- ClaimCenter development server accessible

---

## Step-by-Step Deployment

### 1. Clone the Repository

```bash
git clone https://github.com/soumya6149/CC-Custom-FNOL-Wizard.git
cd CC-Custom-FNOL-Wizard
```

### 2. Copy Files into Your ClaimCenter Project

```bash
# Copy PCF wizard screens
cp modules/configuration/config/web/pcf/claim/fnol/*.pcf \
   <your-cc-project>/modules/configuration/config/web/pcf/claim/fnol/

# Copy Gosu helper classes
cp modules/configuration/gsrc/gw/fnol/*.gs \
   <your-cc-project>/modules/configuration/gsrc/gw/fnol/

# Copy Gosu unit tests
cp modules/configuration/gsrc/gw/fnol/test/*.gs \
   <your-cc-project>/modules/configuration/gsrc/gw/fnol/test/

# Copy validation rules
cp modules/configuration/config/rules/Validation/FNOLValidationRules.grs \
   <your-cc-project>/modules/configuration/config/rules/Validation/
```

### 3. Refresh in Guidewire Studio

1. Open Guidewire Studio
2. Right-click your ClaimCenter project → **Refresh**
3. Verify no red errors in the Problems tab
4. Gosu files auto-compile on refresh

### 4. Verify DisplayKeys

Add the following keys to your `DisplayKey.properties` file
(location: `modules/configuration/config/display/DisplayKey.properties`):

```properties
Web.FNOL.Wizard.Title=New FNOL — Claim Intake
Web.FNOL.Step.PolicySearch=Policy Search
Web.FNOL.Step.LossDetails=Loss Details
Web.FNOL.Step.ClaimantInfo=Claimant Information
Web.FNOL.Step.Review=Review & Submit
Web.FNOL.PolicySearch.Title=Search Policy
Web.FNOL.PolicySearch.PolicyNumber=Policy Number
Web.FNOL.PolicySearch.LossDate=Date of Loss
Web.FNOL.PolicySearch.InsuredName=Insured Name
Web.FNOL.PolicySearch.PolicyType=Policy Type
Web.FNOL.PolicySearch.EffectiveDate=Policy Effective Date
Web.FNOL.PolicySearch.ExpirationDate=Policy Expiration Date
Web.FNOL.PolicySearch.SearchBtn=Search Policy
Web.FNOL.PolicySearch.Instructions=Enter the policy number and date of loss to begin the FNOL intake.
Web.FNOL.PolicySearch.NotFound=No policy found for policy number: {0}
Web.FNOL.PolicySearch.NotActiveOnLossDate=Policy {0} was not active on the date of loss. Effective date: {1}
Web.FNOL.PolicySearch.ExpiredOnLossDate=Policy {0} had expired on the date of loss. Expiration date: {1}
Web.FNOL.LossDetails.Title=Loss Details
Web.FNOL.LossDetails.LossType=Loss Type
Web.FNOL.LossDetails.LossCause=Loss Cause
Web.FNOL.LossDetails.Description=Loss Description
Web.FNOL.LossDetails.LossLocation=Loss Location
Web.FNOL.LossDetails.ReportedDate=Date Reported
Web.FNOL.LossDetails.CatastropheFlag=Catastrophe Claim?
Web.FNOL.LossDetails.CatastropheNumber=Catastrophe Number
Web.FNOL.LossDetails.WeatherType=Weather Type
Web.FNOL.ClaimantInfo.Title=Claimant Information
Web.FNOL.ClaimantInfo.ReporterSection=Reporter Details
Web.FNOL.ClaimantInfo.InjurySection=Injury Information
Web.FNOL.ClaimantInfo.FirstName=First Name
Web.FNOL.ClaimantInfo.LastName=Last Name
Web.FNOL.ClaimantInfo.ReporterType=Relation to Insured
Web.FNOL.ClaimantInfo.PrimaryPhone=Primary Phone
Web.FNOL.ClaimantInfo.Email=Email Address
Web.FNOL.ClaimantInfo.Represented=Represented by Attorney?
Web.FNOL.ClaimantInfo.InjuryIndicator=Was anyone injured?
Web.FNOL.ClaimantInfo.InjuryDescription=Injury Description
Web.FNOL.ClaimantInfo.InjurySeverity=Injury Severity
Web.FNOL.ClaimantInfo.HospitalName=Hospital / Treatment Facility
Web.FNOL.Review.Title=Review & Submit FNOL
Web.FNOL.Review.Submit=Submit FNOL
Web.FNOL.Review.SubmitConfirm=Are you sure you want to submit this FNOL? This action cannot be undone.
Web.FNOL.Review.PolicySection=Policy Information
Web.FNOL.Review.LossSection=Loss Information
Web.FNOL.Review.ReporterSection=Reporter Information
Web.FNOL.Review.PolicyNumber=Policy Number
Web.FNOL.Review.InsuredName=Named Insured
Web.FNOL.Review.PolicyType=Policy Type
Web.FNOL.Review.PolicyEffDate=Effective Date
Web.FNOL.Review.PolicyExpDate=Expiration Date
Web.FNOL.Review.LossDate=Date of Loss
Web.FNOL.Review.LossType=Loss Type
Web.FNOL.Review.LossCause=Loss Cause
Web.FNOL.Review.LossLocation=Loss Location
Web.FNOL.Review.Description=Loss Description
Web.FNOL.Review.CatastropheFlag=Catastrophe Claim
Web.FNOL.Review.ReporterName=Reporter Name
Web.FNOL.Review.ReporterType=Relation to Insured
Web.FNOL.Review.ReporterPhone=Reporter Phone
Web.FNOL.Review.ReporterEmail=Reporter Email
Web.FNOL.Review.InjuryIndicator=Injury Reported
Web.FNOL.Validation.PolicyNumberRequired=Policy number is required.
Web.FNOL.Validation.LossDateRequired=Date of loss is required.
Web.FNOL.Validation.LossDateFuture=Date of loss cannot be in the future.
Web.FNOL.Validation.LossDateBeforePolicy=Date of loss ({0}) is before the policy effective date.
Web.FNOL.Validation.LossDateAfterExpiry=Date of loss ({0}) is after the policy expiration date.
Web.FNOL.Validation.LossDateOutsidePolicy=Date of loss must be between {0} and {1}.
Web.FNOL.Validation.LossTypeRequired=Loss type is required.
Web.FNOL.Validation.LossCauseRequired=Loss cause is required.
Web.FNOL.Validation.DescriptionRequired=A description of the loss is required.
Web.FNOL.Validation.DescriptionTooShort=Loss description must be at least 20 characters.
Web.FNOL.Validation.LossLocationRequired=Loss location is required.
Web.FNOL.Validation.ReporterRequired=Reporter information is required.
Web.FNOL.Validation.ReporterFirstNameRequired=Reporter first name is required.
Web.FNOL.Validation.ReporterLastNameRequired=Reporter last name is required.
Web.FNOL.Validation.ReporterTypeRequired=Reporter relation to insured is required.
Web.FNOL.Validation.ReporterPhoneRequired=Reporter primary phone is required.
Web.FNOL.Validation.ReporterPhoneFormat=Invalid phone format. Use 10 digits or (XXX) XXX-XXXX.
Web.FNOL.Validation.ReporterContactRequired=Reporter name and phone number are required.
Web.FNOL.Validation.InjuryDescriptionRecommended=Injury description is recommended for bodily injury claims.
Web.FNOL.Validation.CatastropheFlagRecommended=This claim may qualify as a catastrophe. Please review the CAT flag.
Web.FNOL.Activity.AcknowledgmentSubject=FNOL Acknowledgment
Web.FNOL.Activity.AcknowledgmentDesc=FNOL received for claim {0}. Please acknowledge within 24 hours.
Web.FNOL.Activity.CATAlertSubject=CAT Claim Alert
Web.FNOL.Activity.CATAlertDesc=Claim {0} has been flagged as a catastrophe claim. Route to CAT team immediately.
Web.FNOL.Common.Yes=Yes
Web.FNOL.Common.No=No
```

### 5. Run Unit Tests

In Guidewire Studio:
1. Navigate to `gsrc/gw/fnol/test/FNOLWizardHelperTest.gs`
2. Right-click → **Run As → ClaimCenter Test**
3. All 7 tests should pass ✅

### 6. Test in ClaimCenter UI

1. Log into ClaimCenter development server
2. Navigate: **New Claim** → FNOL Wizard launches automatically
3. Walk through all 4 steps to verify flow
4. Test validation errors by submitting incomplete data

---

## Common Issues

| Issue | Resolution |
|---|---|
| PCF compilation error on `WizardPageBinding` | Ensure `parent="ClaimDetailPage(claim)"` matches your CC version's page name |
| `Query.make(Policy)` compile error | Verify `Policy` entity is accessible in your data model version |
| `ActivityPattern.finder` null pointer | Ensure `fnol_acknowledgment` and `cat_alert` activity pattern codes exist in your CC config |
| `LossType.TC_AUTOBODILY` not found | Adjust typekey codes to match your CC version's typelist definitions |
| DisplayKey missing warning | Add all keys from Step 4 above to your `DisplayKey.properties` file |
