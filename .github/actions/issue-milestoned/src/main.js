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

    // Let Variables

    // Write the workflow step code here

    // TODO: Display the Action Payload - TO BE DELETED AFTER THE CODE IS FINALISED
    pkgCORE.info(
      `\u001b[1;38;2;33;158;188mThe ACTION PAYLOAD is shown below:\n${JSON.stringify(actPAYLOAD, null, 2)}`
    )
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
