import { ResponsiveSlashCommandSubcommandBuilder } from '@interactionHandling/commandBuilders.js';
import unban from '@resources/modals/unban.js';
import { getSnowflakeMap } from '@utils.js';
import { GuildMemberRoleManager, SlashCommandUserOption } from 'discord.js';

export default new ResponsiveSlashCommandSubcommandBuilder()
  .setName('unban')
  .setDescription('Unban a user from the server.')
  .addUserOption(new SlashCommandUserOption()
    .setName('user')
    .setDescription('The user to unban.')
    .setRequired(true)
  )
  .setResponse(async (interaction, _interactionHandler, _command) => {
    if (!interaction.isChatInputCommand()) return;
    if (!interaction.guild) return;

    const SNOWFLAKE_MAP = await getSnowflakeMap();

    const IS_STAFF_MEMBER =
      interaction.member?.roles instanceof GuildMemberRoleManager ?
        interaction.member.roles.cache.hasAny(...SNOWFLAKE_MAP.Staff_Roles) :
        interaction.member?.roles?.some(r => (<string[]>interaction.member?.roles).includes(r)) ?? false;

    if (!IS_STAFF_MEMBER) {
      await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
      return;
    }

    const user = interaction.options.getUser('user', true);

    if (!await interaction.guild.bans.fetch(user).catch(() => null)) {
      await interaction.reply({ content: 'This user is not banned.', ephemeral: true });
      return;
    }

    await interaction.showModal(unban.setCustomId(`modals.unban.${user.id}`));
  })