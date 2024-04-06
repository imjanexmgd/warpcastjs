import fs from 'fs';
import inquirer from 'inquirer';
import getMe from './src/warpcast/getMe.js';
import { loggerSuccess } from './src/utils/logger.js';
import followChannelbyUser from './src/func/followChannelbyUser.js';

const tokenJson = JSON.parse(fs.readFileSync('acc.json'));
const selectProfile = async () => {
   try {
      const list = tokenJson.map((item) => item.username);
      const { selected } = await inquirer.prompt({
         type: 'list',
         message: 'Pilih username:',
         name: 'selected',
         choices: list,
      });
      const selectedUser = tokenJson.find((item) => item.username === selected);
      process.stdout.write('\x1Bc');
      return selectedUser;
   } catch (error) {
      throw error;
   }
};
const profileDetail = async () => {
   try {
      const profile = await selectProfile();
      const { token, username } = profile;
      const { result } = await getMe(token);
      console.log(
         `Login as ${result.user.username} with fid ${result.user.fid}`
      );
      return { user: result.user, token };
   } catch (error) {
      throw error;
   }
};
const listService = ['Follow Channel by User'];
(async () => {
   try {
      process.stdout.write('\x1Bc');
      const profile = await profileDetail();
      console.log('\n');
      const { token, user } = profile;
      await followChannelbyUser(token, user);
      return;
      const { service } = await inquirer.prompt({
         type: 'list',
         message: 'select service',
         name: 'service',
         choices: listService,
      });
      if (service == 'Follow Channel by User') {
         await followChannelbyUser(token, user);
      }
   } catch (error) {
      console.log(error);
   }
})();
