from typing import Dict, List, Optional
from pydantic import BaseModel


class CropDefinition(BaseModel):
    canonical_name: str
    display_name: str
    category: str
    aliases: List[str]
    external_commodity_name: str


class CropService:
    """
    Deterministic Crop Master & Normalization Engine.
    Validates and normalizes crop names without any LLM calls.
    Supports dynamic crop onboarding for any agricultural commodity.
    """

    MASTER_CROPS: Dict[str, CropDefinition] = {
        "tomato": CropDefinition(
            canonical_name="Tomato",
            display_name="Tomato",
            category="Vegetable",
            aliases=["tomato", "tomatoes", "hybrid tomato", "local tomato", "tamatar"],
            external_commodity_name="Tomato",
        ),
        "onion": CropDefinition(
            canonical_name="Onion",
            display_name="Onion",
            category="Vegetable",
            aliases=["onion", "onions", "red onion", "bulb onion", "pyaz", "kanda"],
            external_commodity_name="Onion",
        ),
        "chilli": CropDefinition(
            canonical_name="Chilli",
            display_name="Chilli",
            category="Spices",
            aliases=["chilli", "chili", "green chilli", "red chilli", "mirchi", "chillies"],
            external_commodity_name="Chilli Green",
        ),
        "potato": CropDefinition(
            canonical_name="Potato",
            display_name="Potato",
            category="Vegetable",
            aliases=["potato", "potatoes", "aalo", "aloo"],
            external_commodity_name="Potato",
        ),
        "banana": CropDefinition(
            canonical_name="Banana",
            display_name="Banana",
            category="Fruit",
            aliases=["banana", "bananas", "kela"],
            external_commodity_name="Banana",
        ),
        "wheat": CropDefinition(
            canonical_name="Wheat",
            display_name="Wheat",
            category="Cereal",
            aliases=["wheat", "gehun", "gehu"],
            external_commodity_name="Wheat",
        ),
        "rice": CropDefinition(
            canonical_name="Rice",
            display_name="Rice",
            category="Cereal",
            aliases=["rice", "paddy", "chawal", "dhan"],
            external_commodity_name="Paddy(Dhan)",
        ),
        "cotton": CropDefinition(
            canonical_name="Cotton",
            display_name="Cotton",
            category="Fiber",
            aliases=["cotton", "kapas"],
            external_commodity_name="Cotton",
        ),
        "garlic": CropDefinition(
            canonical_name="Garlic",
            display_name="Garlic",
            category="Spices",
            aliases=["garlic", "lahsun"],
            external_commodity_name="Garlic",
        ),
        "ginger": CropDefinition(
            canonical_name="Ginger",
            display_name="Ginger",
            category="Spices",
            aliases=["ginger", "adrak"],
            external_commodity_name="Ginger(Green)",
        ),
        "maize": CropDefinition(
            canonical_name="Maize",
            display_name="Maize",
            category="Cereal",
            aliases=["maize", "corn", "makka", "bhutta"],
            external_commodity_name="Maize",
        ),
        "mango": CropDefinition(
            canonical_name="Mango",
            display_name="Mango",
            category="Fruit",
            aliases=["mango", "mangoes", "aam"],
            external_commodity_name="Mango",
        ),
        "apple": CropDefinition(
            canonical_name="Apple",
            display_name="Apple",
            category="Fruit",
            aliases=["apple", "apples", "seb"],
            external_commodity_name="Apple",
        ),
    }

    @classmethod
    def normalize_crop(cls, user_input: str) -> CropDefinition:
        """
        Normalizes any input string to a canonical CropDefinition deterministically.
        If the crop is not in aliases, dynamically constructs a clean title-cased crop model.
        """
        if not user_input or not user_input.strip():
            return cls.MASTER_CROPS["tomato"]

        raw = user_input.strip()
        cleaned = raw.lower()

        # Direct alias matching
        for key, crop_def in cls.MASTER_CROPS.items():
            if cleaned == key or cleaned in [a.lower() for a in crop_def.aliases]:
                return crop_def

        # Dynamic fallback for new/unlisted agricultural crops
        title_cased = raw.title()
        return CropDefinition(
            canonical_name=title_cased,
            display_name=title_cased,
            category="General Agriculture",
            aliases=[cleaned],
            external_commodity_name=title_cased,
        )

    @classmethod
    def get_supported_crops(cls) -> List[CropDefinition]:
        return list(cls.MASTER_CROPS.values())
