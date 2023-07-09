const core = require('@actions/core');
const github = require('@actions/github');
const mailchimp = require('@mailchimp/mailchimp_marketing');

const main = async () => {
    try {
        const mailchimp_token = core.getInput('mailchimp-token', { required: true });
        const mailchimp_server_prefix = core.getInput('mailchimp-server-prefix', { required: true });


        mailchimp.setConfig({
            apiKey: mailchimp_token,
            server: mailchimp_server_prefix,
        });

        async function callPing() {
            const response = await mailchimp.ping.get();
            console.log(response);
        }

        async function getDonors() {
            const response = await mailchimp.lists.getSegmentMembersList(
                "6e473b4f1d",
                "10184741"
            );
            console.log(response);
        }

        getDonors();

    } catch (error) {
        core.setFailed(error.message);
    }
}

// Call the main function to run the action
main();