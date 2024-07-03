// Global variables for the workflow step
const pkgCORE = require('@actions/core') //Actions Core Package
const pkgGITHUB = require('@actions/github') //Actions GitHub Package for Authenticating the Octokit Client
const gthTOKEN = pkgCORE.getInput('GITHUBTOKEN', { required: true })
const actPAYLOAD = pkgGITHUB.context.payload
const gthOCTOKIT = new pkgGITHUB.getOctokit(gthTOKEN)
const repOWNERLOGIN = actPAYLOAD.repository.owner.login
const gthREPONAME = actPAYLOAD.repository.name
const actSENDERLOGIN = actPAYLOAD.sender.login

/**
 * The main function for the workflow step of the issue-milestoned action.
 **/
async function RunAction() {
  try {
    // Define the variables for the workflow step here
    // Const Variables
    const issNumber = actPAYLOAD.issue.number
    const issCurrentMilestoneTitle = actPAYLOAD.issue.milestone.title

    // Let Variables
    let rstUpdateIssueResponse
    let rstGetIssueResponse
    let issMilestoneDetails

    // Write the workflow step code here
    // BLOCKSTART: Get Issue Rest Block
    try {
      rstGetIssueResponse = await gthOCTOKIT.rest.issues.get({
        owner: repOWNERLOGIN,
        repo: gthREPONAME,
        issue_number: issNumber
      })

      issMilestoneDetails = rstGetIssueResponse.data.milestone
    } catch (error) {
      // Fail the workflow step if an error occurs
      pkgCORE.info(
        '\u001b[1;38;2;255;0;0mAn error occurred while getting the issue details. The specific error encountered is mentioned below:'
      )
      pkgCORE.setFailed(error.message)
      pkgCORE.info(
        `\u001b[1;38;2;255;255;0mThe Get Issue Rest Response is shown below:\n${JSON.stringify(rstGetIssueResponse, null, 2)}`
      )
      return
    }
    // BLOCKEND: Get Issue Rest Block

    if (issMilestoneDetails === null) {
      pkgCORE.info(
        '\u001b[1;38;2;255;255;0mThe issue has been manually demilestoned, and the demilestone request has been cancelled.'
      )
    } else {
      if (issMilestoneDetails.title === issCurrentMilestoneTitle) {
        // BLOCKSTART: Update Issue Rest Block
        try {
          rstUpdateIssueResponse = await gthOCTOKIT.rest.issues.update({
            owner: repOWNERLOGIN,
            repo: gthREPONAME,
            issue_number: issNumber,
            milestone: null
          })

          pkgCORE.info(
            '\u001b[1;38;2;0;255;0mThe issue has been successfully demilestoned.'
          )
        } catch (error) {
          // Fail the workflow step if an error occurs
          pkgCORE.info(
            '\u001b[1;38;2;255;0;0mAn error occurred while demilestoning the issue. The specific error encountered is mentioned below:'
          )
          pkgCORE.setFailed(error.message)
          pkgCORE.info(
            `\u001b[1;38;2;255;255;0mThe Update Issue Rest Response is shown below:\n${JSON.stringify(rstUpdateIssueResponse, null, 2)}`
          )
          return
        }
        // BLOCKEND: Update Issue Rest Block
      } else {
        pkgCORE.info(
          "\u001b[1;38;2;255;255;0mThe issue's milestone has been changed, and the demilestone request has been cancelled."
        )
      }
    }
  } catch (error) {
    // This is the main function\'s catch block
    // Fail the workflow step if an error occurs
    pkgCORE.info(
      '\u001b[1;38;2;255;0;0mAn error occurred while executing the workflow process. The specific error encountered is mentioned below:'
    )
    pkgCORE.setFailed(error.message)
  }
}

module.exports = {
  RunAction
}
