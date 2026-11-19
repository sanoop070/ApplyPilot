from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.repositories.company_repository import company_repository
from app.schemas.company import (
    CompanyCreate,
    CompanyResponse,
    CompanyUpdate,
)


router = APIRouter(
    prefix="/api/companies",
    tags=["Companies"],
)


@router.post(
    "",
    response_model=CompanyResponse,
    status_code=201,
)
def create_company(
    company_data: CompanyCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> CompanyResponse:
    return company_repository.create(
        db=db,
        name=company_data.name,
        website=company_data.website,
        careers_url=company_data.careers_url,
        description=company_data.description,
    )


@router.get(
    "",
    response_model=list[CompanyResponse],
)
def get_companies(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[CompanyResponse]:
    return company_repository.get_all(db)


@router.get(
    "/{company_id}",
    response_model=CompanyResponse,
)
def get_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> CompanyResponse:
    company = company_repository.get_by_id(
        db,
        company_id,
    )

    if company is None:
        raise HTTPException(
            status_code=404,
            detail="Company not found.",
        )

    return company


@router.patch(
    "/{company_id}",
    response_model=CompanyResponse,
)
def update_company(
    company_id: int,
    company_data: CompanyUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> CompanyResponse:
    company = company_repository.get_by_id(
        db,
        company_id,
    )

    if company is None:
        raise HTTPException(
            status_code=404,
            detail="Company not found.",
        )

    update_data = company_data.model_dump(
        exclude_unset=True
    )

    return company_repository.update(
        db,
        company,
        update_data,
    )


@router.delete(
    "/{company_id}",
    status_code=204,
)
def delete_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    company = company_repository.get_by_id(
        db,
        company_id,
    )

    if company is None:
        raise HTTPException(
            status_code=404,
            detail="Company not found.",
        )

    company_repository.delete(
        db,
        company,
    )
