def register_user(client, email, full_name="Follow-Up Test User"):
    response = client.post(
        "/api/auth/register",
        json={
            "email": email,
            "full_name": full_name,
            "password": "StrongPassword123!",
        },
    )

    assert response.status_code == 201


def login_user(client, email):
    response = client.post(
        "/api/auth/login",
        json={
            "email": email,
            "password": "StrongPassword123!",
        },
    )

    assert response.status_code == 200

    return response.json()["access_token"]


def create_company(client, token, name="Test Company"):
    response = client.post(
        "/api/companies",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json={
            "name": name,
            "website": "https://example.com",
            "careers_url": "https://example.com/careers",
            "description": "A test company.",
        },
    )

    assert response.status_code == 201

    return response.json()["id"]


def create_application(client, token, company_id):
    response = client.post(
        "/api/applications",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json={
            "company_id": company_id,
            "role": "Software Engineering Intern",
            "job_url": "https://example.com/jobs/1",
            "location": "Remote",
            "employment_type": "Internship",
            "status": "applied",
            "applied_date": "2026-09-10",
            "deadline": "2026-09-30",
            "job_description": (
                "Software engineering internship involving Python, "
                "FastAPI, PostgreSQL, testing, and REST APIs."
            ),
            "notes": "Test application.",
        },
    )

    assert response.status_code == 201

    return response.json()["id"]


def setup_application(client, email="follow-up@example.com"):
    register_user(client, email)

    token = login_user(client, email)

    company_id = create_company(
        client,
        token,
        "Follow-Up Test Company",
    )

    application_id = create_application(
        client,
        token,
        company_id,
    )

    return token, application_id


def create_follow_up(client, token, application_id):
    response = client.post(
        "/api/follow-ups",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json={
            "application_id": application_id,
            "follow_up_date": "2026-09-20",
            "note": "Send a recruiter follow-up email.",
        },
    )

    assert response.status_code == 201

    return response.json()


def test_follow_up_requires_authentication(client):
    response = client.post(
        "/api/follow-ups",
        json={
            "application_id": 1,
            "follow_up_date": "2026-09-20",
            "note": "Follow up.",
        },
    )

    assert response.status_code == 401


def test_create_follow_up(client):
    token, application_id = setup_application(client)

    data = create_follow_up(
        client,
        token,
        application_id,
    )

    assert data["application_id"] == application_id
    assert data["follow_up_date"] == "2026-09-20"
    assert data["note"] == "Send a recruiter follow-up email."
    assert data["completed"] is False
    assert "id" in data
    assert "user_id" in data


def test_list_follow_ups(client):
    token, application_id = setup_application(
        client,
        "follow-up-list@example.com",
    )

    create_follow_up(
        client,
        token,
        application_id,
    )

    response = client.get(
        "/api/follow-ups",
        headers={
            "Authorization": f"Bearer {token}",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 1
    assert data[0]["application_id"] == application_id


def test_get_follow_up(client):
    token, application_id = setup_application(
        client,
        "follow-up-get@example.com",
    )

    created = create_follow_up(
        client,
        token,
        application_id,
    )

    response = client.get(
        f"/api/follow-ups/{created['id']}",
        headers={
            "Authorization": f"Bearer {token}",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == created["id"]
    assert data["application_id"] == application_id


def test_update_follow_up(client):
    token, application_id = setup_application(
        client,
        "follow-up-update@example.com",
    )

    created = create_follow_up(
        client,
        token,
        application_id,
    )

    response = client.patch(
        f"/api/follow-ups/{created['id']}",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json={
            "follow_up_date": "2026-09-25",
            "note": "Updated follow-up note.",
            "completed": True,
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["follow_up_date"] == "2026-09-25"
    assert data["note"] == "Updated follow-up note."
    assert data["completed"] is True


def test_delete_follow_up(client):
    token, application_id = setup_application(
        client,
        "follow-up-delete@example.com",
    )

    created = create_follow_up(
        client,
        token,
        application_id,
    )

    response = client.delete(
        f"/api/follow-ups/{created['id']}",
        headers={
            "Authorization": f"Bearer {token}",
        },
    )

    assert response.status_code == 204

    get_response = client.get(
        f"/api/follow-ups/{created['id']}",
        headers={
            "Authorization": f"Bearer {token}",
        },
    )

    assert get_response.status_code == 404


def test_follow_up_cannot_access_another_users_application(client):
    token_a, application_id = setup_application(
        client,
        "follow-up-owner@example.com",
    )

    created = create_follow_up(
        client,
        token_a,
        application_id,
    )

    register_user(
        client,
        "follow-up-attacker@example.com",
    )

    token_b = login_user(
        client,
        "follow-up-attacker@example.com",
    )

    get_response = client.get(
        f"/api/follow-ups/{created['id']}",
        headers={
            "Authorization": f"Bearer {token_b}",
        },
    )

    assert get_response.status_code == 403

    update_response = client.patch(
        f"/api/follow-ups/{created['id']}",
        headers={
            "Authorization": f"Bearer {token_b}",
        },
        json={
            "completed": True,
        },
    )

    assert update_response.status_code == 403

    delete_response = client.delete(
        f"/api/follow-ups/{created['id']}",
        headers={
            "Authorization": f"Bearer {token_b}",
        },
    )

    assert delete_response.status_code == 403


def test_follow_up_requires_existing_application(client):
    register_user(
        client,
        "follow-up-invalid-application@example.com",
    )

    token = login_user(
        client,
        "follow-up-invalid-application@example.com",
    )

    response = client.post(
        "/api/follow-ups",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json={
            "application_id": 99999,
            "follow_up_date": "2026-09-20",
            "note": "Follow up.",
        },
    )

    assert response.status_code in (400, 404)


def test_follow_up_rejects_long_note(client):
    token, application_id = setup_application(
        client,
        "follow-up-long-note@example.com",
    )

    response = client.post(
        "/api/follow-ups",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json={
            "application_id": application_id,
            "follow_up_date": "2026-09-20",
            "note": "x" * 2001,
        },
    )

    assert response.status_code == 422


