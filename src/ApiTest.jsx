import { useState } from 'react';
import { getPlayerInfo, getClanInfo } from './services/cocApi';

export default function ApiTest() {
  const [tag, setTag] = useState('PJR8CQU9C');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState('player');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      let data;
      if (searchType === 'player') {
        data = await getPlayerInfo(tag);
      } else {
        data = await getClanInfo(tag);
      }
      setResult(data);
    } catch (err) {
      console.error('API Test Error:', err);
      setError(err.message || 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Clash of Clans API Test</h1>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label className="block mb-2">
            Search Type:
            <select 
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="ml-2 p-2 border rounded"
            >
              <option value="player">Player</option>
              <option value="clan">Clan</option>
            </select>
          </label>
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">
            Tag:
            <input 
              type="text" 
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="ml-2 p-2 border rounded w-full"
              placeholder="Enter player or clan tag (e.g. #ABC123)"
            />
          </label>
        </div>
        
        <button 
          type="submit" 
          className="bg-blue-500 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
      )}
      
      {result && (
        <div className="bg-green-100 border border-green-400 p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Result:</h2>
          <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 