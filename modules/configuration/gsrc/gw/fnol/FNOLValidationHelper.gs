package gw.fnol

uses gw.api.util.DateUtil
uses java.util.ArrayList

/**
 * FNOLValidationHelper.gs
 * =========================
 * Centralized validation logic for all steps of the Custom FNOL Wizard.
 *
 * Each method validates a specific wizard step and returns:
 *  - null      : Step is valid, proceed
 *  - String    : Localized error message to display to the user
 *
 * validateAll() aggregates errors from all steps for final-submit check.
 *
 * Compatible: Guidewire ClaimCenter 9.x / 10.x / Cloud
 * Author    : Soumya | Senior Guidewire ClaimCenter Developer
 */
class FNOLValidationHelper {

  // ─── Step 1: Policy Search Validations ────────────────────────────────────

  static function validatePolicySearch(claim : Claim) : String {
    if (claim.Policy == null or claim.Policy.PolicyNumber == null or claim.Policy.PolicyNumber.trim().isEmpty()) {
      return DisplayKey.get("Web.FNOL.Validation.PolicyNumberRequired")
    }
    if (claim.LossDate == null) {
      return DisplayKey.get("Web.FNOL.Validation.LossDateRequired")
    }
    if (claim.LossDate > DateUtil.currentDate()) {
      return DisplayKey.get("Web.FNOL.Validation.LossDateFuture")
    }
    var policy = claim.Policy
    if (policy.EffectiveDate != null and claim.LossDate < policy.EffectiveDate) {
      return DisplayKey.get("Web.FNOL.Validation.LossDateBeforePolicy", policy.EffectiveDate)
    }
    if (policy.ExpirationDate != null and claim.LossDate > policy.ExpirationDate) {
      return DisplayKey.get("Web.FNOL.Validation.LossDateAfterExpiry", policy.ExpirationDate)
    }
    return null
  }

  // ─── Step 2: Loss Details Validations ─────────────────────────────────────

  static function validateLossDetails(claim : Claim) : String {
    if (claim.LossType == null) {
      return DisplayKey.get("Web.FNOL.Validation.LossTypeRequired")
    }
    if (claim.LossCause == null) {
      return DisplayKey.get("Web.FNOL.Validation.LossCauseRequired")
    }
    if (claim.Description == null or claim.Description.trim().isEmpty()) {
      return DisplayKey.get("Web.FNOL.Validation.DescriptionRequired")
    }
    if (claim.Description.trim().length() < 20) {
      return DisplayKey.get("Web.FNOL.Validation.DescriptionTooShort")
    }
    if (claim.LossLocation == null) {
      return DisplayKey.get("Web.FNOL.Validation.LossLocationRequired")
    }
    return null
  }

  // ─── Step 3: Claimant Info Validations ────────────────────────────────────

  static function validateClaimantInfo(claim : Claim) : String {
    var reporter = claim.Reporter
    if (reporter == null) {
      return DisplayKey.get("Web.FNOL.Validation.ReporterRequired")
    }
    if (reporter.FirstName == null or reporter.FirstName.trim().isEmpty()) {
      return DisplayKey.get("Web.FNOL.Validation.ReporterFirstNameRequired")
    }
    if (reporter.LastName == null or reporter.LastName.trim().isEmpty()) {
      return DisplayKey.get("Web.FNOL.Validation.ReporterLastNameRequired")
    }
    if (claim.ReporterType == null) {
      return DisplayKey.get("Web.FNOL.Validation.ReporterTypeRequired")
    }
    if (reporter.PrimaryPhone == null or reporter.PrimaryPhone.trim().isEmpty()) {
      return DisplayKey.get("Web.FNOL.Validation.ReporterPhoneRequired")
    }
    // Basic phone format: 10 digits or (XXX) XXX-XXXX
    if (not reporter.PrimaryPhone.matches("\\d{10}|\\(\\d{3}\\)\\s?\\d{3}-\\d{4}")) {
      return DisplayKey.get("Web.FNOL.Validation.ReporterPhoneFormat")
    }
    return null
  }

  // ─── Full Validation (called on final submit) ──────────────────────────────

  static function validateAll(claim : Claim) : List<String> {
    var errors = new ArrayList<String>()
    var e1 = validatePolicySearch(claim)
    var e2 = validateLossDetails(claim)
    var e3 = validateClaimantInfo(claim)
    if (e1 != null) errors.add(e1)
    if (e2 != null) errors.add(e2)
    if (e3 != null) errors.add(e3)
    return errors
  }
}
