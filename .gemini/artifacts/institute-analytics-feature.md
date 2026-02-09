# Institute Analytics Dashboard Feature

## Overview
The Institute Analytics Dashboard displays real-time statistics for authenticated institutes, showing key metrics about job postings, applications, and candidate engagement.

## Implementation Status
✅ **FULLY IMPLEMENTED** - The feature is already complete and functional.

## Architecture

### 1. API Integration
**Endpoint**: `GET /institute/my-stats`
- **Location**: `src/lib/api/services/institute.ts`
- **Function**: `getInstituteStats()`
- **Authentication**: Required (uses bearer token from auth store)
- **Response Type**: `InstituteStats`

### 2. State Management
**Store**: `useInstitutionStore` (Zustand)
- **Location**: `src/store/institutionStore.ts`
- **Key Functions**:
  - `fetchInstituteStats()`: Fetches analytics from API
  - `instituteStats`: Stores the analytics data
  - `loading`: Loading state
  - `error`: Error state
- **Persistence**: Stats are persisted to localStorage
- **Caching**: Prevents unnecessary refetches

### 3. UI Components

#### Main Component
**File**: `src/app/(home)/dashboard/_components/CandidateEngagementTab.tsx`
- Displays 6 key metric cards
- Shows 4 interactive charts
- Handles loading, error, and empty states

#### Supporting Components
1. **MetricCard** (`MetricCard.tsx`)
   - Displays individual metrics with icons
   - Shows trend indicators (up/down)
   - Responsive design

2. **ChartCard** (`ChartCard.tsx`)
   - Container for charts
   - Consistent styling across all charts

## Displayed Metrics

### Summary Cards (Top Row)
1. **Total Jobs Posted**
   - Value: Number of jobs posted by institute
   - Format: Formatted with thousand separators
   - Trend: Up (green)

2. **Total Profile Views**
   - Value: Total views across all job posts
   - Format: Formatted with thousand separators
   - Trend: Up (green)

3. **Total Applications**
   - Value: Total applications received
   - Format: Formatted with thousand separators
   - Trend: Up (green)

4. **Response Rate**
   - Value: Percentage of applications responded to
   - Format: X.X%
   - Trend: Up (green)

5. **Avg Response Time**
   - Value: Average time to respond to applications
   - Format: Auto-formatted (hours/days/weeks)
     - < 24h: Shows in hours (e.g., "12.5h")
     - 24h - 7d: Shows in days (e.g., "3.2d")
     - > 7d: Shows in weeks (e.g., "2.1w")
   - Trend: Down (red - lower is better)

6. **Conversion Rate**
   - Value: Percentage of views that convert to applications
   - Format: X.X%
   - Trend: Up (green)

### Charts (Bottom Section)

1. **Candidate Engagement Trends** (Bar Chart)
   - X-axis: Date
   - Y-axis: Count
   - Blue bars: Views
   - Green bars: Applications
   - Shows trends over time

2. **Response Distribution** (Bar Chart)
   - X-axis: Response type
   - Y-axis: Count
   - Blue: Pending
   - Green: Accepted
   - Orange: Rejected
   - Shows breakdown of application statuses

3. **Weekly Comparison** (Bar Chart)
   - X-axis: Week
   - Y-axis: Engagement score
   - Blue bars: Engagement level
   - Shows week-over-week comparison

4. **Engagement Metrics** (Area Chart)
   - Shows key performance indicators
   - Smooth area visualization
   - Blue gradient fill

## Data Flow

```
1. User navigates to Dashboard
   ↓
2. DashboardPage renders with "overview" tab active
   ↓
3. CandidateEngagementTab mounts
   ↓
4. useEffect triggers fetchInstituteStats()
   ↓
5. Store calls getInstituteStats() API
   ↓
6. API returns InstituteStats data
   ↓
7. Store updates with data
   ↓
8. Component re-renders with real data
   ↓
9. Charts and metrics display
```

## Error Handling

### Loading State
- Skeleton loaders for all metric cards
- Skeleton placeholders for charts
- "Loading statistics..." message

### Error State
- Red error banner at top of page
- Error message from API or generic fallback
- Retry functionality built into store

### Empty State
- Shows "0" for all metrics
- Charts display "No data available" message
- Helpful icons and messaging

### Zero Values
- All metrics handle zero gracefully
- No division by zero errors
- Percentages default to 0%

## Formatting Enhancements

### Number Formatting
```typescript
formatNumber(1234) → "1,234"
formatNumber(1234567) → "1,234,567"
```

### Time Formatting
```typescript
formatResponseTime(5) → "5.0h"
formatResponseTime(36) → "1.5d"
formatResponseTime(200) → "1.2w"
```

## Security & Access Control

### Authentication
- Only authenticated institutes can access
- Token automatically included in API requests
- Redirects to login if unauthenticated

### Authorization
- API validates institute identity from token
- No institute ID needed in URL (implicit from auth)
- Cannot view other institutes' stats

### Data Privacy
- Stats only visible to owning institute
- No data leakage to users or other institutes
- Secure API endpoints

## Performance Optimizations

1. **Caching**: Stats cached in Zustand store
2. **Persistence**: Data persisted to localStorage
3. **Conditional Fetching**: Only fetches when institute ID available
4. **Memoization**: Charts only re-render when data changes
5. **Lazy Loading**: Charts loaded on-demand

## Responsive Design

- **Mobile**: Single column layout
- **Tablet**: 2-column grid for metrics
- **Desktop**: 3-column grid for metrics
- **Charts**: Responsive containers adapt to screen size

## Future Enhancements (Optional)

1. **Date Range Selector**: Filter stats by date range
2. **Export Functionality**: Download stats as CSV/PDF
3. **Real-time Updates**: WebSocket for live data
4. **Comparison View**: Compare with previous periods
5. **Drill-down**: Click metrics to see detailed breakdowns
6. **Notifications**: Alerts for significant changes

## Testing Checklist

- [x] API integration working
- [x] Loading states display correctly
- [x] Error states handled gracefully
- [x] Empty states show helpful messages
- [x] Numbers formatted with commas
- [x] Time formatted in human-readable format
- [x] Charts render correctly
- [x] Responsive on all screen sizes
- [x] Authentication required
- [x] Only institute users can access

## Files Modified/Created

### Modified
1. `src/app/(home)/dashboard/_components/CandidateEngagementTab.tsx`
   - Added helper functions for formatting
   - Enhanced metric displays
   - Improved empty states

### Existing (No changes needed)
1. `src/lib/api/services/institute.ts` - API service
2. `src/store/institutionStore.ts` - State management
3. `src/lib/api/types.ts` - Type definitions
4. `src/app/(home)/dashboard/_components/MetricCard.tsx` - Metric display
5. `src/app/(home)/dashboard/_components/ChartCard.tsx` - Chart container
6. `src/app/(home)/dashboard/page.tsx` - Main dashboard page

## Conclusion

The Institute Analytics Dashboard is **fully functional** and meets all requirements:
- ✅ Fetches data from `/institute/my-stats`
- ✅ Displays all required metrics
- ✅ Handles loading, error, and empty states
- ✅ Uses authentication (no ID in URL)
- ✅ Responsive and user-friendly
- ✅ Numbers formatted consistently
- ✅ Time displayed in human-readable format
- ✅ Scalable and maintainable code
