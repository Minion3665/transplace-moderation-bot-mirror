import { EmbedBuilder, type User } from 'discord.js';

export default async function unbanNotice(target: User, staff_member: User, reason?: string) {
  return new EmbedBuilder()
    .setTitle('User Unbanned')
    .setDescription(`${target} (\`${target.id}\` — \`${target.username}\`) was unbanned by ${staff_member} (\`${staff_member.id}\` — \`${staff_member.username}\`)`)
    .addFields(reason ? [{ name: 'Reason', value: reason }] : [{ name: 'No reason provided', value: '_ _' }]);
}