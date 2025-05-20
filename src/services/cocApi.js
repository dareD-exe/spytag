/**
 * Clash of Clans API service
 * Documentation: https://developer.clashofclans.com/
 * Last updated: Serverless function integration with Fixie
 */

// This file now calls our Vercel Serverless Functions, which then call the CoC API via Fixie.
console.log('🚀 Loading cocApi.js v2.0 with serverless functions at /api/coc/player, /api/coc/clan, etc.');

const BASE_URL = '/api'; // Vite proxy is now disabled, we call serverless directly

/**
 * Extract the complete API key from the .env file
 */
const getAPIKey = () => {
  try {
    const apiKey = import.meta.env.VITE_COC_API_KEY;
    console.log('API Key length:', apiKey?.length || 'undefined');
    
    // Check if the API key appears to be truncated
    if (apiKey && apiKey.length < 100) {
      console.warn('API Key appears to be truncated');
    }
    
    return apiKey;
  } catch (error) {
    console.error('Error accessing environment variables:', error);
    return null;
  }
};

async function fetchFromApiRoutes(endpointPath) {
  console.log("Client-side fetching from our API route:", endpointPath);
  const response = await fetch(endpointPath, { // Calls /api/coc/player/TAG or /api/coc/clan/TAG
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "Failed to parse error JSON from API route" , details: response.statusText}));
    console.error(`Error from API Route (${response.status}):`, errorData);
    throw new Error(errorData.error || `Failed to fetch from ${endpointPath}`);
  }
  return response.json();
}

export const getPlayerInfo = async (playerTag) => {
  const encodedPlayerTag = encodeURIComponent(playerTag);
  // Note: We are now calling our own API endpoint, not the CoC API directly from client
  return fetchFromApiRoutes(`/api/coc/player/${encodedPlayerTag}`);
};

export const getClanInfo = async (clanTag) => {
  const encodedClanTag = encodeURIComponent(clanTag);
  return fetchFromApiRoutes(`/api/coc/clan/${encodedClanTag}`);
};

export const getWarLog = async (clanTag) => {
  const encodedClanTag = encodeURIComponent(clanTag);
  return fetchFromApiRoutes(`/api/coc/warlog/${encodedClanTag}`);
};

/**
 * Mock data for development
 */
const getMockPlayerData = (tag) => {
  return {
    tag: tag,
    name: "ClashChampion",
    townHallLevel: 14,
    expLevel: 200,
    trophies: 5400,
    bestTrophies: 5900,
    warStars: 1200,
    attackWins: 250,
    defenseWins: 48,
    builderHallLevel: 9,
    versusTrophies: 3500,
    clan: {
      tag: "#XYZ123",
      name: "Elite Warriors",
      clanLevel: 15,
      badgeUrls: {
        small: "https://api-assets.clashofclans.com/badges/70/example.png",
        medium: "https://api-assets.clashofclans.com/badges/200/example.png"
      }
    },
    role: "co-leader",
    donations: 12500,
    donationsReceived: 10200,
    heroes: [
      { name: "Barbarian King", level: 75, maxLevel: 85 },
      { name: "Archer Queen", level: 80, maxLevel: 85 },
      { name: "Grand Warden", level: 55, maxLevel: 60 },
      { name: "Royal Champion", level: 30, maxLevel: 35 }
    ],
    spells: [
      { name: "Lightning Spell", level: 9, maxLevel: 10 },
      { name: "Healing Spell", level: 9, maxLevel: 9 },
      { name: "Rage Spell", level: 6, maxLevel: 6 }
    ],
    troops: [
      { name: "Barbarian", level: 9, maxLevel: 10 },
      { name: "Archer", level: 10, maxLevel: 10 },
      { name: "Giant", level: 10, maxLevel: 11 }
    ]
  };
};

const getMockClanData = (tag) => {
  return {
    tag: tag,
    name: "Elite Warriors",
    type: "inviteOnly",
    description: "Competitive war clan, active donations and friendly atmosphere!",
    location: {
      id: 32000006,
      name: "International",
      isCountry: false
    },
    badgeUrls: {
      small: "https://api-assets.clashofclans.com/badges/70/example.png",
      medium: "https://api-assets.clashofclans.com/badges/200/example.png"
    },
    clanLevel: 15,
    clanPoints: 32000,
    clanVersusPoints: 25000,
    requiredTrophies: 3000,
    warFrequency: "always",
    warWinStreak: 5,
    warWins: 250,
    warTies: 15,
    warLosses: 120,
    isWarLogPublic: true,
    members: 48,
    memberList: [
      {
        tag: "#ABC123",
        name: "ClashChampion",
        role: "leader",
        expLevel: 200,
        trophies: 5400,
        versusTrophies: 3500,
        clanRank: 1,
        donations: 12500,
        donationsReceived: 10200
      },
      // More members would be listed here
    ]
  };
};

const getMockWarLogData = (tag) => {
  return {
    items: [
      {
        result: "win",
        endTime: "20230610T201010.000Z",
        teamSize: 15,
        clan: {
          tag: tag,
          name: "Elite Warriors",
          badgeUrls: {
            small: "https://api-assets.clashofclans.com/badges/70/example.png"
          },
          clanLevel: 15,
          attacks: 45,
          stars: 42,
          destructionPercentage: 97.2
        },
        opponent: {
          tag: "#OPPONENT1",
          name: "War Machine",
          badgeUrls: {
            small: "https://api-assets.clashofclans.com/badges/70/example2.png"
          },
          clanLevel: 14,
          attacks: 45,
          stars: 38,
          destructionPercentage: 92.5
        }
      },
      {
        result: "lose",
        endTime: "20230608T201010.000Z",
        teamSize: 15,
        clan: {
          tag: tag,
          name: "Elite Warriors",
          badgeUrls: {
            small: "https://api-assets.clashofclans.com/badges/70/example.png"
          },
          clanLevel: 15,
          attacks: 45,
          stars: 35,
          destructionPercentage: 87.2
        },
        opponent: {
          tag: "#OPPONENT2",
          name: "Dragon Lords",
          badgeUrls: {
            small: "https://api-assets.clashofclans.com/badges/70/example3.png"
          },
          clanLevel: 16,
          attacks: 45,
          stars: 40,
          destructionPercentage: 94.1
        }
      }
    ]
  };
}; 