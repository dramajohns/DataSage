# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**DataSage** - An AI-powered data quality assistant that uses Claude API to provide intelligent data analysis, SQL query generation, and debugging assistance.

**Current Phase: Phases 1 & 2 COMPLETE ✅**

Both the FastAPI backend and React frontend are fully functional. The system provides a complete full-stack experience: users upload CSV/Excel files through a modern web UI and receive AI-powered data quality insights from Claude Sonnet 4.5.

**Tech Stack (Implemented):**
- **Backend:** FastAPI + Pandas + Pydantic
- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS v3
- **AI:** Claude API (Anthropic) - Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)
- **Data Processing:** Pandas, NumPy, OpenPyXL

**Tech Stack (Planned - Not Yet Implemented):**
- Database: PostgreSQL + SQLAlchemy + Alembic migrations
- DevOps: Docker + Docker Compose + GitHub Actions
- Deployment: AWS Free Tier / Railway / Render
- Testing: Pytest test suite, React Testing Library

## Project Structure (Current)

```
DataSage/
├── backend/              # FastAPI application (PHASE 1 - COMPLETE ✅)
│   ├── app/
│   │   ├── api/         # API endpoints
│   │   │   ├── health.py       # Health check endpoint
│   │   │   └── analysis.py     # Data analysis endpoints
│   │   ├── core/        # Configuration
│   │   │   └── config.py       # App settings and environment config
│   │   ├── schemas/     # Pydantic schemas
│   │   │   └── analysis.py     # Data profile response models
│   │   ├── services/    # Business logic
│   │   │   ├── claude_service.py       # Real Claude API integration
│   │   │   ├── mock_claude_service.py  # Mock service for testing
│   │   │   └── data_profiler.py        # Pandas data profiling
│   │   └── main.py      # FastAPI app entry point
│   ├── alembic/         # Database migrations (EMPTY - Phase 3)
│   ├── tests/           # Backend tests (EMPTY - Phase 3)
│   ├── requirements.txt # Python dependencies
│   └── .env             # Environment variables (API keys, etc.)
├── frontend/            # React application (PHASE 2 - COMPLETE ✅)
│   ├── src/
│   │   ├── components/  # React components
│   │   │   ├── FileUpload.tsx   # Drag-and-drop file upload UI
│   │   │   ├── DataProfile.tsx  # Data statistics display
│   │   │   └── AIInsights.tsx   # AI analysis results display
│   │   ├── services/    # API integration layer
│   │   │   └── api.ts           # Backend API calls
│   │   ├── types/       # TypeScript type definitions
│   │   │   └── analysis.ts      # Data models (matches backend)
│   │   ├── App.tsx      # Main application component
│   │   ├── main.tsx     # React entry point
│   │   └── index.css    # Tailwind CSS imports
│   ├── package.json     # Node.js dependencies
│   ├── vite.config.ts   # Vite configuration
│   ├── tailwind.config.js  # Tailwind CSS config
│   ├── tsconfig.json    # TypeScript configuration
│   └── .env             # Frontend environment variables
├── aboutme/             # Personal information files (CV, etc.)
├── .claude/             # Claude Code configuration
├── CLAUDE.md            # This file - Claude Code guidance
├── PROJECT_DOCUMENTATION.md  # Detailed project documentation
├── LEARNING_JOURNAL.md       # Development learning notes
├── README.md            # Project README
└── test_data.csv        # Sample CSV file for testing
```

**Note:** Database models, Docker setup, and comprehensive tests are planned for future phases.

## Development Commands

### Backend Development (Working Commands)
```bash
# Setup (one-time)
cd /mnt/c/Users/fedib/projects/project_1/backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure environment
# Copy .env.example to .env and add your ANTHROPIC_API_KEY
cp .env.example .env
# Edit .env and set: ANTHROPIC_API_KEY=sk-ant-xxx

# Run development server
cd /mnt/c/Users/fedib/projects/project_1/backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Access API documentation
# Open browser to: http://localhost:8000/docs (Swagger UI)
# Or: http://localhost:8000/redoc (ReDoc)

# Test with curl
curl http://localhost:8000/health
curl -X POST http://localhost:8000/api/v1/analysis/analyze \
  -F "file=@test_data.csv"
```

### Frontend Development (Working Commands)
```bash
# Setup (one-time)
cd /mnt/c/Users/fedib/projects/DataSage/frontend
npm install

# Configure environment (optional - already set for localhost)
echo "VITE_API_URL=http://localhost:8000" > .env

# Run development server (with hot reload)
npm run dev

# Access frontend
# Open browser to: http://localhost:5173/

# Build for production
npm run build

# Preview production build
npm run preview
```

