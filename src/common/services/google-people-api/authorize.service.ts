// import { Injectable } from '@nestjs/common';
// import * as fs from 'fs';
// import { google } from 'googleapis';
// import readline from 'readline';

// @Injectable()
// export class PeopleApiAuthorization {
//   // Data Members
//   SCOPES = ['https://www.googleapis.com/auth/contacts'];
//   TOKEN_PATH = 'token.json';

//   // ? Constructor Function
//   constructor() {}

//   // ? Authorize Function

//   private authorize(credentials, callback) {
//     const { client_secret, client_id, redirect_uris } = credentials.installed;
//     const oAuth2Client = new google.auth.OAuth2(
//       client_id,
//       client_secret,
//       redirect_uris[0],
//     );

//     // Check if we have previously stored a token.
//     fs.readFile(this.TOKEN_PATH, (err, token) => {
//       if (err)
//         return PeopleApiAuthorization.getNewToken(oAuth2Client, callback);
//       const parsedToken = Buffer.from(token).toString('utf8');
//       oAuth2Client.setCredentials(JSON.parse(parsedToken));
//       callback(oAuth2Client);
//     });
//   }

//   // ? Get New Token

//   static getNewToken(oAuth2Client, callback) {
//     const authUrl = oAuth2Client.generateAuthUrl({
//       access_type: 'offline',
//       //@ts-ignore
//       scope: this.SCOPES,
//     });
//     console.log('Authorize this app by visiting this url:', authUrl);
//     const rl = readline.createInterface({
//       input: process.stdin,
//       output: process.stdout,
//     });
//     rl.question('Enter the code from that page here: ', (code) => {
//       rl.close();
//       oAuth2Client.getToken(code, (err, token) => {
//         if (err) return console.error('Error retrieving access token', err);
//         oAuth2Client.setCredentials(token);
//         // Store the token to disk for later program executions
//         //@ts-ignore
//         fs.writeFile(this.TOKEN_PATH, JSON.stringify(token), (err) => {
//           if (err) return console.error(err);
//           //@ts-ignore
//           console.log('Token stored to', this.TOKEN_PATH);
//         });
//         callback(oAuth2Client);
//       });
//     });
//   }
// }
