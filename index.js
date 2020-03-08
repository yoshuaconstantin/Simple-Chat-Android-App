'use strict'

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendNotification = functions.database.ref('/Notifications/{receiver_user_id}/{notification_id}').onWrite((change, context) => 
{
    const receiver_user_id = context.params.receiver_user_id;
    const notification_id = context.params.notification_id;

    console.log('The user Id is : ', receiver_user_id);

    if(!change.after.exists())
    {
        return console.log('A Notification has been deleted from the database : ', notification_id);
    }

    if (!change.after.exists()) 
    {
        return console.log('A notification has been deleted from the database : ', notification_id);
        return null;
    }




    const sender_user_id = admin.database().ref(`/Notifications/${receiver_user_id}/${notification_id}`).once('value');

    return sender_user_id.then(fromUserResult =>
    {
     const from_sender_user_id = fromUserResult.val().from;
     //console.log('You have a notification from :' , sender_user_id);

     const userQuery = admin.database().ref(`/Users/${from_sender_user_id}/name`).once('value');

     return userQuery.then(userResult =>
     {
      const senderUserName = userResult.val();
   console.log('You have notification from :' , senderUserName);

      const DeviceToken = admin.database().ref(`/Users/${receiver_user_id}/device_token`).once('value');

      return DeviceToken.then(result => 
      {
          const token_id = result.val();
          const payload = 
          {
              notification : 
              {
               //from_sender_user_id : from_sender_user_id,
                  title : "Permintaan Pertemanan",
                  body : `${senderUserName} Ingin Berteman Dengan Anda`,
                  icon : "default"
              }
          };

          return admin.messaging().sendToDevice(token_id, payload).then(response => 
          {
              console.log('This was the notification Feature');
              return null;
                 }).catch(error => 
                 {
                    console.error(error);
                    res.error(500);
           });
      });
   });
 });
});