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
 * The main function for the workflow step of the issue-pinned action.
 **/
async function RunAction() {
  try {
    // Define the variables for the workflow step here
    // Const Variables
    const issNodeId = actPAYLOAD.issue.node_id
    const gqlUnpinIssueMutation = `
      mutation UnpinIssue( $issNodeId: ID! ){
        unpinIssue( input: { issueId: $issNodeId }){
          issue{
            title
          }
        }
      }
    `
    const gqlUnpinIssueVariables = { issNodeId }

    // Let Variables
    let gqlUnpinIssueResponse

    // Write the workflow step code here
    // BLOCKSTART: Unpin Issue Graphql Block
    try {
      gqlUnpinIssueResponse = await gthOCTOKIT.graphql(
        gqlUnpinIssueMutation,
        gqlUnpinIssueVariables
      )

      // TODO: Insert a Console Message for Success - Unpin Issue Graphql

      // TODO: Display the Unpin Issue Graphql Response - TO BE DELETED AFTER THE CODE IS FINALISED
      pkgCORE.info(
        `\u001b[1;38;2;33;158;188mThe Unpin Issue Graphql Response is shown below:\n${JSON.stringify(gqlUnpinIssueResponse, null, 2)}`
      )
    } catch (error) {
      // Fail the workflow step if an error occurs
      // TODO: Insert a Console Message for Failure - Unpin Issue Graphql
      pkgCORE.setFailed(error.message)
      pkgCORE.info(
        `\u001b[1;38;2;255;255;0mThe Unpin Issue Graphql Response is shown below:\n${JSON.stringify(gqlUnpinIssueResponse, null, 2)}`
      )
      return
    }
    // BLOCKEND: Unpin Issue Graphql Block

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
