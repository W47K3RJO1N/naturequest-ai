import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.db.session import Base, get_db
from app.services.ai_service import ai_service
from app.schemas.schemas import QuestGenerateRequest, QuestStructuredOutput
from app.services.gamification import calculate_level_from_xp

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="module", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def client():
    return TestClient(app)

def test_health_check(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"

def test_ai_health_check(client):
    res = client.get("/api/health/ai")
    assert res.status_code == 200
    assert "status" in res.json()

def test_ai_fallback_quest_generation():
    req = QuestGenerateRequest(
        duration_minutes=15,
        difficulty="Easy",
        activity_category="Plant Observation",
        environment="Park"
    )
    quest, source = ai_service.generate_quest(req)
    assert isinstance(quest, QuestStructuredOutput)
    assert quest.duration_minutes == 15
    assert len(quest.tasks) >= 1
    assert quest.xp_reward >= 30

def test_level_calculation_formula():
    assert calculate_level_from_xp(0) == 1
    assert calculate_level_from_xp(99) == 1
    assert calculate_level_from_xp(100) == 2
    assert calculate_level_from_xp(300) == 3

def test_guest_dashboard_access(client):
    res = client.get("/api/dashboard")
    assert res.status_code == 200
    data = res.json()
    assert "user" in data
    assert "weekly_activity" in data
    assert len(data["weekly_activity"]) == 7

def test_quest_flow_and_duplicate_prevention(client):
    # 1. Generate quest
    res = client.post("/api/quests/generate", json={
        "duration_minutes": 10,
        "difficulty": "Easy",
        "activity_category": "Walking",
        "environment": "Neighborhood"
    })
    assert res.status_code == 200
    quest_data = res.json()
    quest_id = quest_data["id"]
    
    # 2. Start quest
    res = client.post(f"/api/quests/{quest_id}/start")
    assert res.status_code == 200
    assert res.json()["status"] == "active"
    
    # 3. Complete quest
    res = client.post(f"/api/quests/{quest_id}/complete", json={
        "user_notes": "Enjoyed noticing bird species around the block.",
        "reflection": "Felt grounded and alert afterwards."
    })
    assert res.status_code == 200
    comp_data = res.json()
    assert comp_data["xp_earned"] == quest_data["xp_reward"]
    
    # 4. Attempt duplicate completion -> Should be rejected with 400
    res_dup = client.post(f"/api/quests/{quest_id}/complete", json={})
    assert res_dup.status_code == 400
    assert "already been claimed" in res_dup.json()["detail"]

def test_journal_crud_flow(client):
    # Create discovery
    res = client.post("/api/discoveries", json={
        "title": "Ancient Oak Specimen",
        "common_name": "White Oak",
        "scientific_name": "Quercus alba",
        "category": "Tree",
        "notes": "Majestic canopy covering the central clearing.",
        "confidence": 0.95,
        "is_verified_by_ai": True
    })
    assert res.status_code == 200
    disc = res.json()
    disc_id = disc["id"]
    assert disc["common_name"] == "White Oak"
    
    # Update discovery
    res_patch = client.patch(f"/api/discoveries/{disc_id}", json={
        "notes": "Updated note: observed two squirrels foraging here."
    })
    assert res_patch.status_code == 200
    assert "squirrels" in res_patch.json()["notes"]
    
    # Delete discovery
    res_del = client.delete(f"/api/discoveries/{disc_id}")
    assert res_del.status_code == 200
