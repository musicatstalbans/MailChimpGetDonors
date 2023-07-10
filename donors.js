const fs = require('fs');
const axios = require('axios');

//let data = {"members":[{"merge_fields":{"FNAME":"Howard","LNAME":"Steinfield","DONORLEVEL":"Sustainers","ADDRESS":"","DONORNAME":""}},{"merge_fields":{"FNAME":"Steve & Susan","LNAME":"Hall","DONORLEVEL":"Patrons","ADDRESS":"","DONORNAME":"Steve & Susan Hall"}},{"merge_fields":{"FNAME":"Bob & Deb","LNAME":"Cameron","DONORLEVEL":"Patrons","ADDRESS":"","DONORNAME":""}},{"merge_fields":{"FNAME":"Nora","LNAME":"Shepard","DONORLEVEL":"Artists Circle","ADDRESS":"","DONORNAME":""}},{"merge_fields":{"FNAME":"Dave","LNAME":"Cable","DONORLEVEL":"Patrons","ADDRESS":{"addr1":"PO Box 250","addr2":"","city":"Davidson","state":"NC","zip":"28036","country":"US"},"DONORNAME":""}},{"merge_fields":{"FNAME":"Libby","LNAME":"Cable","DONORLEVEL":"Patrons","ADDRESS":{"addr1":"PO Box 250","addr2":"","city":"Davidson","state":"NC","zip":"28036","country":"US"},"DONORNAME":""}}]}

function retrieveDonors(mailchimp_list_id, mailchimp_segment_id) {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://us3.api.mailchimp.com/3.0/lists/' + mailchimp_list_id + '/segments/' + mailchimp_segment_id + '/members?fields=members.merge_fields',
        headers: {
            'Authorization': 'Bearer ' + mailchimp_token
        }
    };

    axios.request(config)
        .then((response) => {
            let donors = JSON.stringify(response.data);
            processDonors(donors);
        })
        .catch((error) => {
            console.log(error);
        });
}

function processDonors(data) {
    let donors = data.members
        .map((member) => {
            return {
                name: member.merge_fields.DONORNAME || member.merge_fields.FNAME + ' ' + member.merge_fields.LNAME,
                level: member.merge_fields.DONORLEVEL,
                lastname: member.merge_fields.LNAME,
            }
        })
        .sort((a, b) => { return a.lastname.localeCompare(b.lastname) }
        );

    let patrons = donors.filter((donor) => { return donor.level === 'Patrons' });
    let artistscircle = donors.filter((donor) => { return donor.level === 'Artists Circle' });
    let sustainers = donors.filter((donor) => { return donor.level === 'Sustainers' });
    let friends = donors.filter((donor) => { return donor.level === 'Friends' });
    let benefactors = donors.filter((donor) => { return donor.level === 'Benefactors' });
    let composerssociety = donors.filter((donor) => { return donor.level === 'Composers Society' });

    writeDonorFile(patrons, '_data/benefactors/patrons.yml');
    writeDonorFile(artistscircle, '_data/benefactors/artistscircle.yml');
    writeDonorFile(sustainers, '_data/benefactors/sustainers.yml');
    writeDonorFile(friends, '_data/benefactors/friends.yml');
    writeDonorFile(benefactors, '_data/benefactors/benefactors.yml');
    writeDonorFile(composerssociety, '_data/benefactors/composerssociety.yml');
}

function writeDonorFile(data, filename) {
    // loop through the data and write to file
    let filedata = '';
    data.forEach((donor) => {
        filedata += '- name: ' + donor.name + '\n';
    });
    //open and write to file
    fs.open(filename, 'w+', (err, fd) => {
        if (err) {
            throw 'could not open donor file for writing: ' + err;
        }
        fs.write(fd, filedata, (err, written, string) => {
            if (err) {
                throw 'error writing donor file: ' + err;
            }
            fs.close(fd, (err) => {
                if (err) {
                    throw 'error closing donor file: ' + err;
                }
            });
        });
    });
}

export default retrieveDonors;
