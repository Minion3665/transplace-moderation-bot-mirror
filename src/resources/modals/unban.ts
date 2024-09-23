import { ResponsiveModal } from '@interactionHandling/componentBuilders.js';
import InteractionHandler from '@interactionHandling/interactionHandler.js';
import EMBEDS from '@resources/embeds.js';
import { getSnowflakeMap } from '@utils.js';
import chalk from 'chalk';
import { ActionRowBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

export default new ResponsiveModal()
  .setTitle('Unban User')
  .addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder()
        .setLabel('Reason/Context')
        .setCustomId('modals.unban.reason')
        .setPlaceholder('A reason for why this user is being unbanned.')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false)),
  )
  .setResponse(async (interaction, _interactionHandler: InteractionHandler, _command) => {
    if (!interaction.isModalSubmit()) return;
    if (!interaction.guild) return;
    await interaction.deferReply({ ephemeral: true });

    const id = interaction.customId.split('.')[2];
    if (!id) return;

    const user = await interaction.client.users.fetch(id).catch(() => null);
    if (!user) return;

    const reason = interaction.fields.getTextInputValue('modals.unban.reason');

    await interaction.guild.bans.remove(user, reason).catch((error) => {
      interaction.followUp('Failed to unban user. Please check the console logs.');
      console.error(chalk.redBright(error));
      return;
    });

    await interaction.followUp({ content: `Successfully unbanned ${user.tag}.`, ephemeral: true });

    const SNOWFLAKE_MAP = await getSnowflakeMap();
    const LOG_CHANNELS = SNOWFLAKE_MAP.Mod_Logs_Channels['ban'] ?? SNOWFLAKE_MAP.Mod_Logs_Channels['default'] ?? [];

    let notified = false;

    for (const MOD_LOG_CHANNEL of LOG_CHANNELS) {
      const LOG_CHANNEL = await interaction.client.channels.fetch(MOD_LOG_CHANNEL).catch(() => null);
      if (!LOG_CHANNEL?.isTextBased()) continue;

      await LOG_CHANNEL.send({
        content: notified ? '' : SNOWFLAKE_MAP.Sr_Staff_Roles.map(u => `<@&${u}>`).join(' '),
        embeds: [await EMBEDS.unbanNotice(user, interaction.user, reason)],
        allowedMentions: { parse: [], roles: SNOWFLAKE_MAP.Sr_Staff_Roles },
      });

      notified = true;
    }
  });