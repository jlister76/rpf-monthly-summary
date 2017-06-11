'use strict';

const moment = require('moment');
const  _ = require('lodash');
const loopback = require('loopback');
const path = require('path');
const json2csv = require('json2csv');

module.exports = (app)=>{

  let replication = app.models.replication;
  let firstDayOfPreviousMonth = moment().subtract(1, 'month').startOf('month');
  let lastDayOfPreviousMonth = moment().subtract(1,'month').endOf('month');

  console.log(firstDayOfPreviousMonth, lastDayOfPreviousMonth);
  replication.find({
    where: {
      and: [
        {
          replication_date: {
            gte: firstDayOfPreviousMonth
          }
        },
        {
          replication_date: {
            lte: lastDayOfPreviousMonth
          }
        }
      ]
    }
  })
    .then(function(replications){
      console.log(replication);
      let data = [];
      _.forEach(replications, function(repl){
        let replication = {
          replication_date: moment(repl.replication_date).format('MM-DD-YYYY'),
          atmos_employee: repl.atmos_employee,
          team_leader: repl.team_leader,
          locate_technician: repl.locate_technician,
          heath_report: repl.heath_report,
          facility: repl.facility,
          location: repl.location,
          cross_street: repl.cross_street,
          town: repl.town,
          isReplicated: repl.isReplicated,
          atmos_determination: repl.atmos_determination,
          corrective_actions: repl.corrective_actions,
          able_to_locate: repl.able_to_locate,
          is_line_marked: repl.is_line_marked,
          atmos_comments: repl.atmos_comments,
          atmos_report: repl.atmos_report
        };
        data.push(replication);
      });

      try {
        let previousMonth = moment().subtract(1, 'month').format('MMMM YYYY');
        let fields = [
          'replication_date',
          'atmos_employee',
          'team_leader',
          'locate_technician',
          'heath_report',
          'facility',
          'location',
          'cross_street',
          'town',
          'isReplicated',
          'atmos_determination',
          'corrective_actions',
          'able_to_locate',
          'is_line_marked',
          'atmos_comments',
          'atmos_report'
        ];
        let fieldNames = [
          'Date',
          'DPS',
          'Team Leader',
          'Technician',
          'Heath Damage Report',
          'Facility',
          'Address',
          'Nearest Intersection',
          'Town',
          'Replicated',
          'Determination',
          'Corrective Actions',
          'Able To Locate',
          'Marked',
          'Comments',
          'Leak Number'
        ];
        let result = json2csv({data:data, fields: fields, fieldNames: fieldNames});
        //let renderer = loopback.template(path.resolve(__dirname, '../../server/views/email-template.ejs'));
        //let html_body = renderer(messageVars);
        app.models.Email.send({
          to: ['j.lister@heathus.com',
            'e.parsley@heathus.com',
            'f.pinales@heathus.com',
            'd.durrett@heathus.com',
            'm.minaz@heathus.com',
            'julie.presley@atmosenergy.com',
            'alexander.holliness@atmosenergy.com',
            'melanie.rheingans@atmosenergy.com',
            'shari.warren@atmosenergy.com',
            'john.scheller@atmosenergy.com',
            'marlo.sutton@atmosenergy.com'
          ],
          from: 'locateATMOS@heathus.com',
          subject: 'Replication Monthly Summary',
          attachments: [{'filename': previousMonth + ' Replications.csv', 'content': result}],
          html: '<p>Replication summary for ' + previousMonth + '.</p>'
        }, function(err, mail) {
          if (err) {
            console.error(err)
          }
          console.log('email sent!');
        })



      } catch (err){
        console.error(err);
      }
    })
    .catch()

};
