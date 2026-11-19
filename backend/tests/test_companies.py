def register_user(client, email):
    response = client.post(
        "/api/auth/register",
        json={
            "email": email,
            "full_name": "Company Test User",
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


def company_payload(name="Test Company"):
    return {
        "name": name,
        "website": "https://example.com",
        "careers_url": "https://example.com/careers",
        "description": "A technology company for testing.",
    }


def test_create_company_requires_authentication(client):
    response = client.post(
        "/api/companies",
        json=company_payload(),
    )

    assert response.status_code == 401


def test_create_company(client):
    register_user(
        client,
        "company-create@example.com",
    )

    token = login_user(
        client,
        "company-create@example.com",
    )

    response = client.post(
        "/api/companies",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json=company_payload(),
    )

    assert response.status_code == 201

    data = response.json()

    assert data["name"] == "Test Company"
    assert data["website"] == "https://example.com"
    assert data["careers_url"] == "https://example.com/careers"
    assert data["description"] == "A technology company for testing."
    assert "id" in data


def test_get_companies(client):
    register_user(
        client,
        "company-list@example.com",
    )

    token = login_user(
        client,
        "company-list@example.com",
    )

    client.post(
        "/api/companies",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json=company_payload("Company One"),
    )

    client.post(
        "/api/companies",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json=company_payload("Company Two"),
    )

    response = client.get(
        "/api/companies",
        headers={
            "Authorization": f"Bearer {token}",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 2
    assert {item["name"] for item in data} == {
        "Company One",
        "Company Two",
    }


def test_get_single_company(client):
    register_user(
        client,
        "company-single@example.com",
    )

    token = login_user(
        client,
        "company-single@example.com",
    )

    create_response = client.post(
        "/api/companies",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json=company_payload(),
    )

    company_id = create_response.json()["id"]

    response = client.get(
        f"/api/companies/{company_id}",
        headers={
            "Authorization": f"Bearer {token}",
        },
    )

    assert response.status_code == 200
    assert response.json()["id"] == company_id


def test_update_company(client):
    register_user(
        client,
        "company-update@example.com",
    )

    token = login_user(
        client,
        "company-update@example.com",
    )

    create_response = client.post(
        "/api/companies",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json=company_payload(),
    )

    company_id = create_response.json()["id"]

    response = client.patch(
        f"/api/companies/{company_id}",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json={
            "name": "Updated Company",
            "website": "https://updated.example.com",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["name"] == "Updated Company"
    assert data["website"] == "https://updated.example.com"


def test_delete_company(client):
    register_user(
        client,
        "company-delete@example.com",
    )

    token = login_user(
        client,
        "company-delete@example.com",
    )

    create_response = client.post(
        "/api/companies",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json=company_payload(),
    )

    company_id = create_response.json()["id"]

    response = client.delete(
        f"/api/companies/{company_id}",
        headers={
            "Authorization": f"Bearer {token}",
        },
    )

    assert response.status_code == 204

    get_response = client.get(
        f"/api/companies/{company_id}",
        headers={
            "Authorization": f"Bearer {token}",
        },
    )

    assert get_response.status_code == 404
