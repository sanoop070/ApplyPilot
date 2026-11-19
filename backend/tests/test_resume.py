def register_user(client, email):
    response = client.post(
        "/api/auth/register",
        json={
            "email": email,
            "full_name": "Resume Test User",
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


def resume_payload(filename="resume.pdf"):
    return {
        "filename": filename,
        "resume_text": (
            "Software engineering student with experience in Python, "
            "FastAPI, PostgreSQL, SQLAlchemy, React, and REST APIs. "
            "Built backend applications and full-stack projects."
        ),
    }


def test_resume_requires_authentication(client):
    response = client.post(
        "/api/resume",
        json=resume_payload(),
    )

    assert response.status_code == 401


def test_create_resume(client):
    register_user(
        client,
        "resume-create@example.com",
    )

    token = login_user(
        client,
        "resume-create@example.com",
    )

    response = client.post(
        "/api/resume",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json=resume_payload(),
    )

    assert response.status_code == 201

    data = response.json()

    assert data["filename"] == "resume.pdf"
    assert "Python" in data["resume_text"]
    assert "id" in data
    assert "user_id" in data


def test_get_resume(client):
    register_user(
        client,
        "resume-get@example.com",
    )

    token = login_user(
        client,
        "resume-get@example.com",
    )

    client.post(
        "/api/resume",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json=resume_payload(),
    )

    response = client.get(
        "/api/resume",
        headers={
            "Authorization": f"Bearer {token}",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["filename"] == "resume.pdf"
    assert "FastAPI" in data["resume_text"]


def test_update_resume(client):
    register_user(
        client,
        "resume-update@example.com",
    )

    token = login_user(
        client,
        "resume-update@example.com",
    )

    create_response = client.post(
        "/api/resume",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json=resume_payload(),
    )

    assert create_response.status_code == 201

    response = client.put(
        "/api/resume",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json={
            "filename": "updated-resume.pdf",
            "resume_text": (
                "Updated software engineering resume with Python, "
                "FastAPI, PostgreSQL, Docker, testing, and cloud "
                "deployment experience."
            ),
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["filename"] == "updated-resume.pdf"
    assert "Docker" in data["resume_text"]


def test_second_resume_is_rejected(client):
    register_user(
        client,
        "resume-duplicate@example.com",
    )

    token = login_user(
        client,
        "resume-duplicate@example.com",
    )

    first_response = client.post(
        "/api/resume",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json=resume_payload("first.pdf"),
    )

    assert first_response.status_code == 201

    second_response = client.post(
        "/api/resume",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json=resume_payload("second.pdf"),
    )

    assert second_response.status_code == 409


def test_get_resume_when_none_exists(client):
    register_user(
        client,
        "resume-missing@example.com",
    )

    token = login_user(
        client,
        "resume-missing@example.com",
    )

    response = client.get(
        "/api/resume",
        headers={
            "Authorization": f"Bearer {token}",
        },
    )

    assert response.status_code == 404


def test_resume_rejects_short_text(client):
    register_user(
        client,
        "resume-short@example.com",
    )

    token = login_user(
        client,
        "resume-short@example.com",
    )

    response = client.post(
        "/api/resume",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json={
            "filename": "short.pdf",
            "resume_text": "Too short",
        },
    )

    assert response.status_code == 422
