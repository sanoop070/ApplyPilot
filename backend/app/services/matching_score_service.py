from app.schemas.matching import MatchingEvidence


class MatchingScoreService:
    """
    Deterministic candidate-to-job scoring engine.

    The LLM extracts evidence.
    Python owns the numerical scoring.
    """

    REQUIRED_SKILLS_WEIGHT = 55.0
    EXPERIENCE_WEIGHT = 15.0
    EDUCATION_WEIGHT = 10.0
    NICE_TO_HAVE_WEIGHT = 5.0
    PROJECT_WEIGHT = 15.0

    INCOMPATIBLE_EXPERIENCE_PENALTY = 18.0
    UNCERTAINTY_PENALTY = 1.0

    DIRECT_WEIGHT = 1.0
    TRANSFERABLE_WEIGHT = 0.70
    PARTIAL_WEIGHT = 0.40

    @classmethod
    def calculate(
        cls,
        evidence: MatchingEvidence,
        total_required_skills: int,
        total_nice_to_have_skills: int,
    ) -> float:
        required_score = cls._required_skill_score(
            evidence,
            total_required_skills,
        )

        nice_to_have_score = cls._nice_to_have_score(
            evidence,
            total_nice_to_have_skills,
        )

        experience_score = cls._evidence_score(
            evidence.relevant_experience
        )

        education_score = cls._evidence_score(
            evidence.education_match
        )

        project_score = cls._evidence_score(
            evidence.relevant_projects
        )

        score = (
            required_score
            * cls.REQUIRED_SKILLS_WEIGHT
            / 100
            + experience_score
            * cls.EXPERIENCE_WEIGHT
            / 100
            + education_score
            * cls.EDUCATION_WEIGHT
            / 100
            + nice_to_have_score
            * cls.NICE_TO_HAVE_WEIGHT
            / 100
            + project_score
            * cls.PROJECT_WEIGHT
            / 100
        )

        score -= cls._experience_level_penalty(
            evidence
        )

        score -= cls._uncertainty_penalty(
            evidence
        )

        return round(
            max(
                0.0,
                min(
                    100.0,
                    score,
                ),
            ),
            2,
        )

    @classmethod
    def _skill_credit(
        cls,
        match_type: str,
    ) -> float:
        return {
            "direct": cls.DIRECT_WEIGHT,
            "transferable": cls.TRANSFERABLE_WEIGHT,
            "partial": cls.PARTIAL_WEIGHT,
        }.get(
            match_type,
            cls.PARTIAL_WEIGHT,
        )

    @classmethod
    def _required_skill_score(
        cls,
        evidence: MatchingEvidence,
        total_required_skills: int,
    ) -> float:
        if total_required_skills <= 0:
            return 100.0

        weighted_credit = sum(
            cls._skill_credit(
                item.match_type
            )
            for item
            in evidence.matched_required_skills
        )

        base_score = (
            weighted_credit
            / total_required_skills
        ) * 100

        if evidence.matched_required_skills:
            confidence_values = [
                item.confidence
                for item
                in evidence.matched_required_skills
            ]

            average_confidence = (
                sum(confidence_values)
                / len(confidence_values)
            )

            confidence_adjustment = (
                (average_confidence - 70.0)
                / 30.0
            ) * 5.0

            base_score += confidence_adjustment

        return max(
            0.0,
            min(
                100.0,
                base_score,
            ),
        )

    @classmethod
    def _nice_to_have_score(
        cls,
        evidence: MatchingEvidence,
        total_nice_to_have_skills: int,
    ) -> float:
        if total_nice_to_have_skills <= 0:
            return 100.0

        weighted_credit = sum(
            cls._skill_credit(
                item.match_type
            )
            for item
            in evidence.matched_nice_to_have
        )

        return min(
            100.0,
            (
                weighted_credit
                / total_nice_to_have_skills
            ) * 100,
        )

    @staticmethod
    def _evidence_score(
        evidence: list[str],
    ) -> float:
        if not evidence:
            return 0.0

        return min(
            100.0,
            55.0
            + (
                len(evidence)
                * 20.0
            ),
        )

    @classmethod
    def _experience_level_penalty(
        cls,
        evidence: MatchingEvidence,
    ) -> float:
        level = evidence.experience_level

        if level is None:
            return 0.0

        if level.compatible:
            return 0.0

        if level.confidence < 70:
            return 0.0

        return cls.INCOMPATIBLE_EXPERIENCE_PENALTY

    @classmethod
    def _uncertainty_penalty(
        cls,
        evidence: MatchingEvidence,
    ) -> float:
        if not evidence.uncertainties:
            return 0.0

        return min(
            cls.UNCERTAINTY_PENALTY
            * len(evidence.uncertainties),
            5.0,
        )


matching_score_service = MatchingScoreService()
