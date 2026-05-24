package gw.fnol.test

uses gw.api.test.CCTestBase
uses gw.fnol.FNOLWizardHelper
uses gw.fnol.FNOLValidationHelper
uses gw.api.util.DateUtil

/**
 * FNOLWizardHelperTest.gs
 * ========================
 * Unit tests for the Custom FNOL Wizard helper classes.
 * Uses ClaimCenter's built-in CCTestBase framework.
 *
 * Test Coverage:
 *  - Loss date future validation
 *  - Loss date outside policy period
 *  - Description minimum length
 *  - Reporter contact required
 *  - Successful FNOL submission state change
 *
 * Author: Soumya | Senior Guidewire ClaimCenter Developer
 */
class FNOLWizardHelperTest extends CCTestBase {

  // ── Test: Loss date in the future should return error ──────────────────────
  function testLossDateFuture() {
    var claim     = createTestClaim()
    claim.LossDate = DateUtil.addDays(DateUtil.currentDate(), 5) // future date
    var result     = FNOLValidationHelper.validatePolicySearch(claim)
    assertNotNull("Expected validation error for future loss date", result)
    assertTrue(result.contains("future") or result.contains("Future"))
  }

  // ── Test: Valid loss date within policy period should pass ─────────────────
  function testLossDateWithinPolicyPeriod() {
    var claim      = createTestClaim()
    claim.LossDate = DateUtil.currentDate()
    // Policy effective today, expires 1 year from now
    claim.Policy.EffectiveDate  = DateUtil.addDays(DateUtil.currentDate(), -10)
    claim.Policy.ExpirationDate = DateUtil.addDays(DateUtil.currentDate(), 355)
    var result = FNOLValidationHelper.validatePolicySearch(claim)
    assertNull("Valid loss date should pass policy period check", result)
  }

  // ── Test: Loss date before policy effective date should fail ───────────────
  function testLossDateBeforePolicyEffective() {
    var claim      = createTestClaim()
    claim.LossDate = DateUtil.addDays(DateUtil.currentDate(), -60)
    claim.Policy.EffectiveDate = DateUtil.addDays(DateUtil.currentDate(), -30)
    var result = FNOLValidationHelper.validatePolicySearch(claim)
    assertNotNull("Loss date before policy effective should fail", result)
  }

  // ── Test: Description shorter than 20 chars should fail ───────────────────
  function testDescriptionTooShort() {
    var claim          = createTestClaim()
    claim.LossDate     = DateUtil.currentDate()
    claim.LossType     = LossType.TC_AUTO
    claim.LossCause    = LossCause.TC_COLLISIONWITHCAR
    claim.LossLocation = createTestAddress()
    claim.Description  = "Short desc"  // < 20 chars
    var result = FNOLValidationHelper.validateLossDetails(claim)
    assertNotNull("Description under 20 chars should fail validation", result)
  }

  // ── Test: Valid description should pass ───────────────────────────────────
  function testDescriptionValid() {
    var claim          = createTestClaim()
    claim.LossDate     = DateUtil.currentDate()
    claim.LossType     = LossType.TC_AUTO
    claim.LossCause    = LossCause.TC_COLLISIONWITHCAR
    claim.LossLocation = createTestAddress()
    claim.Description  = "Rear-end collision at Highway 35 near exit 12 on a rainy afternoon"
    var result = FNOLValidationHelper.validateLossDetails(claim)
    assertNull("Valid description should pass", result)
  }

  // ── Test: Missing reporter phone should fail ───────────────────────────────
  function testReporterPhoneMissing() {
    var claim           = createTestClaim()
    claim.Reporter      = createTestContact()
    claim.Reporter.PrimaryPhone = null
    var result = FNOLValidationHelper.validateClaimantInfo(claim)
    assertNotNull("Missing reporter phone should fail validation", result)
  }

  // ── Test: Full valid FNOL should produce no errors ─────────────────────────
  function testValidatAllPass() {
    var claim = createFullValidClaim()
    var errors = FNOLValidationHelper.validateAll(claim)
    assertTrue("Full valid FNOL should have no errors", errors.isEmpty())
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  private function createTestClaim() : Claim {
    var claim      = new Claim()
    var policy     = new Policy()
    policy.PolicyNumber    = "POL-2024-TEST-001"
    policy.EffectiveDate   = DateUtil.addDays(DateUtil.currentDate(), -180)
    policy.ExpirationDate  = DateUtil.addDays(DateUtil.currentDate(), 185)
    claim.Policy   = policy
    return claim
  }

  private function createTestContact() : Contact {
    var contact          = new Contact()
    contact.FirstName    = "Jane"
    contact.LastName     = "Doe"
    contact.PrimaryPhone = "9725551234"
    contact.EmailAddress1 = "jane.doe@example.com"
    return contact
  }

  private function createTestAddress() : Address {
    var addr     = new Address()
    addr.AddressLine1 = "123 Main St"
    addr.City    = "Dallas"
    addr.State   = typekey.State.TC_TX
    addr.PostalCode = "75201"
    return addr
  }

  private function createFullValidClaim() : Claim {
    var claim          = createTestClaim()
    claim.LossDate     = DateUtil.currentDate()
    claim.LossType     = LossType.TC_AUTO
    claim.LossCause    = LossCause.TC_COLLISIONWITHCAR
    claim.LossLocation = createTestAddress()
    claim.Description  = "Rear-end collision at Highway 35 near exit 12 on a rainy afternoon"
    claim.Reporter     = createTestContact()
    claim.ReporterType = typekey.ReporterType.TC_INSURED
    return claim
  }
}