### Full-Stack Development (Both Servers)
Run these in **two separate terminals**:

**Terminal 1 - Backend:**
```bash
cd /mnt/c/Users/fedib/projects/DataSage/backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd /mnt/c/Users/fedib/projects/DataSage/frontend
npm run dev
```

Then open http://localhost:5173/ for the full application!

### Commands NOT Yet Available
The following commands are planned for future phases but do not work yet:

```bash
# Tests - NOT IMPLEMENTED (tests/ directory is empty)
pytest tests/ -v

# Database migrations - NOT IMPLEMENTED (no DB models yet)
alembic upgrade head
alembic revision --autogenerate -m "description"

# Docker - NOT IMPLEMENTED (no docker-compose.yml yet)
docker-compose up -d
```

## Architecture Notes

### Claude API Integration Pattern (IMPLEMENTED)
- **Location**: `backend/app/services/claude_service.py`
- **Model**: Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`) - Latest, smartest model
- **Pattern**: Service layer abstracts Claude API calls with error handling
- **Prompt Engineering**: Prompts are embedded directly in service methods (inline)
- **Response Parsing**: Includes markdown code block parser to handle ```json``` wrapped responses
- **Mock Service**: `mock_claude_service.py` provides realistic responses for testing without API key

### Frontend Architecture (IMPLEMENTED)
- **Framework**: React 19 with modern hooks (useState, useCallback)
- **Language**: TypeScript for type safety
- **Build Tool**: Vite (fast HMR, optimized builds)
- **Styling**: Tailwind CSS v3 (utility-first, responsive design)
- **State Management**: Component-level useState (no Redux needed yet)
- **Component Structure**:
  - `App.tsx` - Main container with state management
  - `FileUpload.tsx` - Drag-and-drop file upload with validation
  - `DataProfile.tsx` - Data statistics visualization with tables
  - `AIInsights.tsx` - AI analysis results display
- **API Layer**: `services/api.ts` - Centralized backend communication
- **Type Safety**: `types/analysis.ts` - TypeScript interfaces matching backend Pydantic schemas
- **Error Handling**: Comprehensive error states with user-friendly messages
- **Loading States**: Visual feedback during API calls

### Full-Stack Data Analysis Flow (CURRENT IMPLEMENTATION)
**Frontend → Backend → AI → Frontend:**

1. **User uploads file** → React FileUpload component (drag-and-drop or click)
2. **Client-side validation** → File type and size checked before upload
3. **API request** → frontend/src/services/api.ts sends file to backend
4. **FastAPI receives** → backend endpoint validates and processes
5. **Pandas profiling** → DataFrame created, statistics generated
6. **Claude AI analysis** → Profile sent to Claude Sonnet 4.5 with structured prompt
7. **AI response** → Claude returns JSON (insights, quality_score, recommendations)
8. **Response parsing** → Markdown code blocks handled, JSON extracted
9. **Return to frontend** → DataProfileResponse sent back
10. **UI update** → React components display results:
    - DataProfile shows statistics tables
    - AIInsights shows AI analysis and recommendations
11. **Note**: No database storage yet - responses are not persisted

### Security (CURRENT IMPLEMENTATION)
- API keys stored in environment variables via python-dotenv (never committed)
- File upload validation (allowed types: csv, xlsx, xls)
- File size limits enforced (configurable via settings.MAX_FILE_SIZE_MB)
- CORS configured for local development

### Security (NOT YET IMPLEMENTED)
- JWT authentication
- User management
- Rate limiting
- Database storage of analysis results

### Database Schema (NOT YET IMPLEMENTED)
The SQLAlchemy and Alembic dependencies are installed but no models exist yet. Planned schema:
- **users**: Authentication and user management
- **analyses**: Stored analysis results with metadata
- **queries**: SQL query history for learning/improvement

## Environment Variables

### Backend Environment (backend/.env)
```bash
# Required
ANTHROPIC_API_KEY=sk-ant-xxx  # Get from https://console.anthropic.com/

# Optional (have defaults in config.py)
ENVIRONMENT=development
MAX_FILE_SIZE_MB=10
ALLOWED_FILE_TYPES=csv,xlsx,xls
```

### Frontend Environment (frontend/.env)
```bash
# API URL for backend communication
VITE_API_URL=http://localhost:8000
```
**Note**: Frontend .env is optional - defaults to localhost:8000 if not specified.

### Planned (Not Yet Used)
```bash
# Database (PostgreSQL not integrated yet)
DATABASE_URL=postgresql://user:pass@localhost:5432/datasage

