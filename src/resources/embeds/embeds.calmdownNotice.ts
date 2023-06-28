import { EmbedBuilder, Message, User } from 'discord.js';


export default async function calmdownNotice(staff_member: User, linked_message: Message, reason?: string) {
  const EMBED = new EmbedBuilder()
    .setAuthor({ name: 'Chat Calmed down by', iconURL: staff_member.displayAvatarURL() })
    .setDescription(`> ${staff_member}`)
    .setTimestamp();

  if (reason) {
    EMBED.addFields([
      { name: 'Reason', value: reason, inline: false },
    ]);

  }

  EMBED.addFields([
    { name: 'Message sent by Badeline', value: `[Jump to Message](${linked_message.url})`, inline: false },
  ]);


  return EMBED;
}