def register_user(client, email):
    response = client.post(
        "/api/auth/register",
        json={
            "email": email,
            "full_name": "Application Test User",
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
            "industry": "Technology",
            "location": "Remote",
        },
    )

    assert response.status_code == 201

    return response.json()["id"]


def application_payload(company_id):
    return {
        "company_id": company_id,
        "role": "Software Engineering Intern",
        "job_url": "https://example.com/jobs/software-intern",
        "location": "Remote",
        "employment_type": "Internship",
        "salary": "$30/hour",
        "status": "saved",
        "applied_date": None,
        "deadline": "2026-10-01",
        "recruiter_name": "Test Recruiter",
        "recruiter_email": "recruiter@example.com",
        "job_description": (
            "Build software features, write Python code, "
            "work with APIs, and collaborate with engineers."
        ),
        "notes": "Application test.",
    }


def test_create_application_requires_authentication(client):
    response = client.post(
        "/api/applications",
        json={
            "company_id": 1,
            "role": "Software Engineering Intern",
        },
    )

    assert response.status_code == 401


def test_create_application(client):
    register_user(
        client,
        "application-create@example.com",
    )

    token = login_user(
        client,
        "application-create@example.com",
    )

    company_id = create_company(
        client,
        token,
    )

    response = client.post(
        "/api/applications",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json=application_payload(company_id),
    )

    assert response.status_code == 201

    data = response.json()

    assert data["company_id"] == company_id
    assert data["role"] == "Software Engineering Intern"
    assert data["status"] == "saved"
    assert data["ai_summary"] is None
    assert data["ai_fit_score"] is None
    assert "id" in data
    assert "user_id" in data


def test_get_applications(client):
    register_user(
        client,
        "application-list@example.com",
    )

    token = login_user(
        client,
        "application-list@example.com",
    )

    company_id = create_company(
        client,
        token,
    )

    client.post(
        "/api/applications",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json=application_payload(company_id),
    )

    response = client.get(
        "/api/applications",
        headers={
            "Authorization": f"Bearer {token}",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 1
    assert data[0]["role"] == "Software Engineering Intern"


def test_get_single_application(client):
    register_user(
        client,
        "application-single@example.com",
    )

    token = login_user(
        client,
        "application-single@example.com",
    )

    company_id = create_company(
        client,
        token,
    )

    create_response = client.post(
        "/api/applications",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json=application_payload(company_id),
    )

    application_id = create_response.json()["id"]

    response = client.get(
        f"/api/applications/{application_id}",
        headers={
            "Authorization": f"Bearer {token}",
        },
    )

    assert response.status_code == 200
    assert response.json()["id"] == application_id


def test_update_application(client):
    register_user(
        client,
        "application-update@example.com",
    )

    token = login_user(
        client,
        "application-update@example.com",
    )

    company_id = create_company(
        client,
        token,
    )

    create_response = client.post(
        "/api/applications",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json=application_payload(company_id),
    )

    application_id = create_response.json()["id"]

    response = client.patch(
        f"/api/applications/{application_id}",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json={
            "role": "Backend Engineering Intern",
            "location": "Bengaluru",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["role"] == "Backend Engineering Intern"
    assert data["location"] == "Bengaluru"


def test_update_application_status(client):
    register_user(
        client,
        "application-status@example.com",
    )

    token = login_user(
        client,
        "application-status@example.com",
    )

    company_id = create_company(
        client,
        token,
    )

    create_response = client.post(
        "/api/applications",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json=application_payload(company_id),
    )

    application_id = create_response.json()["id"]

    response = client.patch(
        f"/api/applications/{application_id}/status",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json={
            "status": "interview",
        },
    )

    assert response.status_code == 200
    assert response.json()["status"] == "interview"


def test_user_cannot_access_another_users_application(client):
    register_user(
        client,
        "owner@example.com",
    )

    owner_token = login_user(
        client,
        "owner@example.com",
    )

    company_id = create_company(
        client,
        owner_token,
        "Owner Company",
    )

    create_response = client.post(
        "/api/applications",
        headers={
            "Authorization": f"Bearer {owner_token}",
        },
        json=application_payload(company_id),
    )

    application_id = create_response.json()["id"]

    register_user(
        client,
        "attacker@example.com",
    )

    attacker_token = login_user(
        client,
        "attacker@example.com",
    )

    response = client.get(
        f"/api/applications/{application_id}",
        headers={
            "Authorization": f"Bearer {attacker_token}",
        },
    )

    assert response.status_code == 403
