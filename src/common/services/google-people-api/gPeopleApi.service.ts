import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { google } from 'googleapis';
import { createInterface } from 'readline';

@Injectable()
export class gPeopleApiService {
  // Data Members
  static SCOPES = ['https://www.googleapis.com/auth/contacts'];
  static TOKEN_PATH = 'token.json';

  constructor() {
    console.log('gPeopleApiService.constructor() called');
  }

  static LoadClientSecrets() {
    // Load client secrets from a local file.
    fs.readFile('credentials.json', (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);

      // Authorize a client with credentials, then call the Google Tasks API.
      const parsedContent = Buffer.from(content).toString('utf8');
      gPeopleApiService.authorize(
        JSON.parse(parsedContent),
        this.listConnectionNames, // Calling the main/required function
      );
    });
  }

  static authorize(credentials, callback) {
    console.log('gPeopleApiService.authorize() called');
    console.log('Check "THIS" in the authorize : ', this);

    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0],
    );

    // Check if we have previously stored a token.
    fs.readFile(this.TOKEN_PATH, (err, token) => {
      if (err) return gPeopleApiService.getNewToken(oAuth2Client, callback);
      const parsedToken = Buffer.from(token).toString('utf8');
      oAuth2Client.setCredentials(JSON.parse(parsedToken));
      callback(oAuth2Client);
    });
  }

  // ? Get New Token

  static getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        // //@ts-expect-error
        fs.writeFile(this.TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          // //@ts-expect-error
          console.log('Token stored to', gPeopleApiService.TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    });
  }

  static listConnectionNames(auth: string) {
    console.log(auth);
    const service = google.people({ version: 'v1', auth });

    // ? List Down All Contacts
    service.people.connections.list(
      {
        resourceName: 'people/me',
        pageSize: 10,
        personFields: 'names,emailAddresses',
      },
      (err, res) => {
        if (err) return console.error('The API returned an error: ' + err);
        const connections = res.data.connections;
        if (connections) {
          console.log('Connections:');
          connections.forEach((person) => {
            if (person.names && person.names.length > 0) {
              console.log(person);
            } else {
              console.log('No display name found for connection.');
            }
          });
        } else {
          console.log('No connections found.');
        }
      },
    );
  }
}