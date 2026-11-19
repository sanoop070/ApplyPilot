from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.company import Company


class CompanyRepository:
    @staticmethod
    def create(
        db: Session,
        name: str,
        website: str | None = None,
        careers_url: str | None = None,
        description: str | None = None,
    ) -> Company:
        company = Company(
            name=name,
            website=website,
            careers_url=careers_url,
            description=description,
        )

        db.add(company)
        db.commit()
        db.refresh(company)

        return company

    @staticmethod
    def get_by_id(
        db: Session,
        company_id: int,
    ) -> Company | None:
        return db.get(Company, company_id)

    @staticmethod
    def get_all(
        db: Session,
    ) -> list[Company]:
        statement = (
            select(Company)
            .order_by(Company.name.asc())
        )

        return list(db.scalars(statement).all())

    @staticmethod
    def update(
        db: Session,
        company: Company,
        data: dict,
    ) -> Company:
        for field, value in data.items():
            setattr(company, field, value)

        db.commit()
        db.refresh(company)

        return company

    @staticmethod
    def delete(
        db: Session,
        company: Company,
    ) -> None:
        db.delete(company)
        db.commit()


company_repository = CompanyRepository()
