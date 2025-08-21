import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock fetch to prevent network calls
global.fetch = vi.fn(() => 
  Promise.reject(new Error('Network calls are mocked'))
);

// Mock the Next.js Response
global.Response = class MockResponse {
  constructor(public body: string, public init?: ResponseInit) {}
  
  async json() {
    return JSON.parse(this.body);
  }
  
  get status() {
    return this.init?.status || 200;
  }
} as any;

// Mock NextResponse
const mockNextResponse = {
  json: (data: any, init?: ResponseInit) => new Response(JSON.stringify(data), init)
};

vi.mock('next/server', () => ({
  NextResponse: mockNextResponse
}));

describe('Races API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear global cache
    globalThis.__racesCache = undefined;
  });

  it('should return 400 for invalid distance parameter', async () => {
    // Import the GET handler
    const { GET } = await import('../app/api/races/route');
    
    // Create a request with invalid distance
    const request = new Request('http://localhost:3000/api/races?distance=INVALID');
    
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.error).toBe('BAD_INPUT');
  });

  it('should return 400 for invalid limit parameter', async () => {
    const { GET } = await import('../app/api/races/route');
    
    const request = new Request('http://localhost:3000/api/races?limit=50');
    
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.error).toBe('BAD_INPUT');
  });

  it('should accept valid HALF distance parameter', async () => {
    const { GET } = await import('../app/api/races/route');
    
    const request = new Request('http://localhost:3000/api/races?distance=HALF&limit=5');
    
    const response = await GET(request);
    const data = await response.json();
    
    // Should not be a 400 error (will return fallback data due to mocked fetch)
    expect(response.status).not.toBe(400);
    expect(data.error).not.toBe('BAD_INPUT');
  });

  it('should accept valid FULL distance parameter', async () => {
    const { GET } = await import('../app/api/races/route');
    
    const request = new Request('http://localhost:3000/api/races?distance=FULL&limit=3');
    
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).not.toBe(400);
    expect(data.error).not.toBe('BAD_INPUT');
  });

  it('should use default limit when not specified', async () => {
    const { GET } = await import('../app/api/races/route');
    
    const request = new Request('http://localhost:3000/api/races');
    
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).not.toBe(400);
    expect(data.error).not.toBe('BAD_INPUT');
  });
});