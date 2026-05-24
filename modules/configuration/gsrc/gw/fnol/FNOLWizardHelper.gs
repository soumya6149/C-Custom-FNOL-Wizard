package gw.fnol

uses gw.api.database.Query
uses gw.api.util.DateUtil
uses gw.transaction.Transaction
uses java.util.Date

/**
 * FNOLWizardHelper.gs
 * =====================
 * Central business logic handler for the Custom FNOL Wizard (ClaimCenter).
 *
 * Responsibilities:
 *  - Finalizes claim on submission (state, assignment, activity, reserve)
 *  - Handles adjuster group routing by LossType
 *  - Creates FNOL acknowledgment activity
 *  - Initializes exposure reserves
 *
 * Compatible: Guidewire ClaimCenter 9.x / 10.x / Cloud
 * Author    : Soumya | Senior Guidewire ClaimCenter Developer
 */
class FNOLWizardHelper {

  /**
   * Main entry point called on FNOL wizard submission.
   * Runs inside a new bundle transaction.
   *
   * @param claim  The in-progress Claim entity from the FNOL wizard
   */
  static function submitFNOL(claim : Claim) {
    Transaction.runWithNewBundle(\ bundle -> {
      var c = bundle.add(claim)

      // 1. Transition claim state to Open
      c.State        = ClaimState.TC_OPEN
      c.ReportedDate = (c.ReportedDate == null) ? DateUtil.currentDate() : c.ReportedDate

      // 2. Generate claim number if not already assigned
      if (c.ClaimNumber == null or c.ClaimNumber.isEmpty()) {
        c.ClaimNumber = generateClaimNumber()
      }

      // 3. Auto-assign adjuster group based on LossType
      assignClaimToAdjusterGroup(c)

      // 4. Create FNOL acknowledgment activity (due next business day)
      createFNOLActivity(c)

      // 5. Initialize reserves for all exposures at $0
      initializeReserves(c)

      // 6. Auto-flag catastrophe claims for CAT team routing
      if (c.CatastropheFlag) {
        routeToCATTeam(c)
      }
    })
  }

  /**
   * Routes claim to appropriate adjuster group based on LossType.
   * Customize group names to match your ClaimCenter environment.
   */
  private static function assignClaimToAdjusterGroup(claim : Claim) {
    var groupName : String
    switch (claim.LossType) {
      case LossType.TC_AUTO:
        groupName = "Auto Adjusters"
        break
      case LossType.TC_AUTOBODILY:
        groupName = "Bodily Injury Adjusters"
        break
      case LossType.TC_PR:
        groupName = "Property Adjusters"
        break
      case LossType.TC_WC:
        groupName = "Workers Comp Adjusters"
        break
      case LossType.TC_GL:
        groupName = "General Liability Adjusters"
        break
      default:
        groupName = "General Adjusters"
    }
    var group = findGroupByName(groupName)
    if (group != null) {
      claim.AssignedGroup = group
    }
  }

  /**
   * Creates the standard FNOL acknowledgment activity on the claim.
   * Due date: next business day from today.
   */
  private static function createFNOLActivity(claim : Claim) {
    var activity             = claim.newActivity()
    activity.ActivityPattern = ActivityPattern.finder.getActivityPatternByCode("fnol_acknowledgment")
    activity.Subject         = DisplayKey.get("Web.FNOL.Activity.AcknowledgmentSubject")
    activity.Description     = DisplayKey.get("Web.FNOL.Activity.AcknowledgmentDesc", claim.ClaimNumber)
    activity.TargetDate      = DateUtil.addDays(DateUtil.currentDate(), 1)
    activity.Priority        = Priority.TC_NORMAL
    activity.Status          = ActivityStatus.TC_OPEN
  }

  /**
   * Initializes a $0 reserve for each new exposure on the claim.
   * Adjuster will formally set reserves during investigation.
   */
  private static function initializeReserves(claim : Claim) {
    for (exposure in claim.Exposures) {
      if (exposure.PrimaryReserve == null) {
        var reserve           = exposure.newReserve()
        reserve.ReserveAmount = 0bd
        reserve.Status        = ReserveStatus.TC_PENDING
        reserve.ReserveLine   = ReserveLine.TC_LOSS
      }
    }
  }

  /**
   * Routes catastrophe-flagged claims to the CAT adjuster team.
   */
  private static function routeToCATTeam(claim : Claim) {
    var catGroup = findGroupByName("CAT Adjusters")
    if (catGroup != null) {
      claim.AssignedGroup = catGroup
    }
    // Create a high-priority CAT alert activity
    var catActivity             = claim.newActivity()
    catActivity.ActivityPattern = ActivityPattern.finder.getActivityPatternByCode("cat_alert")
    catActivity.Subject         = DisplayKey.get("Web.FNOL.Activity.CATAlertSubject")
    catActivity.Description     = DisplayKey.get("Web.FNOL.Activity.CATAlertDesc", claim.ClaimNumber)
    catActivity.TargetDate      = DateUtil.currentDate()
    catActivity.Priority        = Priority.TC_URGENT
  }

  /**
   * Generates a unique claim number using date + random suffix.
   * In production, ClaimCenter auto-generates via sequence — this is a fallback.
   */
  private static function generateClaimNumber() : String {
    var datePart   = DateUtil.currentDate().format("yyyyMMdd")
    var randomPart = (Math.random() * 9000 + 1000).intValue() as String
    return "CLM-" + datePart + "-" + randomPart
  }

  /**
   * Utility: finds a Group entity by its display name.
   */
  static function findGroupByName(name : String) : Group {
    var q = Query.make(Group)
    q.compare("Name", Relop.Equals, name)
    return q.select().FirstResult
  }
}
