# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**DataSage** - An AI-powered data quality assistant that uses Claude API to provide intelligent data analysis, SQL query generation, and debugging assistance.

**Current Phase: Phase 1 (Backend) - COMPLETE**

The FastAPI backend is fully functional with real Claude Sonnet 4.5 integration. The system can analyze CSV/Excel files and provide AI-powered data quality insights.

**Tech Stack (Implemented):**
- Backend: FastAPI + Pandas
- AI: Claude API (Anthropic) - Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)
- Data Processing: Pandas, NumPy, OpenPyXL

**Tech Stack (Planned - Not Yet Implemented):**
- Frontend: React + TypeScript + Vite + Tailwind CSS
- Database: PostgreSQL + SQLAlchemy + Alembic migrations
- DevOps: Docker + Docker Compose + GitHub Actions
- Deployment: AWS Free Tier / Railway / Render
- Testing: Pytest test suite

## Project Structure (Current)

```
project_1/
├── backend/              # FastAPI application (IMPLEMENTED)
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
│   ├── alembic/         # Database migrations (EMPTY - not implemented yet)
│   ├── tests/           # Backend tests (EMPTY - not implemented yet)
│   ├── requirements.txt # Python dependencies
│   └── .env             # Environment variables (API keys, etc.)
├── aboutme/             # Personal information files
├── .claude/             # Claude Code configuration
├── CLAUDE.md            # This file - Claude Code guidance
├── PROJECT_DOCUMENTATION.md  # Detailed project documentation
├── LEARNING_JOURNAL.md       # Development learning notes
└── test_data.csv        # Sample CSV file for testing
```

**Note:** Frontend, database models, Docker setup, and tests directories exist in requirements.txt but are not yet implemented.

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

### Commands NOT Yet Available
The following commands are planned for future phases but do not work yet:

```bash
# Tests - NOT IMPLEMENTED (tests/ directory is empty)
pytest tests/ -v

# Database migrations - NOT IMPLEMENTED (no DB models yet)
alembic upgrade head
alembic revision --autogenerate -m "description"

# Frontend - NOT IMPLEMENTED (frontend/ directory doesn't exist)
cd frontend
npm install
npm run dev

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

### Data Analysis Flow (CURRENT IMPLEMENTATION)
1. File upload → FastAPI endpoint receives CSV/Excel file
2. File validation (type, size limits)
3. Pandas DataFrame created via DataProfiler
4. Profile data generated (row count, column count, null percentages, data types)
5. Profile sent to Claude with structured prompt asking for JSON response
6. Claude returns JSON with: insights, quality_score, recommendations
7. Response parsed (with markdown code block handling)
8. Results returned to client as DataProfileResponse
9. **Note**: No database storage yet - responses are not persisted

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

### Required (Current Implementation)
```bash
# backend/.env
ANTHROPIC_API_KEY=sk-ant-xxx  # Get from https://console.anthropic.com/

# Optional (have defaults in config.py)
ENVIRONMENT=development
MAX_FILE_SIZE_MB=10
ALLOWED_FILE_TYPES=csv,xlsx,xls
```

### Planned (Not Yet Used)
```bash
# Database (PostgreSQL not integrated yet)
DATABASE_URL=postgresql://user:pass@localhost:5432/datasage

# Authentication (not implemented yet)
JWT_SECRET_KEY=random-secret-key

# Frontend (doesn't exist yet)
VITE_API_URL=http://localhost:8000
```

## Key Design Decisions

### Implemented
1. **FastAPI over Flask/Django**: Type safety, automatic API docs, async support
2. **Pydantic schemas**: Validate all input/output for type safety
3. **Service layer pattern**: Business logic separated from routes (testability and maintainability)
4. **Claude Sonnet 4.5**: Using the latest, smartest Claude model for best analysis quality
5. **Inline prompts**: Prompts embedded in service methods for simplicity (can refactor later)
6. **Mock service pattern**: Allows testing without consuming API credits

### Planned (Future)
1. **Docker Compose**: Consistent dev environment across machines
2. **TypeScript frontend**: Type safety reduces bugs in production
3. **PostgreSQL**: Persistent storage for analysis results and user data
4. **Prompt templates**: Move prompts to separate files for maintainability

## Common Workflows

### Testing the Current Backend
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
