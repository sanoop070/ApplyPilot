from pydantic import BaseModel, Field


class SkillEvidence(BaseModel):
    skill: str
    evidence: str
    confidence: float = Field(ge=0, le=100)
    match_type: str = "direct"


class JobRequirements(BaseModel):
    required_skills: list[str]
    nice_to_have_skills: list[str]
    responsibilities: list[str]


class CandidateProfile(BaseModel):
    skills: list[str]
    experience_evidence: list[str]
    education_evidence: list[str]
    project_evidence: list[str]


class ExperienceLevelEvidence(BaseModel):
    candidate_level: str
    role_level: str
    compatible: bool
    evidence: str
    confidence: float = Field(ge=0, le=100)


class MatchingEvidence(BaseModel):
    matched_required_skills: list[SkillEvidence]
    missing_required_skills: list[str]

    matched_nice_to_have: list[SkillEvidence]
    missing_nice_to_have: list[str]

    relevant_experience: list[str]
    relevant_projects: list[str]
    education_match: list[str]

    experience_level: ExperienceLevelEvidence | None = None

    uncertainties: list[str]
