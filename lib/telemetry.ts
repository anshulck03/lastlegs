export const logEvent = (name: string, props?: Record<string, any>) => {
  if (process.env.NODE_ENV !== 'production') {
    const timestamp = new Date().toISOString();
    console.log(`[telemetry:${timestamp}] ${name}`, props ?? {});
  }
};

// Convenience functions for common events
export const logPlanGenerated = (props: { distance: string; weeksToRace: number; fitnessLevel: string }) => {
  logEvent('plan_generated', props);
};

export const logAiOverviewSuccess = (props: { tokenCount?: number; duration?: number }) => {
  logEvent('ai_overview_ok', props);
};

export const logAiOverviewError = (props: { error: string; duration?: number }) => {
  logEvent('ai_overview_err', props);
};

export const logAiWeekSuccess = (props: { weekIndex: number; tokenCount?: number; duration?: number }) => {
  logEvent('ai_week_ok', props);
};

export const logAiWeekError = (props: { weekIndex: number; error: string; duration?: number }) => {
  logEvent('ai_week_err', props);
};

export const logApiCall = (endpoint: string, method: string, duration?: number, status?: number) => {
  logEvent('api_call', { endpoint, method, duration, status });
};