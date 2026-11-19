def test_register_user(client):
    response = client.post(
        "/api/auth/register",
        json={
            "email": "auth-test@example.com",
            "full_name": "Auth Test",
            "password": "StrongPassword123!",
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert data["email"] == "auth-test@example.com"
    assert data["full_name"] == "Auth Test"
    assert "id" in data
    assert "created_at" in data


def test_duplicate_email_is_rejected(client):
    payload = {
        "email": "duplicate@example.com",
        "full_name": "Duplicate Test",
        "password": "StrongPassword123!",
    }

    first_response = client.post(
        "/api/auth/register",
        json=payload,
    )

    assert first_response.status_code == 201

    second_response = client.post(
        "/api/auth/register",
        json=payload,
    )

    assert second_response.status_code == 409


def test_login_success(client):
    client.post(
        "/api/auth/register",
        json={
            "email": "login@example.com",
            "full_name": "Login Test",
            "password": "StrongPassword123!",
        },
    )

    response = client.post(
        "/api/auth/login",
        json={
            "email": "login@example.com",
            "password": "StrongPassword123!",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client):
    client.post(
        "/api/auth/register",
        json={
            "email": "wrong-password@example.com",
            "full_name": "Wrong Password",
            "password": "StrongPassword123!",
        },
    )

    response = client.post(
        "/api/auth/login",
        json={
            "email": "wrong-password@example.com",
            "password": "WrongPassword123!",
        },
    )

    assert response.status_code == 401


def test_me_requires_authentication(client):
    response = client.get("/api/auth/me")

    assert response.status_code == 401


def test_me_with_valid_token(client):
    client.post(
        "/api/auth/register",
        json={
            "email": "me@example.com",
            "full_name": "Me Test",
            "password": "StrongPassword123!",
        },
    )

    login_response = client.post(
        "/api/auth/login",
        json={
            "email": "me@example.com",
            "password": "StrongPassword123!",
        },
    )

    token = login_response.json()["access_token"]

    response = client.get(
        "/api/auth/me",
        headers={
            "Authorization": f"Bearer {token}",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["email"] == "me@example.com"
    assert data["full_name"] == "Me Test"
