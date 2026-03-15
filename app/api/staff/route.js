import { NextResponse } from "next/server";
import { resolveHighestRankFromRoleIds } from "@/lib/discord-role-groups";
import { getRank } from "@/lib/permissions";

function getAvatarUrl(user) {
  if (!user?.avatar) {
    return "";
  }

  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`;
}

export async function GET() {
  const guildId = process.env.DISCORD_GUILD_ID;
  const token = process.env.DISCORD_BOT_TOKEN;

  if (!guildId || !token) {
    return NextResponse.json({
      configured: false,
      source: "empty",
      staff: []
    });
  }

  try {
    const [membersResponse] = await Promise.all([
      fetch(`https://discord.com/api/v10/guilds/${guildId}/members?limit=1000`, {
        headers: {
          Authorization: `Bot ${token}`,
          Accept: "application/json"
        },
        cache: "no-store"
      })
    ]);

    if (!membersResponse.ok) {
      return NextResponse.json(
        {
          configured: true,
          source: "remote",
          error: `Discord staff request failed with status ${membersResponse.status}.`
        },
        { status: membersResponse.status }
      );
    }

    const members = await membersResponse.json();
    const staff = members
      .map((member, index) => {
        const rankKey = resolveHighestRankFromRoleIds(member.roles || []);
        if (rankKey === "guest") {
          return null;
        }

        const rank = getRank(rankKey);
        const displayName =
          member.nick ||
          member.user?.global_name ||
          member.user?.username ||
          `Staff ${index + 1}`;

        return {
          id: member.user.id,
          discordId: member.user.id,
          discordTag:
            member.user?.discriminator && member.user.discriminator !== "0"
              ? `${member.user.username}#${member.user.discriminator}`
              : member.user?.username || "unknown",
          avatar: getAvatarUrl(member.user),
          displayName,
          codename: `TLRP-${String(index + 1).padStart(3, "0")}`,
          rankKey,
          department: rank.label,
          grade: null,
          leaderboardPoints: null,
          staffOfWeek: null,
          activity: null,
          reviews: [],
          overview: {
            joinedAt: member.joined_at ? member.joined_at.slice(0, 10) : "-",
            lastPatrol: "-",
            patrolHours: null,
            moderationActions: null,
            adminActions: null,
            shiftStatus: "Linked"
          }
        };
      })
      .filter(Boolean)
      .sort((left, right) => getRank(right.rankKey).level - getRank(left.rankKey).level);

    return NextResponse.json({
      configured: true,
      source: "remote",
      staff
    });
  } catch (error) {
    return NextResponse.json(
      {
        configured: true,
        source: "remote",
        error: error.message
      },
      { status: 500 }
    );
  }
}
