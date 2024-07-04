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
 * The main function for the workflow step of the issue-demilestoned action.
 **/
async function RunAction() {
  try {
    // Define the variables for the workflow step here
    // Const Variables
    const usrBot = 'bot-lfdsystems'
    const issNumber = actPAYLOAD.issue.number
    const cmtBody =
      '>[!Important]\n' +
      '>The _**' +
      `${gthREPONAME}` +
      "**_ repository's **[policy](../blob/main/CONTRIBUTING.md#repository-policies)** states that issue _**cannot**_ be _**milestoned**_.\n" +
      '>\n' +
      '>Issues that are _**milestoned**_ will be automatically _**demilestoned**_.\n' +
      '>\n' +
      '>As a result, this issue has been _**demilestoned**_.'

    // Let Variables
    let rstCreateCommentResponse

    // Write the workflow step code here
    if (actSENDERLOGIN === usrBot) {
      // BLOCKSTART: Create Comment Rest Block
      try {
        rstCreateCommentResponse = await gthOCTOKIT.rest.issues.createComment({
          owner: repOWNERLOGIN,
          repo: gthREPONAME,
          issue_number: issNumber,
          body: cmtBody
        })

        pkgCORE.info(
          '\u001b[1;38;2;0;255;0mThe comment has been successfully inserted.'
        )
      } catch (error) {
        // Fail the workflow step if an error occurs
        pkgCORE.info(
          '\u001b[1;38;2;255;0;0mAn error occurred while inserting the comment. The specific error encountered is mentioned below:'
        )
        pkgCORE.setFailed(error.message)
        pkgCORE.info(
          `\u001b[1;38;2;255;255;0mThe Create Comment Rest Response is shown below:\n${JSON.stringify(rstCreateCommentResponse, null, 2)}`
        )
        return
      }
      // BLOCKEND: Create Comment Rest Block
    } else {
      pkgCORE.info(
        '\u001b[1;38;2;255;255;0mThe issue has been manually demilestoned, and the insert comment request has been cancelled.'
      )
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
