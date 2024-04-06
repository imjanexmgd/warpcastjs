import chalk from 'chalk';
import getFollowingCh from '../warpcast/getFollowingCh.js';
import followCh from '../warpcast/followCh.js';
import delay from '../utils/delay.js';
import { loggerFailed, loggerInfo, loggerSuccess } from '../utils/logger.js';
import inquirer from 'inquirer';

const processGetFollowingChannel = async (token, fid) => {
   try {
      let listFollowingCh = [];
      let getChannel;
      while (true) {
         getChannel = await getFollowingCh(token, fid);
         if (getChannel.result.channels.length == 0) {
            loggerInfo('No channel Following!!!');
            break;
         }
         for (const channel of getChannel.result.channels) {
            const feedKey = channel.key;
            listFollowingCh.push(feedKey);
         }
         break;
      }
      if (getChannel.next) {
         let cursor;
         cursor = getChannel.next.cursor;
         while (true) {
            loggerInfo('fetch more');
            let getChannel;
            getChannel = await getFollowingCh(token, fid, cursor);
            for (const channel of getChannel.result.channels) {
               const feedKey = channel.key;
               listFollowingCh.push(feedKey);
            }
            if (getChannel.next) {
               cursor = getChannel.next.cursor;
            } else {
               loggerInfo('No more :(');
               break;
            }
         }
         return listFollowingCh;
      } else {
         loggerInfo('No more following ch to get');
         return listFollowingCh;
      }
   } catch (error) {
      loggerFailed('Error at processGetFollowingChannel.js');
      throw error;
   }
};
const followChannelbyFid = async (token, user) => {
   try {
      process.stdout.write('\x1Bc');
      console.log(
         chalk.italic(
            `\nAuto following Channel by Fid\ncreated with ♡ by janexmgd\n\n`
         )
      );
      loggerInfo(`Login as @${user.username} with fid ${user.fid}`);
      loggerInfo(`Trying get your following channel`);
      const myFollowingCh = await processGetFollowingChannel(token, user.fid);
      loggerInfo(
         `@${user.username} Following Channel total is ${myFollowingCh.length}`
      );
      console.log();
      const { targetFid } = await inquirer.prompt({
         type: 'input',
         message: `insert target fid`,
         name: 'targetFid',
      });
      console.log();
      loggerInfo(`Get following Channel fid ${targetFid}`);
      const targetFollowingCh = await processGetFollowingChannel(
         token,
         targetFid
      );
      loggerSuccess(`Success following Channel fid ${targetFid}`);
      loggerInfo(
         `Total following fid ${targetFid} ${targetFollowingCh.length}`
      );
      const nonFollowingChannel = targetFollowingCh.filter(
         (channel) => !myFollowingCh.includes(channel)
      );
      loggerInfo(`You will Following ${nonFollowingChannel.length} channel`);
      console.log();
      const { isWant } = await inquirer.prompt({
         type: 'confirm',
         message: `Do you want follow ${nonFollowingChannel.length} channel ?`,
         name: 'isWant',
      });
      console.log();
      if (isWant) {
         for (const channel of nonFollowingChannel) {
            const r = await followCh(token, channel);
            if (r.result.success == true) {
               loggerSuccess(`Success following Channel ${channel}`);
               // const ms = (Math.random() * (max - min) + min).toFixed(3) * 1000;
               const ms = (Math.random() * (4 - 2) + 2).toFixed(3) * 1000;
               await delay(ms);
            } else {
               loggerFailed(`Fail following Channel ${channel}`);
            }
         }
      } else {
         loggerInfo('stopped');
      }
   } catch (error) {
      throw error;
   }
};
export default followChannelbyFid;
