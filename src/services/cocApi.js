/**
 * Clash of Clans API service
 * Documentation: https://developer.clashofclans.com/
 */

const BASE_URL = '/api'; // Vite will proxy this

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

/**
 * Get player information by tag
 * @param {string} playerTag - Player tag (e.g. #ABC123)
 * @returns {Promise<Object>} Player data
 */
export const getPlayer = async (playerTag) => {
  // Ensure correct tag format (The API requires tags to start with # and be URL encoded)
  let processedTag = playerTag;
  if (!processedTag.startsWith('#')) {
    processedTag = '#' + processedTag;
  }
  const formattedTag = encodeURIComponent(processedTag);
  console.log(`Searching for player with tag: ${formattedTag} (original: ${playerTag})`);
  
  try {
    console.log(`Full URL: ${BASE_URL}/players/${formattedTag}`);
    
    const apiKey = getAPIKey();
    
    // Make the API request
    const response = await fetch(
      `${BASE_URL}/players/${formattedTag}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );
    
    console.log(`Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Player not found');
      } else if (response.status === 403) {
        throw new Error('Authentication failed - check API key and IP whitelist');
      } else {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Error: ${response.status} ${response.statusText}`);
      }
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Error (getPlayer): ${error.message}`);
    throw error;
  }
};

/**
 * Get clan information by tag
 * @param {string} clanTag - Clan tag (e.g. #ABC123)
 * @returns {Promise<Object>} Clan data
 */
export const getClan = async (clanTag) => {
  // Ensure correct tag format (The API requires tags to start with # and be URL encoded)
  let processedTag = clanTag;
  if (!processedTag.startsWith('#')) {
    processedTag = '#' + processedTag;
  }
  const formattedTag = encodeURIComponent(processedTag);
  console.log(`Searching for clan with tag: ${formattedTag} (original: ${clanTag})`);
  
  try {
    console.log(`Full URL: ${BASE_URL}/clans/${formattedTag}`);
    
    const apiKey = getAPIKey();
    
    const response = await fetch(
      `${BASE_URL}/clans/${formattedTag}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );
    
    console.log(`Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Clan not found');
      } else if (response.status === 403) {
        throw new Error('Authentication failed - check API key and IP whitelist');
      } else {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Error: ${response.status} ${response.statusText}`);
      }
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Error (getClan): ${error.message}`);
    throw error;
  }
};

/**
 * Get clan war log
 * @param {string} clanTag - Clan tag
 * @returns {Promise<Object>} War log data
 */
export const getClanWarLog = async (clanTag) => {
  // Ensure correct tag format (The API requires tags to start with # and be URL encoded)
  let processedTag = clanTag;
  if (!processedTag.startsWith('#')) {
    processedTag = '#' + processedTag;
  }
  const formattedTag = encodeURIComponent(processedTag);
  console.log(`Searching for clan war log with tag: ${formattedTag} (original: ${clanTag})`);

  try {
    const apiKey = getAPIKey(); // Use the helper function
    const response = await fetch(
      `${BASE_URL}/clans/${formattedTag}/warlog`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}` // Use the fetched API key
        }
      }
    );
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Clan war log not found');
      } else if (response.status === 403) {
        throw new Error('Authentication failed or war log is private');
      } else {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Error: ${response.status} ${response.statusText}`);
      }
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Error (getClanWarLog): ${error.message}`);
    throw error;
  }
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