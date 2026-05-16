import httpx
import time
import asyncio
from typing import List, Optional, Dict, Any

class AnilistService:
    API_URL = "https://graphql.anilist.co"
    _cache = {}
    CACHE_TTL = 420  # 7 minutes in seconds

    @staticmethod
    def _get_from_cache(key: str):
        if key in AnilistService._cache:
            entry = AnilistService._cache[key]
            if time.time() - entry['timestamp'] < AnilistService.CACHE_TTL:
                return entry['data']
            else:
                del AnilistService._cache[key]
        return None

    @staticmethod
    def _set_to_cache(key: str, data: Any):
        # Don't cache empty results to prevent "stale empty" states
        if not data:
            return
        if isinstance(data, list) and len(data) == 0:
            return
        if isinstance(data, dict) and not data:
            return
            
        AnilistService._cache[key] = {
            'data': data,
            'timestamp': time.time()
        }

    @staticmethod
    async def _query(query_str: str, variables: Dict[str, Any] = None):
        headers = {
            "Content-Type": "application/json",
        }
        max_retries = 3
        for attempt in range(max_retries):
            async with httpx.AsyncClient(timeout=60.0, headers=headers) as client:
                try:
                    resp = await client.post(AnilistService.API_URL, json={'query': query_str, 'variables': variables or {}})
                    if resp.status_code == 200:
                        json_data = resp.json()
                        if 'errors' in json_data:
                            print(f"[AnilistService] GraphQL Errors for query: {json_data['errors']}")
                        return json_data.get('data', {})
                    elif resp.status_code == 429:
                        print(f"[AnilistService] Rate limited (429). Attempt {attempt + 1}/{max_retries}.")
                        await asyncio.sleep(2.0 * (attempt + 1))
                    else:
                        print(f"[AnilistService] API error {resp.status_code}: {resp.text[:500]}")
                        if attempt == max_retries - 1: return None
                        await asyncio.sleep(1.0)
                except Exception as e:
                    print(f"[AnilistService] Query exception (Attempt {attempt + 1}): {e}")
                    if attempt == max_retries - 1: return None
                    await asyncio.sleep(1.0)
        return None

    @staticmethod
    async def get_trending(page: int = 1, per_page: int = 20) -> List[dict]:
        cache_key = f"trending_{page}_{per_page}"
        cached_data = AnilistService._get_from_cache(cache_key)
        if cached_data: return cached_data

        query = """
        query ($page: Int, $perPage: Int) {
          Page(page: $page, perPage: $perPage) {
            media(type: ANIME, sort: TRENDING_DESC) {
              id
              title { romaji english native }
              coverImage { extraLarge large }
              bannerImage
              episodes
              description
            }
          }
        }
        """
        data = await AnilistService._query(query, {"page": page, "perPage": per_page})
        if not data: return []
        
        results = []
        for m in data.get('Page', {}).get('media', []):
            results.append({
                "id": str(m['id']),
                "title": m['title']['english'] or m['title']['romaji'] or m['title']['native'],
                "poster_url": m['coverImage']['extraLarge'] or m['coverImage']['large'],
                "banner_url": m['bannerImage'],
                "description": m['description'],
                "episodes": m['episodes'],
                "type": "anime",
                "source": "anilist"
            })
        
        AnilistService._set_to_cache(cache_key, results)
        return results

    @staticmethod
    async def get_top_100(page: int = 1, per_page: int = 100) -> List[dict]:
        cache_key = f"top100_{page}_{per_page}"
        cached_data = AnilistService._get_from_cache(cache_key)
        if cached_data: return cached_data

        query = """
        query ($page: Int, $perPage: Int) {
          Page(page: $page, perPage: $perPage) {
            media(type: ANIME, sort: SCORE_DESC) {
              id
              title { romaji english native }
              coverImage { extraLarge large }
              episodes
            }
          }
        }
        """
        data = await AnilistService._query(query, {"page": page, "perPage": per_page})
        if not data: return []
        
        results = []
        media_list = data.get('Page', {}).get('media', [])
        for m in media_list:
            results.append({
                "id": str(m['id']),
                "title": m['title']['english'] or m['title']['romaji'] or m['title']['native'],
                "poster_url": m['coverImage']['extraLarge'] or m['coverImage']['large'],
                "type": "anime",
                "source": "anilist"
            })
        
        # DEBUG: If results are empty, add a placeholder to see if it's a rendering issue
        if not results:
            print("[AnilistService] DEBUG: Results were empty, adding placeholder.")
            results.append({
                "id": "1",
                "title": "API Debug Item (Check Logs)",
                "poster_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx1-z77Mcl1gsl9P.png",
                "type": "anime",
                "source": "anilist"
            })

        AnilistService._set_to_cache(cache_key, results)
        return results

    @staticmethod
    async def search(query_str: str, page: int = 1, per_page: int = 20) -> List[dict]:
        # Search results are typically not cached or cached for shorter duration
        # But we can cache for 7 mins as requested if the query is the same
        cache_key = f"search_{query_str}_{page}_{per_page}"
        cached_data = AnilistService._get_from_cache(cache_key)
        if cached_data: return cached_data

        search_query = """
        query ($page: Int, $perPage: Int, $search: String) {
          Page(page: $page, perPage: $perPage) {
            media(type: ANIME, search: $search) {
              id
              title { romaji english native }
              coverImage { extraLarge large }
              episodes
            }
          }
        }
        """
        data = await AnilistService._query(search_query, {"page": page, "perPage": per_page, "search": query_str})
        if not data:
            print(f"[Anilist Search] No data returned for query: {query_str}")
            return []
        
        results = []
        media_list = data.get('Page', {}).get('media', [])
        print(f"[Anilist Search] Query: '{query_str}' | Found: {len(media_list)} results")
        
        for m in media_list:
            results.append({
                "id": str(m['id']),
                "title": m['title']['english'] or m['title']['romaji'] or m['title']['native'],
                "poster_url": m['coverImage']['extraLarge'] or m['coverImage']['large'],
                "type": "anime",
                "source": "anilist"
            })
        
        AnilistService._set_to_cache(cache_key, results)
        return results

    @staticmethod
    async def warmup():
        """
        Proactively warms up the cache for trending and top 100 anime.
        This allows 'clickless' instant access to the most popular content.
        """
        print("[AnilistService] Starting background warmup...")
        try:
            # 1. Fetch Trending list
            trending = await AnilistService.get_trending(per_page=20)
            
            # 2. Fetch Top 100 list
            top_100 = await AnilistService.get_top_100(per_page=20)
            
            # 3. Proactively fetch details for the top 10 trending items
            # We limit this to avoid hitting rate limits immediately on startup
            to_warm = trending[:10]
            for item in to_warm:
                await AnilistService.get_info(item['id'])
                await asyncio.sleep(0.5) # Gentle spacing
                
            print(f"[AnilistService] Warmup complete. Cached {len(trending)} trending, {len(top_100)} top items, and 10 detailed profiles.")
        except Exception as e:
            print(f"[AnilistService] Warmup failed: {e}")

    @staticmethod
    async def get_info(anime_id: str) -> Optional[dict]:
        cache_key = f"info_{anime_id}"
        cached_data = AnilistService._get_from_cache(cache_key)
        if cached_data: return cached_data

        query = """
        query ($id: Int) {
          Media(id: $id, type: ANIME) {
            id
            title { romaji english native }
            description
            coverImage { extraLarge large }
            bannerImage
            episodes
            status
            genres
            averageScore
            seasonYear
            streamingEpisodes {
              title
              thumbnail
              url
              site
            }
            nextAiringEpisode {
              episode
              airingAt
            }
            airingSchedule(perPage: 25) {
              nodes {
                episode
                airingAt
              }
            }
          }
        }
        """
        try:
            data = await AnilistService._query(query, {"id": int(anime_id)})
            if not data: return None
            
            m = data.get('Media', {})
            result = {
                "id": str(m['id']),
                "title": m['title']['english'] or m['title']['romaji'] or m['title']['native'],
                "plot": m['description'],
                "poster_url": m['coverImage']['extraLarge'] or m['coverImage']['large'],
                "banner_url": m['bannerImage'],
                "episodes_count": m['episodes'],
                "genres": m['genres'],
                "rating": (m['averageScore'] / 10) if m['averageScore'] else 0,
                "year": m['seasonYear'],
                "status": m['status'],
                "streaming_episodes_count": len(m.get('streamingEpisodes', [])),
                "aired_episodes_from_schedule": max([s['episode'] for s in m.get('airingSchedule', {}).get('nodes', []) if s['airingAt'] < time.time()] + [0]),
                "next_episode": m.get('nextAiringEpisode', {}).get('episode') if m.get('nextAiringEpisode') else None,
                "type": "anime",
                "source": "anilist",
                "hasFullDetails": True
            }
            AnilistService._set_to_cache(cache_key, result)
            return result
        except Exception as e:
            print(f"[AnilistService] get_info error: {e}")
            return None
