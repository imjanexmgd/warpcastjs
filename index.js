import fs from 'fs';
import inquirer from 'inquirer';
import getMe from './src/warpcast/getMe.js';
import { loggerSuccess } from './src/utils/logger.js';

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
      loggerSuccess(
         `Login as ${result.user.username} with fid ${result.user.fid}`
      );
      return result.user;
   } catch (error) {
      throw error;
   }
};
(async () => {
   try {
      process.stdout.write('\x1Bc');
      const profile = await profileDetail();
   } catch (error) {
      console.log(error);
   }
})();
