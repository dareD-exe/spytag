import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { getPlayerInfo, getClanInfo } from '../services/cocApi';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const tag = searchParams.get('tag');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [type, setType] = useState(null); // 'player' or 'clan'
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchData = async () => {
      if (!tag) {
        setError('No tag provided');
        setLoading(false);
        document.title = "Search | SpyTag"; // Title for no tag
        return;
      }
      
      setLoading(true);
      setError(null);
      document.title = "Searching... | SpyTag"; // Title while loading
      
      try {
        // First try to fetch as player
        const playerData = await getPlayerInfo(tag);
        setData(playerData);
        setType('player');
        document.title = `${playerData.name} | SpyTag`; // Title for player
      } catch (playerError) {
        console.error('Player fetch error:', playerError);
        try {
          // If not a player, try as clan
          const clanData = await getClanInfo(tag);
          setData(clanData);
          setType('clan');
          document.title = `${clanData.name} | SpyTag`; // Title for clan
        } catch (clanError) {
          console.error('Clan fetch error:', clanError);
          document.title = "Error | SpyTag"; // Title for error
          
          // Provide more detailed error message
          if (playerError.message === 'Player not found' || clanError.message === 'Clan not found') {
            setError(`Could not find player or clan with tag "${tag}". Please verify the tag is correct.`);
          } else {
            setError(`Error fetching data: ${playerError.message || clanError.message}`);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [tag]);
  
  // Update title if loading or error state changes after initial fetch attempt
  useEffect(() => {
    if (loading) {
      document.title = "Searching... | SpyTag";
    } else if (error) {
      document.title = "Error | SpyTag";
    } else if (!data && !tag) {
        document.title = "Search | SpyTag";
    } else if (data && type === 'player') {
        document.title = `${data.name} | SpyTag`;
    } else if (data && type === 'clan') {
        document.title = `${data.name} | SpyTag`;
    }
  }, [loading, error, data, type, tag]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dark-600 border-t-accent-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading data for {tag}...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container-custom py-16">
        <div className="bg-dark-800 border border-dark-600 rounded-lg p-8 max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Error</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link to="/" className="btn-primary">Return Home</Link>
        </div>
      </div>
    );
  }
  
  if (type === 'clan') {
    return <ClanView clan={data} user={user} />;
  }
  
  return <PlayerView player={data} user={user} />;
}

function PlayerView({ player, user }) {
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'builder', 'capital'

  const renderUnit = (unit, type) => (
    <div key={unit.name} className="bg-dark-700 p-3 rounded-lg shadow">
      <p className="font-medium truncate text-sm" title={unit.name}>{unit.name}</p>
      <div className="flex items-center justify-between mt-1 text-xs">
        <span>Level {unit.level}</span>
        <span className="text-gray-400">Max: {unit.maxLevel}</span>
      </div>
      {unit.maxLevel > 0 && (
        <div className="mt-1.5 bg-dark-600 rounded-full h-1.5">
          <div 
            className="bg-accent-primary h-1.5 rounded-full" 
            style={{ width: `${(unit.level / unit.maxLevel) * 100}%` }}
          ></div>
        </div>
      )}
    </div>
  );

  const renderAchievement = (ach, index) => (
    <div key={`${ach.name}-${ach.target}-${ach.value}-${index}`} className="bg-dark-700 p-3 rounded-lg shadow">
      <p className="font-medium text-xs truncate" title={ach.name}>{ach.name}</p>
      <p className="text-xs text-gray-300">Stars: {'★'.repeat(ach.stars)}{'☆'.repeat(3 - ach.stars)}</p>
      <p className="text-xs text-gray-400">{ach.value}/{ach.target}</p>
    </div>
  );

  const homeHeroes = player.heroes?.filter(h => h.village === 'home') || [];
  const builderHeroes = player.heroes?.filter(h => h.village === 'builderBase') || [];
  
  const homeTroops = player.troops?.filter(t => t.village === 'home' && !t.name.includes('Siege Machine') && !t.name.includes('Pet') && !homeHeroes.some(h => h.name === t.name)) || [];
  const homeSpells = player.spells?.filter(s => s.village === 'home') || [];
  const siegeMachines = player.troops?.filter(t => t.village === 'home' && t.name.includes('Siege Machine')) || [];
  const heroPets = player.troops?.filter(t => t.village === 'home' && (t.name.includes('Pet') || ['L.A.S.S.I', 'Electro Owl', 'Mighty Yak', 'Unicorn', 'Frosty', 'Diggy', 'Poison Lizard', 'Phoenix'].includes(t.name))) || []; // More robust pet check

  const builderTroops = player.troops?.filter(t => t.village === 'builderBase' && !builderHeroes.some(h => h.name === t.name)) || [];

  const homeAchievements = player.achievements?.filter(a => a.village === 'home') || [];
  const builderAchievements = player.achievements?.filter(a => a.village === 'builderBase') || [];

  const TabButton = ({ label, tabName, icon }) => (
    <button
      className={`flex items-center justify-center gap-2 px-5 py-3 font-bold text-sm transition-colors duration-150 rounded-t-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 mr-1 last:mr-0
                  ${activeTab === tabName 
                    ? 'bg-orange-600 text-white shadow-lg' // Active tab: Bright orange, white text
                    : 'bg-dark-600 text-gray-400 hover:bg-dark-500 hover:text-gray-200' // Inactive tab: Darker, muted
                  }`}
      onClick={() => setActiveTab(tabName)}
      style={{ minWidth: '130px' }} // Adjusted min width slightly
    >
      {icon && <span className="text-lg mr-1.5">{icon}</span>} 
      {label}
    </button>
  );

  return (
    <div className="container-custom py-12">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-dark-800 border border-dark-700 rounded-lg overflow-hidden shadow-2xl"
      >
        <div className="p-5 bg-dark-700/60 border-b border-dark-600">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-shrink-0 relative">
              {player.expLevel && (
                <span className="absolute -top-2 -left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                  {player.expLevel}
                </span>
              )}
              {player.league && player.league.iconUrls.medium ? (
                <img src={player.league.iconUrls.medium} alt={player.league.name} className="w-20 h-20 rounded-lg shadow-lg" />
              ) : (
                <div className="w-20 h-20 bg-dark-600 rounded-lg flex items-center justify-center text-3xl text-gray-400 shadow-lg">👑</div>
              )}
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-orange-400">{player.name} <span className="text-gray-500 text-lg">({player.tag})</span></h1>
              <p className="text-gray-400 text-sm">
                {player.role ? player.role.charAt(0).toUpperCase() + player.role.slice(1) : 'No Role'}
                {player.townHallLevel && ` • TH ${player.townHallLevel}`}
                {player.townHallWeaponLevel && ` (Lvl ${player.townHallWeaponLevel})`}
              </p>
            </div>

            {player.clan && (
              <Link 
                to={`/search?tag=${encodeURIComponent(player.clan.tag)}`} 
                className="flex-shrink-0 flex flex-col items-center sm:items-end mt-3 sm:mt-0 hover:opacity-80 transition-opacity"
                title={`View ${player.clan.name} details`}
              >
                <img src={player.clan.badgeUrls.medium} alt={player.clan.name} className="w-12 h-12 mb-1 shadow"/>
                <p className="text-xs text-gray-300 truncate max-w-[100px] sm:max-w-[150px]" title={player.clan.name}>{player.clan.name}</p>
              </Link>
            )}
          </div>
        </div>

        {!user ? (
          <div className="p-6 bg-dark-700/30">
            <div className="bg-dark-600/50 rounded-lg p-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 backdrop-blur-sm flex items-center justify-center">
                <Link to="/login" className="btn-primary z-10">Login to see full stats</Link>
              </div>
              <p className="text-gray-400 mb-8">Detailed statistics including troops, heroes, and achievements are available for registered users.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex px-3 pt-3 bg-dark-800">
              <TabButton label="Home Village" tabName="home" icon="⚔️" />
              {(player.builderHallLevel > 0 || builderHeroes.length > 0 || builderTroops.length > 0) && 
                <TabButton label="Builder Base" tabName="builder" icon="🔨" />
              }
              {(player.clanCapitalContributions > 0 || player.playerHouse) && /* Keep playerHouse check for tab visibility for now */
                <TabButton label="Clan Capital" tabName="capital" icon="🏘️" />
              }
            </div>

            <div className="p-4 bg-dark-700 rounded-b-md shadow-inner">
              {activeTab === 'home' && (
                <div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6 p-3 bg-dark-600/50 rounded-md">
                    <div className="text-center"><p className="text-xs text-gray-400">Trophies</p><p className="font-semibold text-gray-200">{player.trophies}</p></div>
                    <div className="text-center"><p className="text-xs text-gray-400">Best Trophies</p><p className="font-semibold text-gray-200">{player.bestTrophies}</p></div>
                    <div className="text-center"><p className="text-xs text-gray-400">War Stars</p><p className="font-semibold text-gray-200">{player.warStars}</p></div>
                    <div className="text-center"><p className="text-xs text-gray-400">Attack Wins</p><p className="font-semibold text-gray-200">{player.attackWins}</p></div>
                    <div className="text-center"><p className="text-xs text-gray-400">Defense Wins</p><p className="font-semibold text-gray-200">{player.defenseWins}</p></div>
                    <div className="text-center"><p className="text-xs text-gray-400">Donations</p><p className="font-semibold text-gray-200">{player.donations}</p></div>
                    <div className="text-center"><p className="text-xs text-gray-400">Received</p><p className="font-semibold text-gray-200">{player.donationsReceived}</p></div>
                  </div>

                  {homeHeroes.length > 0 && (
                    <div className="mb-5"><h3 className="text-md font-semibold mb-2 text-gray-300">Heroes</h3><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">{homeHeroes.map(unit => renderUnit(unit, 'hero'))}</div></div>
                  )}
                  {homeTroops.length > 0 && (
                    <div className="mb-5"><h3 className="text-md font-semibold mb-2 text-gray-300">Troops</h3><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">{homeTroops.map(unit => renderUnit(unit, 'troop'))}</div></div>
                  )}
                  {homeSpells.length > 0 && (
                    <div className="mb-5"><h3 className="text-md font-semibold mb-2 text-gray-300">Spells</h3><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">{homeSpells.map(unit => renderUnit(unit, 'spell'))}</div></div>
                  )}
                  {siegeMachines.length > 0 && (
                    <div className="mb-5"><h3 className="text-md font-semibold mb-2 text-gray-300">Siege Machines</h3><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">{siegeMachines.map(unit => renderUnit(unit, 'troop'))}</div></div>
                  )}
                  {heroPets.length > 0 && (
                    <div className="mb-5"><h3 className="text-md font-semibold mb-2 text-gray-300">Hero Pets</h3><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">{heroPets.map(unit => renderUnit(unit, 'troop'))}</div></div>
                  )}
                  {homeAchievements.length > 0 && (
                    <div><h3 className="text-md font-semibold mb-2 text-gray-300">Achievements</h3><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">{homeAchievements.map((ach, index) => renderAchievement(ach, index))}</div></div>
                  )}
                  {(homeHeroes.length === 0 && homeTroops.length === 0 && homeSpells.length === 0 && siegeMachines.length === 0 && heroPets.length === 0 && homeAchievements.length === 0) && <p className="text-center text-gray-500 py-4">No specific Home Village units or achievements to display.</p>}
                </div>
              )}

              {activeTab === 'builder' && (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6 p-3 bg-dark-600/50 rounded-md">
                      <div className="text-center"><p className="text-xs text-gray-400">Builder Hall</p><p className="font-semibold text-gray-200">{player.builderHallLevel || 'N/A'}</p></div>
                      <div className="text-center"><p className="text-xs text-gray-400">Versus Trophies</p><p className="font-semibold text-gray-200">{player.versusTrophies || 'N/A'}</p></div>
                      <div className="text-center"><p className="text-xs text-gray-400">Best Versus</p><p className="font-semibold text-gray-200">{player.bestBuilderBaseTrophies || 'N/A'}</p></div>
                  </div>
                  {builderHeroes.length > 0 && (
                    <div className="mb-5"><h3 className="text-md font-semibold mb-2 text-gray-300">Heroes</h3><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">{builderHeroes.map(unit => renderUnit(unit, 'hero'))}</div></div>
                  )}
                  {builderTroops.length > 0 && (
                    <div className="mb-5"><h3 className="text-md font-semibold mb-2 text-gray-300">Troops</h3><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">{builderTroops.map(unit => renderUnit(unit, 'troop'))}</div></div>
                  )}
                  {builderAchievements.length > 0 && (
                    <div><h3 className="text-md font-semibold mb-2 text-gray-300">Achievements</h3><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">{builderAchievements.map((ach, index) => renderAchievement(ach, index))}</div></div>
                  )}
                  {(builderHeroes.length === 0 && builderTroops.length === 0 && builderAchievements.length === 0) && <p className="text-center text-gray-500 py-4">No specific Builder Base units or achievements to display.</p>}
                </div>
              )}

              {activeTab === 'capital' && (
                <div>
                  <div className="p-3 bg-dark-600/50 rounded-md mb-5">
                    <p className="text-sm text-gray-400">Clan Capital Contributions: <span className="font-semibold text-gray-200">{player.clanCapitalContributions || 0}</span></p>
                  </div>
                  {player.clanCapitalContributions === 0 && <p className="text-center text-gray-500 py-4">No Clan Capital data to display.</p>}
                </div>
              )}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

function ClanView({ clan, user }) {
  const wins = clan.warWins || 0;
  const losses = clan.warLosses || 0;
  const ties = clan.warTies || 0;
  const totalWars = wins + losses + ties;
  const winRate = totalWars > 0 ? Math.round((wins / totalWars) * 100) : 0;

  return (
    <div className="container-custom py-12">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-dark-800 border border-dark-600 rounded-lg overflow-hidden"
      >
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-24 h-24 bg-dark-700 rounded-full flex items-center justify-center text-4xl flex-shrink-0 mx-auto md:mx-0">
              🏰
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-accent-primary">{clan.name}</h1>
                  <p className="text-gray-400">{clan.tag}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="bg-dark-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                    Level {clan.clanLevel}
                  </span>
                  <span className="bg-dark-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                    {clan.type}
                  </span>
                </div>
              </div>
              
              {clan.description && (
                <div className="bg-dark-700 p-4 rounded-lg mb-6">
                  <p className="text-gray-300">{clan.description}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-dark-700 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500 mb-1">Members</p>
                  <p className="text-xl font-bold">{clan.members}</p>
                </div>
                <div className="bg-dark-700 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500 mb-1">War Wins</p>
                  <p className="text-xl font-bold">{clan.warWins}</p>
                </div>
                <div className="bg-dark-700 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500 mb-1">War Streak</p>
                  <p className="text-xl font-bold">{clan.warWinStreak}</p>
                </div>
                <div className="bg-dark-700 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500 mb-1">Location</p>
                  <p className="text-xl font-bold">{clan.location?.name || 'International'}</p>
                </div>
              </div>
              
              {!user ? (
                <div className="bg-dark-700/50 rounded-lg p-6 text-center relative overflow-hidden">
                  <div className="absolute inset-0 backdrop-blur-sm flex items-center justify-center">
                    <Link to="/login" className="btn-primary z-10">
                      Login to see full stats
                    </Link>
                  </div>
                  <p className="text-gray-500 mb-8">Detailed clan statistics including member list, war log, and more are available for registered users.</p>
                  
                  <div className="grid grid-cols-3 gap-4 mt-4 opacity-20">
                    <div>
                      <p className="text-gray-500 text-sm">Win Rate</p>
                      <p className="text-xl font-bold">---</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">War Losses</p>
                      <p className="text-xl font-bold">---</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">War Ties</p>
                      <p className="text-xl font-bold">---</p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold mb-4 mt-8">War Statistics</h2>
                  
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-dark-700 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-500 mb-1">Win Rate</p>
                      <p className="text-xl font-bold">
                        {winRate}%
                      </p>
                    </div>
                    <div className="bg-dark-700 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-500 mb-1">War Losses</p>
                      <p className="text-xl font-bold">{losses}</p>
                    </div>
                    <div className="bg-dark-700 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-500 mb-1">War Ties</p>
                      <p className="text-xl font-bold">{ties}</p>
                    </div>
                  </div>
                  
                  {clan.memberList && clan.memberList.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-4">Top Members</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="text-left text-gray-500 border-b border-dark-600">
                              <th className="py-3 px-4">Rank</th>
                              <th className="py-3 px-4">Name</th>
                              <th className="py-3 px-4">Role</th>
                              <th className="py-3 px-4">Level</th>
                              <th className="py-3 px-4">Trophies</th>
                              <th className="py-3 px-4">Donations</th>
                            </tr>
                          </thead>
                          <tbody>
                            {clan.memberList.map((member, index) => (
                              <tr key={member.tag} className="border-b border-dark-600 hover:bg-dark-700/50 transition-colors">
                                <td className="py-3 px-4">{member.clanRank}</td>
                                <td className="py-3 px-4">
                                  <Link to={`/search?tag=${encodeURIComponent(member.tag)}`} className="text-accent-primary hover:underline">
                                    {member.name}
                                  </Link>
                                </td>
                                <td className="py-3 px-4 capitalize">{member.role}</td>
                                <td className="py-3 px-4">{member.expLevel}</td>
                                <td className="py-3 px-4">{member.trophies}</td>
                                <td className="py-3 px-4">{member.donations}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 