# Authentication (not implemented yet)
JWT_SECRET_KEY=random-secret-key
```

## Key Design Decisions

### Implemented
**Backend:**
1. **FastAPI over Flask/Django**: Type safety, automatic API docs, async support
2. **Pydantic schemas**: Validate all input/output for type safety
3. **Service layer pattern**: Business logic separated from routes (testability and maintainability)
4. **Claude Sonnet 4.5**: Using the latest, smartest Claude model for best analysis quality
5. **Inline prompts**: Prompts embedded in service methods for simplicity (can refactor later)
6. **Mock service pattern**: Allows testing without consuming API credits

**Frontend:**
7. **React 19 + TypeScript**: Type safety reduces bugs, modern hooks, best practices
8. **Vite over Create React App**: 10x faster builds, instant HMR, modern tooling
9. **Tailwind CSS over custom CSS**: Utility-first approach, faster development, consistent design
10. **Component-level state**: useState instead of Redux (simpler for current scale)
11. **Type-safe API layer**: TypeScript interfaces match Pydantic schemas exactly
12. **User validation implementation**: Client-side validation with your custom code (learn-by-doing approach)

### Planned (Future)
1. **Docker Compose**: Consistent dev environment across machines
2. **PostgreSQL**: Persistent storage for analysis results and user data
3. **Prompt templates**: Move prompts to separate files for maintainability
4. **Advanced charts**: Data visualization with Recharts
5. **Testing**: Pytest (backend) + React Testing Library (frontend)

## Common Workflows

### Testing the Full-Stack Application (Recommended)
1. **Start backend** (Terminal 1):
   ```bash
   cd /mnt/c/Users/fedib/projects/DataSage/backend
   source venv/bin/activate
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Start frontend** (Terminal 2):
   ```bash
   cd /mnt/c/Users/fedib/projects/DataSage/frontend
   npm run dev
   ```

3. **Access the application**:
   - Open browser: http://localhost:5173/
   - Upload a CSV/Excel file using drag-and-drop or click
   - View AI-generated insights, quality score, and recommendations
   - See data profile with interactive tables

### Testing Backend Only (API)
1. Ensure virtual environment is activated
2. Start the server: `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
3. Open Swagger docs: http://localhost:8000/docs
4. Upload a CSV/Excel file via the `/api/v1/analysis/analyze` endpoint
5. View the AI-generated insights in the response

### Switching Between Real and Mock Claude Service
In `backend/app/api/analysis.py`, line 20-21:
```python
# Use real Claude API (requires ANTHROPIC_API_KEY in .env)
claude_service = ClaudeService()

# Or use mock service for testing (no API key needed)
# claude_service = MockClaudeService()
```
Comment/uncomment to switch between them.

### Adding a New Claude-Powered Feature (When Ready)
1. Add service method in `claude_service.py` with prompt
2. Create Pydantic schemas for input/output in `backend/app/schemas/`
3. Add API endpoint in `backend/app/api/`
4. Test via Swagger UI at `/docs`

### Database Schema Changes (When Database is Implemented)
These steps are for future reference:
1. Create SQLAlchemy models in `backend/app/models/` (directory needs to be created)
2. Generate migration: `alembic revision --autogenerate -m "description"`
3. Review migration in `alembic/versions/`
4. Apply: `alembic upgrade head`

## Important Technical Notes

### Markdown Code Block Parsing
Claude sometimes wraps JSON responses in markdown code blocks even when instructed not to. The `claude_service.py` includes a parser (lines 71-85) that handles this:
```python
# Removes ```json ... ``` or ``` ... ``` wrappers from Claude's response
```
This ensures reliable JSON parsing even when Claude doesn't follow instructions perfectly.

### API Endpoints Currently Available
- `GET /` - Root endpoint with API info
- `GET /health` - Health check endpoint
- `GET /docs` - Swagger UI documentation
- `GET /redoc` - ReDoc documentation
- `POST /api/v1/analysis/analyze` - Upload and analyze data file

### Unimplemented Methods
The `claude_service.py` has placeholder methods for future features:
- `generate_sql_query()` - Raises NotImplementedError
- `debug_error()` - Raises NotImplementedError

These will be implemented in Phase 2.
