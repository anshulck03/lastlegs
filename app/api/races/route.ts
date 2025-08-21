import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'
import { parse, format, addDays, isAfter, isBefore } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { z } from 'zod'

// Types
type RaceStatus = "Open" | "Closed" | "Waitlist" | "Sold Out" | "Registration Soon" | "Unknown";

type Race = {
  name: string;
  dateISO: string;   // YYYY-MM-DD
  dateText: string;  // e.g., "Oct 12, 2025"
  location: string;
  distance: "Full" | "70.3";
  url: string;       // direct deep link to race page
  status: RaceStatus;
};

type CacheEntry = {
  data: Race[];
  fetchedAt: number;
};

// Sources
const LISTING_SOURCES = [
  { distance: "70.3", url: "https://www.ironman.com/ironman-70-3-events" },
  { distance: "Full", url: "https://www.ironman.com/ironman-events" }
] as const;

// Cache
declare global {
  var __racesCache: CacheEntry | undefined;
}

const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

// Input validation schema
const QuerySchema = z.object({
  distance: z.enum(["HALF", "FULL"]).optional(),
  limit: z.coerce.number().min(1).max(12).default(12)
});

// Helper functions
function parseDateText(dateText: string): string | null {
  const patterns = [
    'MMM d, yyyy',
    'd MMM yyyy',
    'MMM dd, yyyy',
    'dd MMM yyyy',
    'MMMM d, yyyy',
    'd MMMM yyyy'
  ];

  for (const pattern of patterns) {
    try {
      const parsed = parse(dateText, pattern, new Date());
      if (parsed.toString() !== 'Invalid Date') {
        return format(parsed, 'yyyy-MM-dd');
      }
    } catch {
      continue;
    }
  }
  return null;
}

function inferStatusFromUrl(url: string): RaceStatus {
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes('/open/')) return "Open";
  if (lowerUrl.includes('/waitlist/')) return "Waitlist";
  if (lowerUrl.includes('/closed/')) return "Closed";
  if (lowerUrl.includes('/sold') && lowerUrl.includes('out')) return "Sold Out";
  if (lowerUrl.includes('coming soon') || lowerUrl.includes('opens')) return "Registration Soon";
  
  return "Unknown";
}

async function fetchWithRetry(url: string, retries = 1): Promise<string> {
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        signal: AbortSignal.timeout(10000) // 10s timeout
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.text();
    } catch (error) {
      if (i === retries) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
    }
  }
  throw new Error('Max retries exceeded');
}

