package gw.fnol

uses gw.api.database.Query
uses gw.api.util.DateUtil

/**
 * FNOLPolicySearchHelper.gs
 * ===========================
 * Handles policy lookup by policy number during FNOL Step 1.
 * Validates coverage active on loss date and binds policy data to the claim.
 *
 * Compatible: Guidewire ClaimCenter 9.x / 10.x / Cloud
 * Author    : Soumya | Senior Guidewire ClaimCenter Developer
 */
class FNOLPolicySearchHelper {

  /**
   * Searches for a Policy by PolicyNumber, validates loss date coverage,
   * and populates the claim with matched policy details.
   *
   * @param policyNumber  Policy number entered by reporter
   * @param lossDate      Date of loss for coverage period verification
   * @param claim         In-progress claim entity in the FNOL wizard
   */
  static function findPolicyByNumber(policyNumber : String, lossDate : Date, claim : Claim) {
    if (policyNumber == null or policyNumber.trim().isEmpty()) {
      throw new gw.api.util.DisplayableException(
        DisplayKey.get("Web.FNOL.PolicySearch.PolicyNumberEmpty")
      )
    }

    // Query Policy entity by PolicyNumber
    var q = Query.make(Policy)
    q.compare("PolicyNumber", Relop.Equals, policyNumber.trim().toUpperCase())
    var policy = q.select().FirstResult

    if (policy == null) {
      throw new gw.api.util.DisplayableException(
        DisplayKey.get("Web.FNOL.PolicySearch.NotFound", policyNumber)
      )
    }

    // Verify policy was active on the date of loss
    if (lossDate != null) {
      if (policy.EffectiveDate != null and lossDate < policy.EffectiveDate) {
        throw new gw.api.util.DisplayableException(
          DisplayKey.get("Web.FNOL.PolicySearch.NotActiveOnLossDate",
            policyNumber, policy.EffectiveDate)
        )
      }
      if (policy.ExpirationDate != null and lossDate > policy.ExpirationDate) {
        throw new gw.api.util.DisplayableException(
          DisplayKey.get("Web.FNOL.PolicySearch.ExpiredOnLossDate",
            policyNumber, policy.ExpirationDate)
        )
      }
    }

    // Bind matched policy data to the claim
    claim.Policy      = policy
    claim.InsuredName = policy.InsuredName
    claim.PolicyType  = policy.PolicyType
  }

  /**
   * Checks if the policy has an active coverage line for the given LossType on the loss date.
   *
   * @param policy    Policy entity to check
   * @param lossType  LossType typekey (e.g., TC_AUTO, TC_PR)
   * @param lossDate  Date of loss
   * @return          true if matching coverage exists and is active
   */
  static function hasCoverageForLossType(policy : Policy, lossType : LossType, lossDate : Date) : boolean {
    if (policy == null or lossDate == null) return false
    return policy.Coverages.hasMatch(\ cov ->
      cov.Type.Categories.hasMatch(\ cat -> cat.Code == lossType.Code)
      and (cov.EffectiveDate  == null or lossDate >= cov.EffectiveDate)
      and (cov.ExpirationDate == null or lossDate <= cov.ExpirationDate)
    )
  }
}