async function scrapeRaces(): Promise<Race[]> {
  const allRaces: Race[] = [];
  const today = toZonedTime(new Date(), 'America/Los_Angeles');
  const oneYearFromNow = addDays(today, 365);

  for (const source of LISTING_SOURCES) {
    try {
      const html = await fetchWithRetry(source.url);
      const $ = cheerio.load(html);
      
      // Common selectors for race cards/rows
      const raceSelectors = [
        '.event-card',
        '.race-card',
        '.event-item',
        '.race-item',
        '[data-event]',
        '.card',
        'article'
      ];

      let raceElements: cheerio.Cheerio<any> | null = null;
      
      for (const selector of raceSelectors) {
        const elements = $(selector);
        if (elements.length > 0) {
          raceElements = elements;
          break;
        }
      }

      if (!raceElements || raceElements.length === 0) {
        console.warn(`No race elements found for ${source.distance} events`);
        continue;
      }

      raceElements.each((_, element) => {
        try {
          const $el = $(element);
          
          // Extract race information
          const name = $el.find('h3, h4, .event-name, .race-name, [data-name]').first().text().trim();
          const location = $el.find('.location, .venue, [data-location]').first().text().trim();
          const dateText = $el.find('.date, .event-date, [data-date]').first().text().trim();
          const url = $el.find('a').first().attr('href');
          const statusText = $el.find('.status, .badge, .label').first().text().trim().toLowerCase();

          if (!name || !location || !dateText || !url) {
            return; // Skip incomplete entries
          }

          // Parse date
          const dateISO = parseDateText(dateText);
          if (!dateISO) {
            return; // Skip if date parsing fails
          }

          // Check if date is within range
          const raceDate = parse(dateISO, 'yyyy-MM-dd', new Date());
          if (isBefore(raceDate, today) || isAfter(raceDate, oneYearFromNow)) {
            return; // Skip if outside date range
          }

          // Determine status
          let status: RaceStatus = "Unknown";
          if (statusText.includes('open')) status = "Open";
          else if (statusText.includes('waitlist')) status = "Waitlist";
          else if (statusText.includes('closed')) status = "Closed";
          else if (statusText.includes('sold out')) status = "Sold Out";
          else if (statusText.includes('coming soon') || statusText.includes('opens')) status = "Registration Soon";

          // If status is still unknown, try to infer from URL
          if (status === "Unknown") {
            status = inferStatusFromUrl(url);
          }

          // Make URL absolute if it's relative
          const absoluteUrl = url.startsWith('http') ? url : `https://www.ironman.com${url}`;

          allRaces.push({
            name,
            dateISO,
            dateText,
            location,
            distance: source.distance,
            url: absoluteUrl,
            status
          });
        } catch (error) {
          console.warn('Error parsing race element:', error);
        }
      });
    } catch (error) {
      console.error(`Error scraping ${source.distance} events:`, error);
    }
  }

  // De-duplicate and sort
  const uniqueRaces = allRaces.filter((race, index, self) => 
    index === self.findIndex(r => r.url === race.url || (r.name === race.name && r.dateISO === race.dateISO))
  );

  return uniqueRaces
    .sort((a, b) => a.dateISO.localeCompare(b.dateISO))
    .slice(0, 12);
}

export async function GET(req: Request) {
  try {
    // Validate query parameters
    const url = new URL(req.url);
    const parseResult = QuerySchema.safeParse({
      distance: url.searchParams.get("distance") ?? undefined,
      limit: url.searchParams.get("limit") ?? undefined
    });

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "BAD_INPUT", issues: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { distance, limit } = parseResult.data;
    // Check cache
    const now = Date.now();
    if (globalThis.__racesCache && (now - globalThis.__racesCache.fetchedAt) < CACHE_DURATION) {
      let cachedRaces = globalThis.__racesCache.data;
      
      // Apply distance filter if specified
      if (distance) {
        const filterDistance = distance === "HALF" ? "70.3" : "Full";
        cachedRaces = cachedRaces.filter(race => race.distance === filterDistance);
      }
      
      // Apply limit
      cachedRaces = cachedRaces.slice(0, limit);

      return NextResponse.json({
        fallback: false,
        count: cachedRaces.length,
        items: cachedRaces
      });
    }

    // Fetch fresh data
    const races = await scrapeRaces();
    
    // Apply distance filter if specified
    let filteredRaces = races;
    if (distance) {
      const filterDistance = distance === "HALF" ? "70.3" : "Full";
      filteredRaces = races.filter(race => race.distance === filterDistance);
    }
    
    // Apply limit
    const limitedRaces = filteredRaces.slice(0, limit);
    
    // If scraping failed, return fallback data
    if (races.length === 0) {
      const fallbackRaces: Race[] = [
        {
          name: "Ironman 70.3 La Quinta",
          dateISO: "2025-12-07",
          dateText: "Dec 7, 2025",
          location: "La Quinta, CA",
          distance: "70.3",
          url: "https://www.ironman.com/im703-la-quinta",
          status: "Open"
        },
        {
          name: "Ironman Arizona",
          dateISO: "2025-11-23",
          dateText: "Nov 23, 2025",
          location: "Tempe, AZ",
          distance: "Full",
          url: "https://www.ironman.com/im-arizona",
          status: "Open"
        },
        {
          name: "Ironman 70.3 Oceanside",
          dateISO: "2025-04-05",
          dateText: "Apr 5, 2025",
          location: "Oceanside, CA",
          distance: "70.3",
          url: "https://www.ironman.com/im703-oceanside",
          status: "Registration Soon"
        },
        {
          name: "Ironman Texas",
          dateISO: "2025-04-26",
          dateText: "Apr 26, 2025",
          location: "The Woodlands, TX",
          distance: "Full",
          url: "https://www.ironman.com/im-texas",
          status: "Open"
        },
        {
          name: "Ironman 70.3 St. George",
          dateISO: "2025-05-03",
          dateText: "May 3, 2025",
          location: "St. George, UT",
          distance: "70.3",
          url: "https://www.ironman.com/im703-st-george",
          status: "Waitlist"
        },
        {
          name: "Ironman Coeur d'Alene",
          dateISO: "2025-06-29",
          dateText: "Jun 29, 2025",
          location: "Coeur d'Alene, ID",
          distance: "Full",
          url: "https://www.ironman.com/im-coeur-dalene",
          status: "Open"
        }
      ];
      
      // Update cache with fallback data
      globalThis.__racesCache = {
        data: fallbackRaces,
        fetchedAt: now
      };

      return NextResponse.json({
        fallback: true,
        count: fallbackRaces.length,
        items: fallbackRaces
      });
    }
    
    // Update cache with scraped data (store full data, not filtered)
    globalThis.__racesCache = {
      data: races,
      fetchedAt: now
    };

    return NextResponse.json({
      fallback: false,
      count: limitedRaces.length,
      items: limitedRaces
    });

  } catch (error) {
    console.error('Error fetching races:', error);
    
    // Check if this is a database connectivity issue
    if (error instanceof Error && (
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('database') ||
      error.message.includes('prisma') ||
      error.message.includes('connection')
    )) {
      return NextResponse.json(
        { error: "DB_UNAVAILABLE", message: "Database temporarily unavailable" },
        { status: 503 }
      );
    }
    
    // Return fallback data on error
    const fallbackRaces: Race[] = [
      {
        name: "Ironman 70.3 La Quinta",
        dateISO: "2025-12-07",
        dateText: "Dec 7, 2025",
        location: "La Quinta, CA",
        distance: "70.3",
        url: "https://www.ironman.com/im703-la-quinta",
        status: "Open"
      },
      {
        name: "Ironman Arizona",
        dateISO: "2025-11-23",
        dateText: "Nov 23, 2025",
        location: "Tempe, AZ",
        distance: "Full",
        url: "https://www.ironman.com/im-arizona",
        status: "Open"
      },
      {
        name: "Ironman 70.3 Oceanside",
        dateISO: "2025-04-05",
        dateText: "Apr 5, 2025",
        location: "Oceanside, CA",
        distance: "70.3",
        url: "https://www.ironman.com/im703-oceanside",
        status: "Registration Soon"
      },
      {
        name: "Ironman Texas",
        dateISO: "2025-04-26",
        dateText: "Apr 26, 2025",
        location: "The Woodlands, TX",
        distance: "Full",
        url: "https://www.ironman.com/im-texas",
        status: "Open"
      },
      {
        name: "Ironman 70.3 St. George",
        dateISO: "2025-05-03",
        dateText: "May 3, 2025",
        location: "St. George, UT",
        distance: "70.3",
        url: "https://www.ironman.com/im703-st-george",
        status: "Waitlist"
      },
      {
        name: "Ironman Coeur d'Alene",
        dateISO: "2025-06-29",
        dateText: "Jun 29, 2025",
        location: "Coeur d'Alene, ID",
        distance: "Full",
        url: "https://www.ironman.com/im-coeur-dalene",
        status: "Open"
      }
    ];
    
    return NextResponse.json({
      fallback: true,
      count: fallbackRaces.length,
      items: fallbackRaces
    }, { status: 503 });
  }
}
